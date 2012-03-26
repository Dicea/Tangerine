(function() {
  var DateTimePageView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DateTimePageView = (function(_super) {

    __extends(DateTimePageView, _super);

    function DateTimePageView() {
      DateTimePageView.__super__.constructor.apply(this, arguments);
    }

    DateTimePageView.prototype.events = {
      'click #create_new_id': 'createNewId',
      'keyup #student_id': 'verifyId'
    };

    DateTimePageView.prototype.initialize = function(data) {
      var dateTime, day, minutes, month, time, year;
      console.log("new date time page with");
      console.log(data);
      data = data.model;
      dateTime = new Date();
      year = dateTime.getFullYear();
      month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][dateTime.getMonth()];
      day = dateTime.getDate();
      minutes = dateTime.getMinutes();
      if (minutes < 10) minutes = "0" + minutes;
      time = dateTime.getHours() + ":" + minutes;
      return this.content = "      <form>        <div>          <label for='student_id'>Student Identifier</label>          <input type='text' id='student_id' />          <div id='student_id_message'></div>          <button id='create_new_id'>Create New ID</button>        </div>        <div>          <label for='year'>Year</label>          <input type='number' id='year' value='" + year + "' />        </div>        <div>          <label for='month'>Month</label>          <input type='month' id='month' value='" + month + "'/>        </div>        <div>          <label for='day'>Day</label>          <input type='number' id='day' value='" + day + "' />        </div>        <div>          <label for='time'>Time</label>          <input type='time' id='time' value='" + time + "' />        </div>      </form>      ";
    };

    DateTimePageView.prototype.createNewId = function() {
      $("#student_id_message").html("");
      return $('#student_id').val(Checkdigit.randomIdentifier());
    };

    DateTimePageView.prototype.verifyId = function() {
      var isValid;
      $("#student_id_message").html("");
      $('input#student_id').val($('input#student_id').val().toUpperCase());
      isValid = Checkdigit.isValidIdentifier($('input#student_id').val());
      if (isValid !== true) return $("#student_id_message").html(isValid);
    };

    DateTimePageView.prototype.validate = function() {
      var isValid;
      isValid = Checkdigit.isValidIdentifier($('input#student_id').val());
      if (isValid !== true) return isValid;
      return DateTimePageView.__super__.validate.call(this);
    };

    return DateTimePageView;

  })(SubtestPageView);

}).call(this);
