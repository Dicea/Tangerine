var ResultCollection,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ResultCollection = (function(_super) {

  __extends(ResultCollection, _super);

  function ResultCollection() {
    ResultCollection.__super__.constructor.apply(this, arguments);
  }

  ResultCollection.prototype.model = Result;

  ResultCollection.prototype.url = '/result';

  return ResultCollection;

})(Backbone.Collection);
