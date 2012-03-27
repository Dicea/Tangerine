var SubtestPageView,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

SubtestPageView = (function(_super) {

  __extends(SubtestPageView, _super);

  function SubtestPageView() {
    SubtestPageView.__super__.constructor.apply(this, arguments);
  }

  SubtestPageView.prototype.el = "#content";

  SubtestPageView.prototype.template = Handlebars.compile("    <div class='subtest_page' id='{{pageId}}'>      <header>        <h1>{{name}}</h1>      </header>      <section class='main'>        {{enumeratorHelp}}                {{#if allowSkip}}          <a class='skip_subtest'>Skip this subtest</a>        {{/if}}        <div class='content'>{{{content}}}</div>      </section>      <footer>        <div class='validation-message'></div>        {{footerMessage}}        <a class='next_page'>Next</a>      </footer>    </div>    ");

  SubtestPageView.prototype.events = {
    "click .next_page": "renderNextPage"
  };

  SubtestPageView.prototype.initialize = function(options) {
    _.bindAll(this, 'render', 'getEnumeratorHelp', 'gotoNextPage');
    return this.options = options;
  };

  SubtestPageView.prototype.render = function() {
    this.renderFodder = {
      content: this.content,
      controls: this.controls,
      footerMessage: this.footerMessage,
      pageId: this.model.attributes.pageId,
      name: this.model.attributes.pageId.underscore().titleize(),
      enumeratorHelp: this.getEnumeratorHelp,
      allowSkip: this["false"]
    };
    console.log("Redner fodder");
    console.log(this.renderFodder);
    this.$el.html(this.template(this.renderFodder));
    $(".enumerator_help").accordion({
      collapsible: true,
      active: false
    });
    return window.scrollTo(0, 0);
  };

  SubtestPageView.prototype.getEnumeratorHelp = function() {
    var _ref, _ref2;
    console.log("getting enumerator help");
    if (((_ref = this.model) != null ? (_ref2 = _ref.attributes) != null ? _ref2.enumeratorHelp : void 0 : void 0) != null) {
      return "<div class='enumerator_help'>Help</div><div class='help_text'>" + this.model.attributes.enumeratorHelp + "</div>";
    } else {
      return "";
    }
  };

  SubtestPageView.prototype.renderNextPage = function() {
    var validationResult;
    console.log("trying to render next page");
    this.model.nextPage.render();
    validationResult = this.validate();
    if (validationResult !== true) {
      $("<p>" + validationResult + "</p>").dialog({
        model: true
      });
      $("#" + this.pageId + " div.validation-message").html("").stop(true, true).show().html(validationResult).fadeOut(5000);
      return;
    }
    this.results();
    return this.model.nextPage.render();
  };

  SubtestPageView.prototype.validate = function() {
    var inputElement, _i, _len, _ref;
    _ref = $("div#" + this.pageId + " form input");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      inputElement = _ref[_i];
      if ($(inputElement).val() === "") {
        return "'" + ($("label[for=" + inputElement.id + "]").html()) + "' is empty";
      }
    }
    return true;
  };

  return SubtestPageView;

})(Backbone.View);
