class SchoolPage extends SubtestPage
  constructor: (options) ->
    super(options)
    @schools = options.schools
    @selectNameText = options.selectNameText

    #TODO change these to be generic eg level1, level2 or something
    properties = ["name","district","province","schoolId"]
  
    # Load from the object
    for property in properties
      this[property + "Text"] = options[property + "Text"]

    listAttributes = ""
    for dataAttribute in properties
      listAttributes += "data-#{dataAttribute}='{{#{dataAttribute}}}' "

    listElement = "<li style='display:none' #{listAttributes}>{{district}} - {{province}} - {{name}}</li>"

    inputElements = ""
    for dataAttribute in properties
      inputElements += "
      <div data-role='fieldcontain'>
        <label for='#{dataAttribute}'>{{#{dataAttribute}Text}}</label>
        <input type='text' name='#{dataAttribute}' id='#{dataAttribute}'></input>
      </div>
      "
    template = "
      <div>
        <h4>
          {{selectSchoolText}}
        </h4>
      </div>
      <form id='{{pageId}}-form'>
        #{inputElements}
      </form>
      <ul>
        {{#schools}}
          #{listElement}
        {{/schools}}
      </ul>
      <br/>
      <br/>
    "
    @schoolTemplate = Handlebars.compile template

    @content = @schoolTemplate(this)

    $("div##{@pageId} form##{@pageId}-form input").live "propertychange keyup input paste", (event) =>
      currentName = $(event.target).val()
      for school in $("div##{@pageId} li")
        school = $(school)
        school.hide()
        school.show() if school.html().match(new RegExp(currentName, "i"))

    console.log "div##{@pageId} li"
    $("div##{@pageId} li").live "click", (eventData) =>
      $(school).hide() for school in $("div##{@pageId} li")
      selectedElement = $(eventData.currentTarget)
      for dataAttribute in ["name","province","district","schoolId"]
        $("div##{@pageId} form input##{dataAttribute}").val(selectedElement.attr("data-#{dataAttribute}"))

  propertiesForSerialization: ->
    properties = super()
    properties.push("schools")
    properties.push("selectNameText")
    properties.push(property+"Text") for property in ["name","province","district","schoolId"]
    return properties



  validate: ->
    for inputElement in $("div##{@pageId} form input")
      if $(inputElement).val() == ""
        return "'#{$("label[for="+inputElement.id+"]").html()}' is empty"
    return true

SchoolPage.deserialize = (pageObject) ->
  schoolPage = new SchoolPage(pageObject)
  schoolPage.load(pageObject)
  schoolPage.content = schoolPage.template(schoolPage._schoolTemplate(),schoolPage)
  return schoolPage

