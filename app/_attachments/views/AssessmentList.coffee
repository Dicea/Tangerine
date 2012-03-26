class AssessmentListView extends Backbone.View
  initialize: ->

  el: '#content'

  templateTableRow: Handlebars.compile "
    <tr>
      <td>
        <div class='assessment-name'>{{name}}</div>
        <a href='#assessment/{{id}}'>Perform Assessment</a><br>
        <a href='#results/{{database_name}}'>Results</a>
      </td>
      <td class='number-completed-by-current-enumerator'>
        {{number_completed}}
      </td>
    </tr>
  "

  render: =>
    @$el.html "
      <h1>Collect</h1>
      <div id='message'></div>
      <table id='assessments' class='tablesorter'>
        <thead>
          <tr>
            <th>Assessment Name</th><th>Total Collected</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    "

    $("#assessments").tablesorter()

    assessmentCollection = new AssessmentCollection()
    assessmentCollection.fetch
      success: =>
        itemsToProcess = assessmentCollection.length
        assessmentCollection.each (assessment) =>
          if assessment.get("archived") is true
            itemsToProcess--
            return
          $.couch.db( assessment.targetDatabase() ).view "results/byEnumerator",
            group: true
            key: $.enumerator
            success: (result) =>
              @$el.find("#assessments tbody").append @templateTableRow
                name: assessment.get("name")
                number_completed: result.rows[0]?.value || "0"
                id: assessment.get("_id")
                database_name: assessment.targetDatabase()

              # Wait until all items have been added before adding the sorting/filtering
              if --itemsToProcess is 0
                $('table').tablesorter()

  #events:
  #  "click button.assessment-name": "loadAssessment"
  #  "click button.number-completed": "loadResults"

  #loadAssessment: (event) ->
  #  Tangerine.router.navigate("assessment/#{$(event.target).attr("data-target")}", true)
  #
  #loadResults: (event) ->
  #  Tangerine.router.navigate("results/#{$(event.target).attr("data-database-name")}", true)
  #