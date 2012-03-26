var TextPage,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

TextPage = (function(_super) {

  __extends(TextPage, _super);

  function TextPage() {
    TextPage.__super__.constructor.apply(this, arguments);
  }

  TextPage.prototype.propertiesForSerialization = function() {
    var properties;
    properties = TextPage.__super__.propertiesForSerialization.call(this);
    properties.push("content");
    return properties;
  };

  return TextPage;

})(SubtestPage);
