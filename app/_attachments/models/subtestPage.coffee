footerMessage = "Good effort, let's go onto the next page"

# This disables the "Go" button from submitting the form on Android keyboards
$('form').live 'submit', (event,ui) ->
  return false

$('button:contains(Skip assessment)').live 'click', (event,ui) ->
  page = $.assessment.currentPage
  page.nextPage.render()
  page.lastResult = {skipped: true}

# This really should be an abstract class.
class SubtestPage extends Backbone.Model
  # TODO convert all subclassed classes to use the options constructor, get rid of deserialize, load, etc.

  initialize: (options) ->
    @pageId    = options?.pageId     || ""
    @pageType  = options?.pageType   || this.constructor.toString().match(/function +(.*?)\(/)[1]
    @allowSkip = options?.allowSkip? && options.allowSkip

  renderNextPage: ->
    validationResult = @validate()
    unless validationResult is true
      $("##{@pageId} div.validation-message").html("").stop( true, true).show().html(validationResult).fadeOut(5000)
      return
    @results() # Saves the current result to @lastResult
    @nextPage.render()

  propertiesForSerialization: -> [
    "pageId"
    "pageType"
    "urlPath"
    "urlScheme"
  ]

  name: ->
    # Insert spaces and do proper casing
    @pageId.underscore().titleize()

  load: (data) ->
    for property in @propertiesForSerialization()
      this[property] = data[property]

  toPaper: ->
    @content

  addTimer: (options) ->
    @timer = new Timer
      page: this
      startTime: options.seconds
      onStop: options.onStop

  # By default we expect all input fields to be filled


  results: ->
    unless @assessment.currentPage.pageId == @pageId
      return @lastResult

    @lastResult = null

    objectData = {}
    $.each $("div##{@pageId} form").serializeArray(), () ->
      if this.value?
        value = this.value
      else
        value = ''

      if objectData[this.name]?
        unless objectData[this.name].push
          objectData[this.name] = [objectData[this.name]]

        objectData[this.name].push value
      else
        objectData[this.name] = value

    @lastResult = objectData
    return @lastResult

  @validateCurrentPageUpdateNextButton: ->
    return unless $.assessment?
    passedValidation = ($.assessment.currentPage.validate() is true)
    $("div##{$.assessment.currentPage.pageId} button:contains(Next)").toggleClass("passedValidation", passedValidation)

  @loadFromCouchDB: (urlPath, callback) ->
    console.log "trying to load from couch"
    return @loadFromHTTP({url:$.couchDBDatabasePath+urlPath}, callback)

  @loadFromHTTP: (options, callback) =>
    console.log "attempting the following"
    console.log options
    console.log callback.toString()
    throw "Must pass 'url' option to loadFromHTTP, received: #{options}" unless options.url?
    if options.url.match(/http/)
      urlPath = options.url.substring(options.url.lastIndexOf("://")+3)
    else
      urlPath = options.url
        
    $.extend options,
      type: 'GET',
      dataType: 'json',
      success: (result) =>
        #try
          subtestPage = SubtestPage.deserialize(result)
          subtestPage.urlPath = urlPath
          subtestPage.urlScheme = "http"
          subtestPage.revision = result._rev
          console.log "this subtest page is " + subtestPage
          callback?(subtestPage)
        #catch error
          console.log "this error: " + error
          console.log "Error in SubtestPage.loadFromHTTP: while loading the following object:"
          console.log result
      error: ->
        throw "Failed to load: #{urlPath}"
    console.log "ajax: " + $.ajax options
    
  


#TODO Fix this
# Should not need these separate deserialize just use the last generic one and the constructor
SubtestPage.deserialize = (pageObject) ->
  switch pageObject.pageType
    when "UntimedSubtest"
      return UntimedSubtest.deserialize(pageObject)
    when "UntimedSubtestLinked"
      return UntimedSubtestLinked.deserialize(pageObject)
    when "PhonemePage"
      return PhonemePage.deserialize(pageObject)
    else
      result = new window[pageObject.pageType](pageObject)
      result.load(pageObject)
      return result

SubtestPage.loadFromLocalStorage = (urlPath) ->
  subtestPage = SubtestPage.deserialize(JSON.parse(localStorage[urlPath]))
  subtestPage.urlScheme = "localstorage"
  return subtestPage

#setInterval(SubtestPage.validateCurrentPageUpdateNextButton, 800)

# Show validation errors in a dialog page
$('div.ui-footer button').live 'click', (event,ui) ->
  validationResult = $.assessment.currentPage.validate()
  if validationResult is true
    button = $(event.currentTarget)
    $.mobile.changePage(button.attr("href"))
  else
    $("#_infoPage div[data-role='content']").html(
      "Please fix the following before proceeding:<br/>" +
      validationResult
    )
    $.mobile.changePage("#_infoPage")


