var AssessmentListView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

AssessmentListView = (function(_super) {

  __extends(AssessmentListView, _super);

  function AssessmentListView() {
    this.render = __bind(this.render, this);
    AssessmentListView.__super__.constructor.apply(this, arguments);
  }

  AssessmentListView.prototype.initialize = function() {};

  AssessmentListView.prototype.el = '#content';

<<<<<<< HEAD
  AssessmentListView.prototype.templateTableRow = Handlebars.compile("    <tr>      <td class='assessment-name'>        <a href='#assessment/{{id}}'>{{name}}</a>      </td>      <td class='number-completed-by-current-enumerator'>        <a href='#results/{{id}}/{{enumerator}}'>{{number_completed}}</a>      </td>    </tr>  ");
=======
  AssessmentListView.prototype.templateTableRow = Handlebars.compile("    <tr>      <td>        <div class='assessment-name'>{{name}}</div>        <a href='#assessment/{{id}}'>Perform Assessment</a><br>        <a href='#results/{{database_name}}'>Results</a>      </td>      <td class='number-completed-by-current-enumerator'>        {{number_completed}}      </td>    </tr>  ");
>>>>>>> feature/JQueryMobilePageRefactor

  AssessmentListView.prototype.render = function() {
    var assessmentCollection,
      _this = this;
<<<<<<< HEAD
    this.el.html("      <h1>Collect</h1>      <div id='message'></div>      <table id='assessments' class='tablesorter'>        <thead>          <tr>            <th>Assessment Name</th><th>Number Collected</th>          </tr>        </thead>        <tbody></tbody>      </table>    ");
=======
    this.$el.html("      <h1>Collect</h1>      <div id='message'></div>      <table id='assessments' class='tablesorter'>        <thead>          <tr>            <th>Assessment Name</th><th>Total Collected</th>          </tr>        </thead>        <tbody></tbody>      </table>    ");
    $("#assessments").tablesorter();
>>>>>>> feature/JQueryMobilePageRefactor
    assessmentCollection = new AssessmentCollection();
    return assessmentCollection.fetch({
      success: function() {
        var assessmentDetails, resultCollection;
        assessmentDetails = {};
        assessmentCollection.each(function(assessment) {
          if (assessment.get("archived") === true) return;
          return assessmentDetails[assessment.get("_id")] = {
            id: assessment.get("_id"),
            name: assessment.get("name"),
            enumerator: $.enumerator,
            number_completed: 0
          };
        });
        resultCollection = new ResultCollection();
        return resultCollection.fetch({
          success: function() {
            resultCollection.each(function(result) {
              if (result.get("enumerator") !== $.enumerator) return;
              return assessmentDetails[result.get("assessmentId")]["number_completed"] += 1;
            });
            _.each(assessmentDetails, function(value, key) {
              return _this.el.find("#assessments tbody").append(_this.templateTableRow(value));
            });
            return $('table').tablesorter();
          }
<<<<<<< HEAD
=======
          return $.couch.db(assessment.targetDatabase()).view("results/byEnumerator", {
            group: true,
            key: $.enumerator,
            success: function(result) {
              var _ref;
              _this.$el.find("#assessments tbody").append(_this.templateTableRow({
                name: assessment.get("name"),
                number_completed: ((_ref = result.rows[0]) != null ? _ref.value : void 0) || "0",
                id: assessment.get("_id"),
                database_name: assessment.targetDatabase()
              }));
              if (--itemsToProcess === 0) return $('table').tablesorter();
            }
          });
>>>>>>> feature/JQueryMobilePageRefactor
        });
      }
    });
  };

  return AssessmentListView;

})(Backbone.View);
