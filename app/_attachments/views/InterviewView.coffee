class InterviewView extends SubtestPageView
  contentTemplate: Handlebars.compile "
    <form>
      {{#questions}}
        <fieldset data-name='{{name}}' {{#if onChange}}onChange=\"{{{onChange}}}\"{{/if}}   data-type='{{type}}' data-role='controlgroup'>
          <legend>{{label}}</legend>
          {{#options}}
            <label for='{{id}}'>{{text}}</label>
            <input type='{{#if ../multiple}}checkbox{{else}}radio{{/if}}' name='{{../name}}' value='{{text}}' id='{{id}}'></input>
          {{/options}}
        </fieldset>
      {{/questions}}
    </form>
  "
  
  initialize: ( options ) ->
    super(options)
    @questions = @model.attributes.questions
    
    for question in @questions
      question.options = _.map(question.options, (option) ->
        text: option
        id: (question.name + "-" + option.replace(/[^a-zA-Z0-9]/g,"")).toLowerCase()
      )
      if question.onChange?
        question.onChange = Handlebars.compile(question.onChange)(question)
    
    @content = @contentTemplate @model.attributes
    
  validate: ->
    names = ($(fieldset).attr("data-name") for fieldset in $("div##{@pageId} form fieldset"))
    for name in names
      question = $("input[name=#{name}]")
      continue if question.attr("type") == 'text' and question.val() != ""
      unless question.is(":checked")
        return $("input[name=#{name}]").first().parent().find("legend").html() + " is not complete"
    return true
