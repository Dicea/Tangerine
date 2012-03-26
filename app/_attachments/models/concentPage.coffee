class ConsentPage extends TextPage
  constructor: (options) ->
    super(options)
    $('#save-reset').live "click", ->
      $.assessment.saveResults()
      $.assessment.reset()
      

  validate: ->
    if $("div##{@pageId} input#consent-yes:checked").length > 0
      return true
    else if $("div##{@pageId} input#consent-no:checked").length > 0
      return "Click to confirm that the child has not consented <button id='save-reset'>Confirm</button>"
    else
      return "You must answer the consent question"
