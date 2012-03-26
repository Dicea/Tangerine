var UntimedSubtest,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

UntimedSubtest = (function(_super) {

  __extends(UntimedSubtest, _super);

  function UntimedSubtest(options) {
    var answer, answerSanitized, index, question, questionSanitized, _ref;
    this.questions = options.questions;
    this.answerOptions = (_ref = options.answerOptions) != null ? _ref : ["Correct", "Incorrect", "No response"];
    UntimedSubtest.__super__.constructor.call(this, options);
    this.footerMessage = footerMessage;
    this.content = ("      <div class='enumerator-help'>" + options.enumeratorHelp + "</div>      <div class='student-dialog'>" + options.studentDialog + "</div>      <form>") + ((function() {
      var _len, _ref2, _results;
      _ref2 = this.questions;
      _results = [];
      for (index = 0, _len = _ref2.length; index < _len; index++) {
        question = _ref2[index];
        questionSanitized = question.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase().dasherize();
        _results.push(("        <div data-role='fieldcontain'>            <fieldset data-role='controlgroup' data-type='horizontal'>              <legend>" + question + "</legend>        ") + ((function() {
          var _i, _len2, _ref3, _results2;
          _ref3 = this.answerOptions;
          _results2 = [];
          for (_i = 0, _len2 = _ref3.length; _i < _len2; _i++) {
            answer = _ref3[_i];
            answerSanitized = answer.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase().dasherize();
            _results2.push("          <label for='" + questionSanitized + "-" + answerSanitized + "'>" + answer + "</label>          <input type='radio' data-question-index='" + index + "' name='" + questionSanitized + "' id='" + questionSanitized + "-" + answerSanitized + "' value='" + answer + "' />          ");
          }
          return _results2;
        }).call(this)).join("") + "            </fieldset>        </div>        ");
      }
      return _results;
    }).call(this)).join("") + "</form>";
  }

  UntimedSubtest.prototype.propertiesForSerialization = function() {
    var properties;
    properties = UntimedSubtest.__super__.propertiesForSerialization.call(this);
    properties.push("questions");
    return properties;
  };

  UntimedSubtest.prototype.validate = function() {
    if (_.size(this.results()) === this.questions.length) {
      return true;
    } else {
      return "Only " + (_.size(this.results())) + " out of the " + this.questions.length + " questions were answered";
    }
  };

  return UntimedSubtest;

})(SubtestPage);

UntimedSubtest.deserialize = function(pageObject) {
  var untimedSubtest;
  untimedSubtest = new UntimedSubtest(pageObject);
  untimedSubtest.load(pageObject);
  return untimedSubtest;
};
