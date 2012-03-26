class Dictation extends SubtestPage
  constructor: (options) ->
    @message = options.message
    @footerMessage = footerMessage
    super(options)

    @content =  "#{@message}<br/><input name='result' type='text'></input>"

  propertiesForSerialization: ->
    properties = super()
    properties.push("message")
    return properties

  results: ->
    unless @assessment.currentPage.pageId == @pageId
      return @lastResult

    @lastResult = {}
    enteredData = $("div##{@pageId} input[type=text]").val()

    if enteredData.match(/boys/i)
      @lastResult["Wrote boys correctly"] = 2
    else
      if enteredData.match(/bo|oy|by/i)
        @lastResult["Wrote boys correctly"] = 1

    if enteredData.match(/bikes/i)
      @lastResult["Wrote bikes correctly"] = 2
    else
      if enteredData.match(/bi|ik|kes/i)
        @lastResult["Wrote bikes correctly"] = 1

    numberOfSpaces = enteredData.split(" ").length - 1
    if numberOfSpaces >= 8
      @lastResult["Used appropriate spacing between words"] = 2
    else
      if numberOfSpaces > 3 and numberOfSpaces < 8
        @lastResult["Used appropriate spacing between words"] = 1
      else
        @lastResult["Used appropriate spacing between words"] = 0

    # TODO
    @lastResult["Used appropriate direction of text (left to right)"] = 2

    if enteredData.match(/The/)
      @lastResult["Used capital letter for the word 'The'"] = 2
    else
      @lastResult["Used capital letter for the word 'The'"] = 0

    if enteredData.match(/\. *$/)
      @lastResult["Used full stop (.) at end of sentence."] = 2
    else
      @lastResult["Used full stop (.) at end of sentence."] = 0
    return @lastResult

  validate: ->
    return true

  @deserialize: (pageObject) ->
    dictationPage = new Dictation(pageObject)
    dictationPage.load(pageObject)
    return dictationPage
