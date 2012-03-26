var UntimedSubtestLinked,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

UntimedSubtestLinked = (function(_super) {

  __extends(UntimedSubtestLinked, _super);

  function UntimedSubtestLinked(options) {
    var linkedPageName,
      _this = this;
    this.linkedToPageId = options.linkedToPageId;
    this.questionIndices = options.questionIndices;
    this.footerMessage = footerMessage;
    UntimedSubtestLinked.__super__.constructor.call(this, options);
    linkedPageName = this.linkedToPageId.underscore().titleize();
    this.content += "<div id='" + this.pageId + "-not-enough-progress-message' style='display:hidden'>Not enough progress was made on " + linkedPageName + " to show questions from " + (this.name()) + ". Continue by pressing Next.</div>";
    $("#" + this.pageId).live('pageshow', function(eventData) {
      var attemptedOnLinkedPage, index, inputElement, _len, _ref;
      attemptedOnLinkedPage = $.assessment.result(_this.linkedToPageId).attempted;
      _this.numberInputFieldsShown = 0;
      _ref = $("#" + _this.pageId + " input[type='radio']");
      for (index = 0, _len = _ref.length; index < _len; index++) {
        inputElement = _ref[index];
        if (attemptedOnLinkedPage < _this.questionIndices[$(inputElement).attr("data-question-index")]) {
          $(inputElement).parents("div[data-role='fieldcontain']").hide();
        } else {
          $(inputElement).parents("div[data-role='fieldcontain']").show();
          _this.numberInputFieldsShown++;
        }
      }
      return $("div#" + _this.pageId + "-not-enough-progress-message").toggle(_this.numberInputFieldsShown === 0);
    });
  }

  UntimedSubtestLinked.prototype.propertiesForSerialization = function() {
    var properties;
    properties = UntimedSubtestLinked.__super__.propertiesForSerialization.call(this);
    properties = properties.concat(["questions", "linkedToPageId", "questionIndices"]);
    return properties;
  };

  UntimedSubtestLinked.prototype.validate = function() {
    var numberOfQuestionsAnswered, numberOfQuestionsShown;
    numberOfQuestionsShown = this.numberInputFieldsShown / 3;
    numberOfQuestionsAnswered = _.size(this.results());
    if (numberOfQuestionsAnswered === numberOfQuestionsShown) {
      return true;
    } else {
      return "Only " + numberOfQuestionsAnswered + " out of the " + numberOfQuestionsShown + " questions were answered";
    }
  };

  UntimedSubtestLinked.deserialize = function(pageObject) {
    var untimedSubtest;
    untimedSubtest = new UntimedSubtestLinked(pageObject);
    untimedSubtest.load(pageObject);
    return untimedSubtest;
  };

  return UntimedSubtestLinked;

})(UntimedSubtest);
