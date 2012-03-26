var Dictation,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Dictation = (function(_super) {

  __extends(Dictation, _super);

  function Dictation(options) {
    this.message = options.message;
    this.footerMessage = footerMessage;
    Dictation.__super__.constructor.call(this, options);
    this.content = "" + this.message + "<br/><input name='result' type='text'></input>";
  }

  Dictation.prototype.propertiesForSerialization = function() {
    var properties;
    properties = Dictation.__super__.propertiesForSerialization.call(this);
    properties.push("message");
    return properties;
  };

  Dictation.prototype.results = function() {
    var enteredData, numberOfSpaces;
    if (this.assessment.currentPage.pageId !== this.pageId) return this.lastResult;
    this.lastResult = {};
    enteredData = $("div#" + this.pageId + " input[type=text]").val();
    if (enteredData.match(/boys/i)) {
      this.lastResult["Wrote boys correctly"] = 2;
    } else {
      if (enteredData.match(/bo|oy|by/i)) {
        this.lastResult["Wrote boys correctly"] = 1;
      }
    }
    if (enteredData.match(/bikes/i)) {
      this.lastResult["Wrote bikes correctly"] = 2;
    } else {
      if (enteredData.match(/bi|ik|kes/i)) {
        this.lastResult["Wrote bikes correctly"] = 1;
      }
    }
    numberOfSpaces = enteredData.split(" ").length - 1;
    if (numberOfSpaces >= 8) {
      this.lastResult["Used appropriate spacing between words"] = 2;
    } else {
      if (numberOfSpaces > 3 && numberOfSpaces < 8) {
        this.lastResult["Used appropriate spacing between words"] = 1;
      } else {
        this.lastResult["Used appropriate spacing between words"] = 0;
      }
    }
    this.lastResult["Used appropriate direction of text (left to right)"] = 2;
    if (enteredData.match(/The/)) {
      this.lastResult["Used capital letter for the word 'The'"] = 2;
    } else {
      this.lastResult["Used capital letter for the word 'The'"] = 0;
    }
    if (enteredData.match(/\. *$/)) {
      this.lastResult["Used full stop (.) at end of sentence."] = 2;
    } else {
      this.lastResult["Used full stop (.) at end of sentence."] = 0;
    }
    return this.lastResult;
  };

  Dictation.prototype.validate = function() {
    return true;
  };

  Dictation.deserialize = function(pageObject) {
    var dictationPage;
    dictationPage = new Dictation(pageObject);
    dictationPage.load(pageObject);
    return dictationPage;
  };

  return Dictation;

})(SubtestPage);
