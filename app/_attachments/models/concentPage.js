var ConsentPage,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ConsentPage = (function(_super) {

  __extends(ConsentPage, _super);

  function ConsentPage(options) {
    ConsentPage.__super__.constructor.call(this, options);
    $('#save-reset').live("click", function() {
      $.assessment.saveResults();
      return $.assessment.reset();
    });
  }

  ConsentPage.prototype.validate = function() {
    if ($("div#" + this.pageId + " input#consent-yes:checked").length > 0) {
      return true;
    } else if ($("div#" + this.pageId + " input#consent-no:checked").length > 0) {
      return "Click to confirm that the child has not consented <button id='save-reset'>Confirm</button>";
    } else {
      return "You must answer the consent question";
    }
  };

  return ConsentPage;

})(TextPage);
