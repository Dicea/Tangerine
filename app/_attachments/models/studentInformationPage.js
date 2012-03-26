var StudentInformationPage,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

StudentInformationPage = (function(_super) {

  __extends(StudentInformationPage, _super);

  function StudentInformationPage(options) {
    var option, question, _i, _len, _ref, _ref2;
    StudentInformationPage.__super__.constructor.call(this, options);
    this.questions = (_ref = options.questions) != null ? _ref : options.radioButtons;
    this.enumeratorHelp = options.enumeratorHelp;
    this.studentDialog = options.studentDialog;
    _ref2 = this.questions;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      question = _ref2[_i];
      question.name = question.label.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase().dasherize();
      if (question.options != null) {
        question.options = (function() {
          var _j, _len2, _ref3, _results;
          _ref3 = question.options;
          _results = [];
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            option = _ref3[_j];
            _results.push({
              id: question.name + "-" + option.toLowerCase().dasherize(),
              label: option
            });
          }
          return _results;
        })();
      }
    }
    if (options.timer) {
      this.includeTimer = true;
      this.addTimer({
        seconds: options.timer,
        onStop: function() {
          return $.assessment.flash();
        }
      });
    }
    this.content = StudentInformationPage.template(this);
  }

  StudentInformationPage.prototype.validate = function() {
    var fieldset, name, names, question, _i, _len;
    names = (function() {
      var _i, _len, _ref, _results;
      _ref = $("div#" + this.pageId + " form fieldset");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fieldset = _ref[_i];
        _results.push($(fieldset).attr("data-name"));
      }
      return _results;
    }).call(this);
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      question = $("input[name=" + name + "]");
      if (question.attr("type") === 'text' && question.val() !== "") continue;
      if (!question.is(":checked")) {
        return $("input[name=" + name + "]").first().parent().find("legend").html() + " is not complete";
      }
    }
    return true;
  };

  return StudentInformationPage;

})(SubtestPage);

StudentInformationPage.template = Handlebars.compile("  <div class='enumerator-help'>{{enumeratorHelp}}</div>  <div class='student-dialog'>{{{studentDialog}}}</div>  {{#if includeTimer}}    <div class='timer'>      <button class='timer-button'>start</button>      <button class='timer-button'>stop</button>      <span class='timer-seconds'></span>    </div>  {{/if}}  <form>    {{#questions}}      <fieldset data-name='{{name}}' data-type='{{orientation}}' data-role='controlgroup'>        <legend>{{label}}</legend>        {{#if options}}          {{#options}}            <label for='{{id}}'>{{label}}</label>            <input type='radio' name='{{../name}}' value='{{label}}' id='{{id}}'></input>          {{/options}}        {{else}}          <input type='{{type}}' name='{{../name}}' id='{{id}}'></input>        {{/if}}      </fieldset>    {{/questions}}  </form>");
