class UntimedSubtest extends SubtestPage
  constructor: (options) ->
    @questions = options.questions
    @answerOptions = options.answerOptions ? ["Correct", "Incorrect", "No response"]
    super(options)
    @footerMessage = footerMessage
    @content = "
      <div class='enumerator-help'>#{options.enumeratorHelp}</div>
      <div class='student-dialog'>#{options.studentDialog}</div>
      <form>" + (for question,index in @questions
        questionSanitized = question.replace(/[^a-zA-Z0-9]/g," ").toLowerCase().dasherize()
        "
        <div data-role='fieldcontain'>
            <fieldset data-role='controlgroup' data-type='horizontal'>
              <legend>#{question}</legend>
        " +
        (for answer in @answerOptions
          answerSanitized = answer.replace(/[^a-zA-Z0-9]/g," ").toLowerCase().dasherize()
          "
          <label for='#{questionSanitized}-#{answerSanitized}'>#{answer}</label>
          <input type='radio' data-question-index='#{index}' name='#{questionSanitized}' id='#{questionSanitized}-#{answerSanitized}' value='#{answer}' />
          "
        ).join("") +
        "
            </fieldset>
        </div>
        "
      ).join("") + "</form>"

  propertiesForSerialization: ->
    properties = super()
    properties.push("questions")
    return properties

  validate: ->
    if _.size(@results()) == @questions.length
      return true
    else "Only #{_.size(@results())} out of the #{@questions.length} questions were answered"


UntimedSubtest.deserialize = (pageObject) ->
  untimedSubtest = new UntimedSubtest(pageObject)
  untimedSubtest.load(pageObject)
  return untimedSubtest