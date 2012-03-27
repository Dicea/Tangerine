class DateTimePageView extends SubtestPageView

  # @TODO fix janky inheritance
  childEvents:
    'click #create_new_id' : 'createNewId'
    'keyup #student_id'    : 'verifyId'
  
  initialize: (data) ->
    # @TODO fix janky inheritance
    @events = _.extend @events, @childEvents
    
    data = data.model
    
    dateTime = new Date()
    year     = dateTime.getFullYear()
    month    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][dateTime.getMonth()]
    day      = dateTime.getDate()
    minutes  = dateTime.getMinutes()
    minutes  = "0" + minutes if minutes < 10
    time     = dateTime.getHours() + ":" + minutes

    # NOTE: student_id has CSS property text-transform: uppercase. It only DISPLAYS uppercase.
    # When accessing the value, convert it to uppercase with .uppercase()
    @content = "
      <form>
        <div>
          <label for='student_id'>Student Identifier</label>
          <input type='text' id='student_id'>
          <div id='student_id_message'></div>
          <button id='create_new_id'>Create New ID</button>
        </div>
        <div>
          <label for='year'>Year</label>
          <input type='number' id='year' value='#{year}'>
        </div>
        <div>
          <label for='month'>Month</label>
          <input type='month' id='month' value='#{month}'>
        </div>
        <div>
          <label for='day'>Day</label>
          <input type='number' id='day' value='#{day}'>
        </div>
        <div>
          <label for='time'>Time</label>
          <input type='time' id='time' value='#{time}'>
        </div>
      </form>
      "

  createNewId: ->
    $("#student_id_message").html ""
    $('#student_id').val Checkdigit.randomIdentifier()

  verifyId: ->
    $("#student_id_message").html ""
    errors = Checkdigit.getErrors( $( 'input#student_id').val().toUpperCase() )
    if errors.length != 0 
      $("#student_id_message").html "<ul><li>"+errors.join("</li><li>") + "</li></ul>"

  validate: ->
    isValid = Checkdigit.isValidIdentifier($('input#student_id').val().toUpperCase())
    super()
    console.log "validating returns #{isValid}"
    return isValid
  