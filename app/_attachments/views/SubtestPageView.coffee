class SubtestPageView extends Backbone.View
  # At the end of initilialize all children should have a @content set
  
  el: "#content"

  template: Handlebars.compile "
    <div class='subtest_page' id='{{pageId}}'>
      <header>
        <h1>{{name}}</h1>
      </header>
      <section class='main'>
        {{enumeratorHelp}}
        
        {{#if allowSkip}}
          <a class='skip_subtest'>Skip this subtest</a>
        {{/if}}
        <div class='content'>{{{content}}}</div>
      </section>
      <footer>
        <div class='validation-message'></div>
        {{footerMessage}}
        <a class='next_page'>Next</a>
      </footer>
    </div>
    "

  events: 
    "click .next_page": "renderNextPage"
    #"click .skip_subtest": "skipSubtest"

  initialize: (options) ->
    _.bindAll @, 'render', 'getEnumeratorHelp', 'gotoNextPage'
    @options = options

  # collects the little bits of template and renders
  render: ->
    @renderFodder =
      content:        @content
      controls:       @controls
      footerMessage:  @footerMessage
      pageId:         @model.attributes.pageId
      name:           @model.attributes.pageId.underscore().titleize()
      enumeratorHelp: @getEnumeratorHelp
      allowSkip:      @false
    
    #@model.currentPage = this
    console.log "Redner fodder"
    console.log @renderFodder
    
    @$el.html @template @renderFodder

    $(".enumerator_help").accordion
      collapsible: true
      active: false

    window.scrollTo 0, 0

  getEnumeratorHelp: ->
    console.log "getting enumerator help"
    if @model?.attributes?.enumeratorHelp?
      "<div class='enumerator_help'>Help</div><div class='help_text'>#{@model.attributes.enumeratorHelp}</div>"
    else
      ""

  renderNextPage: ->
    console.log "trying to render next page"

    @model.nextPage.render()
    
    validationResult = @validate()
    unless validationResult is true
      $("<p>"+validationResult+"</p>").dialog
        model: true
      $("##{@pageId} div.validation-message").html("").stop( true, true).show().html(validationResult).fadeOut(5000)
      return
    @results() # Saves the current result to @lastResult
    @model.nextPage.render()

  validate: ->
    for inputElement in $("div##{@pageId} form input")
      if $(inputElement).val() == ""
        return "'#{$("label[for="+inputElement.id+"]").html()}' is empty"
    return true