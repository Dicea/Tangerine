class StudentInformationPage extends SubtestPage
  constructor: (options) ->
    super(options)
    @questions = options.questions ? options.radioButtons
    @enumeratorHelp = options.enumeratorHelp
    @studentDialog = options.studentDialog
    # Create some id friendly attributes
    for question in @questions
      question.name = question.label.replace(/[^a-zA-Z0-9]/g," ").toLowerCase().dasherize()
      if question.options?
        question.options = for option in question.options
          {
            id : question.name + "-"+ option.toLowerCase().dasherize()
            label: option
          }
    if options.timer
      @includeTimer = true
      @addTimer
        seconds: options.timer
        onStop: ->
          $.assessment.flash()
    @content = StudentInformationPage.template(this)
        


  validate: ->
    names = ($(fieldset).attr("data-name") for fieldset in $("div##{@pageId} form fieldset"))
    for name in names
      question = $("input[name=#{name}]")
      continue if question.attr("type") == 'text' and question.val() != ""
      unless question.is(":checked")
        return $("input[name=#{name}]").first().parent().find("legend").html() + " is not complete"
    return true

StudentInformationPage.template = Handlebars.compile "
  <div class='enumerator-help'>{{enumeratorHelp}}</div>
  <div class='student-dialog'>{{{studentDialog}}}</div>
  {{#if includeTimer}}
    <div class='timer'>
      <button class='timer-button'>start</button>
      <button class='timer-button'>stop</button>
      <span class='timer-seconds'></span>
    </div>

  {{/if}}
  <form>
    {{#questions}}
      <fieldset data-name='{{name}}' data-type='{{orientation}}' data-role='controlgroup'>
        <legend>{{label}}</legend>
        {{#if options}}
          {{#options}}
            <label for='{{id}}'>{{label}}</label>
            <input type='radio' name='{{../name}}' value='{{label}}' id='{{id}}'></input>
          {{/options}}
        {{else}}
          <input type='{{type}}' name='{{../name}}' id='{{id}}'></input>
        {{/if}}
      </fieldset>
    {{/questions}}
  </form>
"
