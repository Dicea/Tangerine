class AssessmentListView extends Backbone.View
  initialize: ->

  el: '#content'

  templateTableRow: Handlebars.compile "
    <tr>
      <td>
        <div class='assessment-name'>{{name}}</div>
        <a href='#assessment/{{id}}'>Perform Assessment</a><br>
        <a href='#results/{{id}}/{{enumerator}}'>Results</a>
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

    assessmentCollection = new AssessmentCollection()
    assessmentCollection.fetch
      success: =>
        assessmentDetails = {}
        assessmentCollection.each (assessment) =>
          return if assessment.get("archived") is true
          assessmentDetails[assessment.get "_id"] =
            id : assessment.get "_id"
            name : assessment.get "name"
            enumerator : $.enumerator
            number_completed : 0

        resultCollection = new ResultCollection()
        resultCollection.fetch
          success: =>
            resultCollection.each (result) =>
              return unless result.get("enumerator") is $.enumerator
              assessmentDetails[result.get "assessmentId" ]["number_completed"]+=1

            _.each assessmentDetails, (value,key) =>
              @el.find("#assessments tbody").append @templateTableRow value

            $('table').tablesorter()

