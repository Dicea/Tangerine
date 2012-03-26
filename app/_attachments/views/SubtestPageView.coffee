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
    "click .next_page": "gotoNextPage"
    #"click .skip_subtest": "skipSubtest"

  initialize: (options) ->
    _.bindAll @, 'render', 'getEnumeratorHelp'
    @options = options

  # collects the little bits of template and renders
  render: ->
    console.log "Got told to render this:"
    console.log @
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

  gotoNextPage: ->
    console.log "event handled"
    console.log @
    @model.nextPage.render()