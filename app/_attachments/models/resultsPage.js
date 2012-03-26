var ResultsPage,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ResultsPage = (function(_super) {

  __extends(ResultsPage, _super);

  function ResultsPage() {
    ResultsPage.__super__.constructor.apply(this, arguments);
  }

  ResultsPage.prototype.initialize = function(options) {
    ResultsPage.__super__.initialize.call(this, options);
    return this.content = Handlebars.compile("      <div class='message'>        You have finished assessment <span class='randomIdForSubject'></span>. Thank the child with a small gift. Please write <span class='randomIdForSubject'></span> on the writing sample.      </div>      <div data-role='collapsible' data-collapsed='true' class='results'>        You have finished:        <h3>Results</h3>        <div>        </div>        <form>          <label for='comment'>Comments (if any):</label>          <textarea style='width:80%' id='comment' name='resultComment'></textarea>        </form>      </div>      <div class='resultsMessage'>      </div>      <button type='button'>Save Results</button>    ");
  };

  ResultsPage.prototype.load = function(data) {
    var _this = this;
    ResultsPage.__super__.load.call(this, data);
    return $("div#" + this.pageId).live("pageshow", function() {
      $("div#" + _this.pageId + " div span[class='randomIdForSubject']").html($("#current-student-id"));
      $("button:contains(Next)").hide();
      if (Tangerine.resultView == null) Tangerine.resultView = new ResultView();
      Tangerine.resultView.model = new Result($.assessment.results());
      $("div#" + _this.pageId + " div[data-role='content'] div.results div").html(Tangerine.resultView.render());
      $('.sparkline').sparkline('html', {
        type: 'pie',
        sliceColors: ['black', '#F7C942', 'orangered']
      });
      $('button:contains(Save Results)').live("click", function() {
        var _this = this;
        return $.assessment.saveResults(function(results) {
          $("div.resultsMessage").html("Results Saved<br/><button>Start another assessment</button>");
          return $("button:contains(Save Results)").hide();
        });
      });
      return $('button:contains(Start another assessment)').live("click", function() {
        return location.reload(true);
      });
    });
  };

  return ResultsPage;

})(SubtestPage);
