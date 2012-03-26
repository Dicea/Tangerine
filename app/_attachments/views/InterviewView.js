(function() {
  var InterviewView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  InterviewView = (function(_super) {

    __extends(InterviewView, _super);

    function InterviewView() {
      InterviewView.__super__.constructor.apply(this, arguments);
    }

    InterviewView.prototype.contentTemplate = Handlebars.compile("    <form>      {{#questions}}        <fieldset data-name='{{name}}' {{#if onChange}}onChange=\"{{{onChange}}}\"{{/if}}   data-type='{{type}}' data-role='controlgroup'>          <legend>{{label}}</legend>          {{#options}}            <label for='{{id}}'>{{text}}</label>            <input type='{{#if ../multiple}}checkbox{{else}}radio{{/if}}' name='{{../name}}' value='{{text}}' id='{{id}}'></input>          {{/options}}        </fieldset>      {{/questions}}    </form>  ");

    InterviewView.prototype.initialize = function(options) {
      var question, _i, _len, _ref;
      InterviewView.__super__.initialize.call(this, options);
      this.questions = this.model.attributes.questions;
      _ref = this.questions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        question = _ref[_i];
        question.options = _.map(question.options, function(option) {
          return {
            text: option,
            id: (question.name + "-" + option.replace(/[^a-zA-Z0-9]/g, "")).toLowerCase()
          };
        });
        if (question.onChange != null) {
          question.onChange = Handlebars.compile(question.onChange)(question);
        }
      }
      return this.content = this.contentTemplate(this.model.attributes);
    };

    InterviewView.prototype.validate = function() {
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

    return InterviewView;

  })(SubtestPageView);

}).call(this);
