class PhonemePage extends SubtestPage
  constructor: (@words) ->
    super()
    @subtestId = "phonemic-awareness"
    @footerMessage = footerMessage
    phonemeIndex = 1
    @content = "<form id='#{@subtestId}'>" + (for item,index in @words
      wordName = "#{@subtestId}.#{item.word}.identified-number"
      "
      <div data-role='fieldcontain'>
          <fieldset data-role='controlgroup' data-type='horizontal'>
            <legend>#{item["word"]}</legend>
            <fieldset data-role='controlgroup' data-type='horizontal'>
              <legend>Number of phonemes: #{item["number-of-sounds"]}</legend>
      " +
      (for answer in ["Correct", "Incorrect"]
        "
        <label for='#{wordName}-#{answer}'>#{answer}</label>
        <input type='radio' name='#{wordName}' id='#{wordName}-#{answer}' value='#{answer}' />
        "
      ).join("") +
      "
        </fieldset>
        <fieldset data-role='controlgroup' data-type='horizontal'>
          <legend>Phonemes identified</legend>
      " +
      (for phoneme in item["phonemes"]
        phonemeName = "#{@subtestId}.#{item.word}.phoneme-#{phoneme}"
        "
            <label for='#{phonemeName}'>#{phoneme}</label>
            <input type='checkbox' name='#{phonemeName}' id='#{phonemeName}' value='Correct'/>
        "
      ).join("") +  "
            </fieldset>
          </fieldset>
      </div>
      "
    ).join("") + "</form>"

  propertiesForSerialization: ->
    properties = super()
    properties.push("words")
    return properties

  results: ->
    unless @assessment.currentPage.pageId == @pageId
      return @lastResult

    @lastResult = null
    @lastResult = $("form##{@subtestId}").toObject({skipEmpty:false})

    return @lastResult

  validate: ->
    return true
    results = @results()
    for item,index in @words
      unless results[@subtestId + "-number-phonemes" + (index+1)]?
        return "You must select Correct or Incorrect for item ##{index+1}: <b>#{item["word"]}</b>"
    return true



PhonemePage.deserialize = (pageObject) ->
  page = new PhonemePage(pageObject.words)
  page.load(pageObject)
  return page
