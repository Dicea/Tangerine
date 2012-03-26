class UntimedSubtestLinked extends UntimedSubtest
  constructor: (options) ->
    @linkedToPageId = options.linkedToPageId
    @questionIndices = options.questionIndices
    @footerMessage = footerMessage
    super(options)

    linkedPageName = @linkedToPageId.underscore().titleize()
    @content += "<div id='#{@pageId}-not-enough-progress-message' style='display:hidden'>Not enough progress was made on #{linkedPageName} to show questions from #{@name()}. Continue by pressing Next.</div>"

    $("##{@pageId}").live 'pageshow', (eventData) =>
      attemptedOnLinkedPage = $.assessment.result(@linkedToPageId).attempted
      @numberInputFieldsShown = 0
      for inputElement,index in $("##{@pageId} input[type='radio']")
        if attemptedOnLinkedPage < @questionIndices[$(inputElement).attr("data-question-index")]
          $(inputElement).parents("div[data-role='fieldcontain']").hide()
        else
          $(inputElement).parents("div[data-role='fieldcontain']").show()
          @numberInputFieldsShown++
      $("div##{@pageId}-not-enough-progress-message").toggle(@numberInputFieldsShown == 0)
      
  propertiesForSerialization: ->
    properties = super()
    properties = properties.concat(["questions","linkedToPageId","questionIndices"])
    return properties

  validate: ->
    # Each question has three radio buttons, so divide by 3
    numberOfQuestionsShown = @numberInputFieldsShown/3
    numberOfQuestionsAnswered = _.size(@results())
    if numberOfQuestionsAnswered == numberOfQuestionsShown
      return true
    else "Only #{numberOfQuestionsAnswered} out of the #{numberOfQuestionsShown} questions were answered"

  @deserialize: (pageObject) ->
    untimedSubtest = new UntimedSubtestLinked(pageObject)
    untimedSubtest.load(pageObject)
    return untimedSubtest


