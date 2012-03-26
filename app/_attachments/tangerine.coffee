class Router extends Backbone.Router
  routes:
    "assessment/:id": "assessment"
    "result/:database_name/:id": "result"
    "results/tabular/:database_name": "tabular_results"
    "results/tabular/:database_name/*options": "tabular_results"
    "results/:database_name": "results"
    "print/:id": "print"
    "student_printout/:id": "student_printout"
    "login": "login"
    "logout": "logout"
    "manage": "manage"
    "edit/assessment/:assessment_id/subtest/:subtest_id": "editSubtest"
    "edit/assessment/:assessment_id": "editAssessment"
    "assessments": "assessments"
    "": "assessments"

  editSubtest: (assessment_id,subtest_id) ->
    @verify_logged_in
      success: ->
        assessment = new Assessment
          _id: assessment_id
        assessment.fetch
          success: ->
            Tangerine.subtestEdit ?= new SubtestEdit()
            Tangerine.subtestEdit.assessment = assessment
            Tangerine.subtestEdit.model = new Subtest
              _id: subtest_id
            Tangerine.subtestEdit.model.fetch
              success: ->
                Tangerine.subtestEdit.render()

  editAssessment: (assessment_id) ->
    @verify_logged_in
      success: ->
        assessment = new Assessment
          _id: assessment_id
        assessment.fetch
          success: ->
            Tangerine.assessmentEdit ?= new AssessmentEdit()
            Tangerine.assessmentEdit.model = new Assessment(assessment.attributes)
            Tangerine.assessmentEdit.render()
                

  results: (database_name) ->
    @verify_logged_in
      success: ->
        Tangerine.resultsView ?= new ResultsView()
        Tangerine.resultsView.databaseName = database_name
        Tangerine.resultsView.render()


  tabular_results: (database_name) ->
    @verify_logged_in
      success: ->
        view = "reports/fields"
# TODO - figure out what to do about this limit
        limit= 10000000
        $("#content").html("Loading maximum of #{limit} items from view: #{view} from #{database_name}")
        $.couch.db(database_name).view view,
          reduce: true
          group: true
          success: (result) ->
            uniqueFields = _.pluck result.rows, "key"

            $.couch.db(database_name).view view,
              reduce: false
              limit: limit
              success: (tableResults) ->
                Tangerine.resultsView ?= new ResultsView()
                options = jQuery.deparam.querystring(jQuery.param.fragment())
                Tangerine.resultsView.uniqueFields = uniqueFields
                Tangerine.resultsView.tableResults = tableResults
                Tangerine.resultsView.renderTable(options)
              

  result: (database_name,id) ->
    @verify_logged_in
      success: ->
        $.couch.db(database_name).openDoc id,
          success: (doc) =>
            Tangerine.resultView ?= new ResultView()
            Tangerine.resultView.model = new Result(doc)
            $("#content").html Tangerine.resultView.render()

  manage: ->
    @verify_logged_in
      success: (session) ->
#        unless _.include(session.userCtx.roles, "_admin")
#          Tangerine.router.navigate("assessments", true) unless _.include(session.userCtx.roles, "admin")
#          return
        assessmentCollection = new AssessmentCollection()
        assessmentCollection.fetch
          success: ->
            Tangerine.manageView ?= new ManageView()
            Tangerine.manageView.render(assessmentCollection)

  assessments: ->
    @verify_logged_in
      success: ->
        Tangerine.assessmentListView ?= new AssessmentListView()
        Tangerine.assessmentListView.render()

  login: ->
    Tangerine.loginView ?= new LoginView()
    Tangerine.loginView.render()

  logout: ->
    $.couch.logout
      success: =>
        @handle_menu()
        $.enumerator = null
        $('#enumerator').html("Not logged in")
        Tangerine.router.navigate("login", true)

  assessment: (id) ->
    @verify_logged_in
      success: =>

        # This is terrible but it fixes my problem
        # Currently live click handlers get duplicated over and over again
        # Need to convert everything to backbone style views
        if Tangerine.assessment?
          location.reload()

        Tangerine.assessment = new Assessment { _id : id }
        Tangerine.assessment.doAssessment()
        #Tangerine.assessment.fetch
        #  success: =>
        #    Tangerine.assessment.render()

  verify_logged_in: (options) ->
    $.couch.session
      success: (session) =>
        $.enumerator = session.userCtx.name
        Tangerine.router.targetroute = document.location.hash
        unless session.userCtx.name
          Tangerine.router.navigate("login", true)
          return
        unless $.enumerator
          Tangerine.router.navigate("login", true)
          return
        $('#enumerator').html $.enumerator
        @handle_menu session
        options.success session

  # Admins get a manage button 
  # @TODO this might not be the right place for this
  # @TODO UI: reevaluate menu structure
  # @TODO default value is fragile, might want to make that more reliable
  handle_menu: ( session = { userCtx: { roles : ["not_logged_in"] } } ) ->
    user_roles = _.values session.userCtx.roles 
    # admin user
    if _.indexOf(user_roles, "_admin") != -1
      $( "#main_nav button" ).hide()
      $( "#collect_button, #manage_button, #logout_button" ).show()
    #not logged in
    else if _.indexOf(user_roles, "not_logged_in") != -1
      $( "#main_nav button" ).hide()
    #regular user
    else
      $( "#main_nav button" ).hide()
      $( "#collect_button, #logout_button" ).show()
      
  print: (id) ->
    Assessment.load id, (assessment) ->
      assessment.toPaper (result) ->
        style = "
          body{
            font-family: Arial;
          }
          .page-break{
            display: block;
            page-break-before: always;
          }
          input{
            height: 50px;  
            border: 1px
          }
        "
        $("body").html(result)
        # Remove the jquery mobile stylesheet
        $("link").remove()

  student_printout: (id) ->
    Assessment.load id, (assessment) ->
      assessment.toPaper (result) ->
        style = "
          <style>
            body{
              font-family: Arial;
              font-size: 200%;
            }
            .page-break{
              display: none;
            }
            input{
              height: 50px;  
              border: 1px;
            }
            .subtest.ToggleGridWithTimer{
              page-break-after: always;
              display:block;
              padding: 15px;
            }
            .subtest, button, h1{
              display:none;
            }
            .grid{
              display: inline;
              margin: 5px;
            }
          </style>
        "
        $("style").remove()
        $("body").html(result + style)
        $("span:contains(*)").parent().remove()
        # Remove the jquery mobile stylesheet
        $("link").remove()

        $('.grid').each (index) ->
          $(this).nextAll().andSelf().slice(0,10).wrapAll('<div class="grid-row"></div>') if( index % 10 == 0 )


# Initialization/Detection
$ -> # run after DOM loads

  # @TODO We should write some better database error checking.

  $("#version").load 'version'
  
  Tangerine.router = new Router()

  Backbone.history.start()

