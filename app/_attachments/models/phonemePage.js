var PhonemePage,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

PhonemePage = (function(_super) {

  __extends(PhonemePage, _super);

  function PhonemePage(words) {
    var answer, index, item, phoneme, phonemeIndex, phonemeName, wordName;
    this.words = words;
    PhonemePage.__super__.constructor.call(this);
    this.subtestId = "phonemic-awareness";
    this.footerMessage = footerMessage;
    phonemeIndex = 1;
    this.content = ("<form id='" + this.subtestId + "'>") + ((function() {
      var _len, _ref, _results;
      _ref = this.words;
      _results = [];
      for (index = 0, _len = _ref.length; index < _len; index++) {
        item = _ref[index];
        wordName = "" + this.subtestId + "." + item.word + ".identified-number";
        _results.push(("      <div data-role='fieldcontain'>          <fieldset data-role='controlgroup' data-type='horizontal'>            <legend>" + item["word"] + "</legend>            <fieldset data-role='controlgroup' data-type='horizontal'>              <legend>Number of phonemes: " + item["number-of-sounds"] + "</legend>      ") + ((function() {
          var _i, _len2, _ref2, _results2;
          _ref2 = ["Correct", "Incorrect"];
          _results2 = [];
          for (_i = 0, _len2 = _ref2.length; _i < _len2; _i++) {
            answer = _ref2[_i];
            _results2.push("        <label for='" + wordName + "-" + answer + "'>" + answer + "</label>        <input type='radio' name='" + wordName + "' id='" + wordName + "-" + answer + "' value='" + answer + "' />        ");
          }
          return _results2;
        })()).join("") + "        </fieldset>        <fieldset data-role='controlgroup' data-type='horizontal'>          <legend>Phonemes identified</legend>      " + ((function() {
          var _i, _len2, _ref2, _results2;
          _ref2 = item["phonemes"];
          _results2 = [];
          for (_i = 0, _len2 = _ref2.length; _i < _len2; _i++) {
            phoneme = _ref2[_i];
            phonemeName = "" + this.subtestId + "." + item.word + ".phoneme-" + phoneme;
            _results2.push("            <label for='" + phonemeName + "'>" + phoneme + "</label>            <input type='checkbox' name='" + phonemeName + "' id='" + phonemeName + "' value='Correct'/>        ");
          }
          return _results2;
        }).call(this)).join("") + "            </fieldset>          </fieldset>      </div>      ");
      }
      return _results;
    }).call(this)).join("") + "</form>";
  }

  PhonemePage.prototype.propertiesForSerialization = function() {
    var properties;
    properties = PhonemePage.__super__.propertiesForSerialization.call(this);
    properties.push("words");
    return properties;
  };

  PhonemePage.prototype.results = function() {
    if (this.assessment.currentPage.pageId !== this.pageId) return this.lastResult;
    this.lastResult = null;
    this.lastResult = $("form#" + this.subtestId).toObject({
      skipEmpty: false
    });
    return this.lastResult;
  };

  PhonemePage.prototype.validate = function() {
    var index, item, results, _len, _ref;
    return true;
    results = this.results();
    _ref = this.words;
    for (index = 0, _len = _ref.length; index < _len; index++) {
      item = _ref[index];
      if (results[this.subtestId + "-number-phonemes" + (index + 1)] == null) {
        return "You must select Correct or Incorrect for item #" + (index + 1) + ": <b>" + item["word"] + "</b>";
      }
    }
    return true;
  };

  return PhonemePage;

})(SubtestPage);

PhonemePage.deserialize = function(pageObject) {
  var page;
  page = new PhonemePage(pageObject.words);
  page.load(pageObject);
  return page;
};
