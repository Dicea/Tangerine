class ResultsPage extends SubtestPage

  initialize: (options) ->
    super(options)
    @content = Handlebars.compile "
      <div class='message'>
        You have finished assessment <span class='randomIdForSubject'></span>. Thank the child with a small gift. Please write <span class='randomIdForSubject'></span> on the writing sample.
      </div>
      <div data-role='collapsible' data-collapsed='true' class='results'>
        You have finished:
        <h3>Results</h3>
        <div>
        </div>
        <form>
          <label for='comment'>Comments (if any):</label>
          <textarea style='width:80%' id='comment' name='resultComment'></textarea>
        </form>
      </div>
      <div class='resultsMessage'>
      </div>
      <button type='button'>Save Results</button>
    "

  load: (data) ->
    super(data)

    $("div##{@pageId}").live "pageshow", =>


      $("div##{@pageId} div span[class='randomIdForSubject']").html $("#current-student-id")

      $("button:contains(Next)").hide()

      Tangerine.resultView ?= new ResultView()
      Tangerine.resultView.model = new Result($.assessment.results())
      $("div##{@pageId} div[data-role='content'] div.results div").html Tangerine.resultView.render()
      $('.sparkline').sparkline 'html',
        type:'pie'
        sliceColors:['black','#F7C942','orangered']

      $('button:contains(Save Results)').live "click", ->
        $.assessment.saveResults (results) =>
          $("div.resultsMessage").html("Results Saved<br/><button>Start another assessment</button>")
          $("button:contains(Save Results)").hide()

      $('button:contains(Start another assessment)').live "click", ->
        location.reload(true)
