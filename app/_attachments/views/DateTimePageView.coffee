class DateTimePageView extends SubtestPageView



  events:
    'click #create_new_id' : 'createNewId'
    'keyup #student_id'    : 'verifyId'

  initialize: (data) ->
    
    console.log "new date time page with"
    console.log data
    data = data.model
    dateTime = new Date()
    year = dateTime.getFullYear()
    month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][dateTime.getMonth()]
    day = dateTime.getDate()
    minutes = dateTime.getMinutes()
    minutes = "0" + minutes if minutes < 10
    time = dateTime.getHours() + ":" + minutes

    @content = "
      <form>
        <div>
          <label for='student_id'>Student Identifier</label>
          <input type='text' id='student_id' />
          <div id='student_id_message'></div>
          <button id='create_new_id'>Create New ID</button>
        </div>
        <div>
          <label for='year'>Year</label>
          <input type='number' id='year' value='#{year}' />
        </div>
        <div>
          <label for='month'>Month</label>
          <input type='month' id='month' value='#{month}'/>
        </div>
        <div>
          <label for='day'>Day</label>
          <input type='number' id='day' value='#{day}' />
        </div>
        <div>
          <label for='time'>Time</label>
          <input type='time' id='time' value='#{time}' />
        </div>
      </form>
      "

  createNewId: ->
    $("#student_id_message").html ""
    $('#student_id').val Checkdigit.randomIdentifier()

  verifyId: ->
    $("#student_id_message").html ""
    $('input#student_id').val $('input#student_id').val().toUpperCase()
    isValid = Checkdigit.isValidIdentifier($('input#student_id').val())
    $("#student_id_message").html(isValid) unless isValid == true

  validate: ->
    isValid = Checkdigit.isValidIdentifier($('input#student_id').val())
    return isValid unless isValid == true
    super()

  