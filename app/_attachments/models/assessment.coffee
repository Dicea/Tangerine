# Global assessment object
$.assessment = null

class Assessment extends Backbone.Model

  url: '/assessment'

  replicate: (target,options) ->
    $("#message").html "Syncing to #{target}"
    replicationLogEntry = new ReplicationLogEntry
      timestamp: new Date().getTime()
      source: @get "_id"
      target: target
    replicationLogEntry.save()

    # TODO TEST that this actually works! (filtered replication!)
    ajaxOptions =
      success: ->
        options.success()
      error: (res) ->
        $("#message").html "Error: #{res}"
    replicationOptions =
      filter: Tangerine.design_doc_name + "/resultFilter"
      query_params:
        assessmentId: @get "_id"
    $.couch.replicate(Tangerine.database_name, target, ajaxOptions, replicationOptions)

  lastCloudReplication: (options) ->
    assessmentId = @get "id"
    replicationLogEntryCollection  = new ReplicationLogEntryCollection()
    replicationLogEntryCollection.fetch
      success: ->
        mostRecentReplicationLogEntry = replicationLogEntryCollection.first() # just for initialization
        replicationLogEntryCollection.each (replicationLogEntry) ->
          return unless replicationLogEntry.source is assessmentId
          mostRecentReplicationLogEntry = replicationLogEntry if replicationLogEntry.timestamp > mostRecentReplicationLogEntry.timestamp
        if mostRecentReplicationLogEntry
          options?.success?(mostRecentReplicationLogEntry)
        else
          options?.error?()

  initialize: ->
    _.bindAll @, 'fetch', 'addPage', 'render', 'linkPages', 'doAssessment'
    @pages = []
    @fetch

  loadSubtests: ( options ) ->
    @fetch
      success: =>
        @changeName(@get("name"))
        @urlPathsForPages = @get "urlPathsForPages"
        @subtestsToLoad = @urlPathsForPages.length
        for urlPath, index in @urlPathsForPages
          one_subtest = new Subtest { _id : urlPath }
          one_subtest.fetch
            success: ( model ) =>
              @addPage model
              @subtestsToLoad--
              if @subtestsToLoad == 0 
                console.log "done loading"
                @linkPages()
                options.success()

  # this function depends on @urlPathsForPages being good
  addPage: ( subtest_model ) ->
    index = _.indexOf @urlPathsForPages, subtest_model.id
    subtest_model.assessment = @
    subtest_model.pageNumber = index
    subtest_model.urlScheme = @urlScheme
    subtest_model.urlPath = @urlPath + "." + subtest_model.pageId
    @pages[index] = subtest_model
  
  linkPages: ->
    for subtest_model, index in @pages
      subtest_model.previousPage = @pages[index - 1] unless index     == 0
      subtest_model.nextPage     = @pages[index + 1] unless index + 1 == @pages.length

  render: ->
    $.assessment = this # I think this is also Tangerine.assessment
    @pages[0].render()

  changeName: (newName) ->
    @name = newName
    @urlPath = "Assessment.#{@name}"
    @urlPathsForPages = []
    if @pages?
      for page in @pages
        page.urlPath = @urlPath + "." + page.pageId

  targetDatabase: ->
    name = @name || @get("name")
    name.toLowerCase().dasherize()
  
  setPages: (pages) ->
    @pages = pages
    @urlPathsForPages = []
    for page, index in @pages
      @addPage page, index
  

    
  getPage: (pageId) ->
    for page in @pages
      return page if page.pageId is pageId

  insertPage: (page, pageNumber) ->
    @pages.splice(pageNumber,0,page)
    @setPages(@pages)

  loginPage: ->
    $.assessment.pages[0]

  currentUser: ->
    return @loginPage().results().username

  currentPassword: ->
    return @loginPage().results().password

  hasUserAuthenticated: ->
    loginResults = @loginPage().results()
    return loginResults.username != "" and loginResults.password != ""

  result: (pageId) ->
    for page in @pages
      return page.results() if page.pageId == pageId

  results: ->
    results = {}
    for page in @pages
      results[page.pageId] = page.results()
      results[page.pageId]["subtestType"] = page.pageType
    results.timestamp = new Date().valueOf()
    results.enumerator = $('#enumerator').html()
    results.assessmentId = @get("_id")
    return results

  saveResults: (callback) ->
    result = new Result(@results())
    result.save
      success: ->
        callback?(results)
      error: =>
        alert "Results NOT saved - do you have permission to save?"
        throw "Could not save result #{@results()}"

  resetURL: ->
    #document.location.origin + document.location.pathname + document.location.search
    document.location.pathname + document.location.search

  reset: ->
    document.location = @resetURL()
    
#  onReady: (callback) ->
#    maxTries = 10
#    timesTried = 0
#    checkIfLoading: =>
#      timesTried++
#      if @loading
#        throw "Timeout error while waiting for assessment: #{@name}" if timesTried >= maxTries
#        setTimeout(checkIfLoading, 1000)
#        return
#      for page in @pages
#        if page.loading
#          throw "Timeout error while waiting for page: #{page.pageId}" if timesTried >= maxTries
#          setTimeout(checkIfLoading, 1000)
#          return
#      callback()
#    return checkIfLoading()



  flash: ->
    $('body').addClass("flash").pause(2000).removeClass("flash");


  toPaper: (callback) ->
    @onReady =>
      result = for page,i in @pages
        "<div class='subtest #{page.pageType}'><h1>#{page.name()}</h1>" + page.toPaper() + "</div>"
      result = result.join("<div class='page-break'><hr/></div>")
      callback(result) if callback?
      return result

  handleURLParameters: ->
    # Fill in forms from GET parameters
    # Taken from:
    # http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript
    return if @urlParams?
    @urlParams = {}
    a = /\+/g
    r = /([^&=]+)=?([^&]*)/g
    d = (s) ->
      return decodeURIComponent(s.replace(a, " "))
    q = window.location.search.substring(1)
    while (e = r.exec(q))
      @urlParams[d(e[1])] = d(e[2])

    for param,value of @urlParams
      $("input##{param}").val(value)

    if @urlParams.newAssessment
# TODO Refactor
      unless ($.assessment.currentPage.pageId == "DateTime" or $.assessment.currentPage.pageId == "Login")
        $.mobile.changePage("DateTime") unless ($.assessment.currentPage.pageId == "DateTime" or $.assessment.currentPage.pageId == "Login")
        document.location = document.location.href
