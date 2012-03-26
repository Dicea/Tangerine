class ToggleGridWithTimer extends SubtestPage
  constructor: (options) ->
    # TODO switch to use items instead of letters
    @letters = options.items ? options.letters
    if options?.numberOfColumns
      @numberOfColumns = options.numberOfColumns
    else
      if @letters.length > 80
        @numberOfColumns = 10
      else
        @numberOfColumns = 5

    if options.includeAutostop?
      @includeAutostop = options.includeAutostop
    else
      @includeAutostop = true

    @autostopAmount = options.autostopAmount || @letters.length/10

    @footerMessage = footerMessage
    super(options)
    @addTimer
      seconds: options?.seconds || 60
      onStop: ->
        $('input[name=mode][value=last-item]').prop('checked', true)
        $.assessment.flash()

    result = "<table><tr>"
    for letter,index in @letters
      result += "<td class='grid columns-#{@numberOfColumns}'><span class='grid-text' >#{letter}</span></td>"
      if ((index+1) % @numberOfColumns == 0)
        result += "<td class='toggle-row grid #{"toggle-row-portrait" unless ((index+1) % @numberOfColumns == 0)}'><span class='grid-text '>*</span></td></tr><tr>"
    result += "</tr></table>"

    @content =  "
      <div class='enumerator-help'>#{options.enumeratorHelp}</div>
      <div class='student-dialog'>#{options.studentDialog}</div>
      <div class='timer'>
        <button class='timer-button'>start</button><span class='timer-seconds'></span>
      </div>
      <div class='toggle-grid-with-timer' data-role='content'>	
        <form>
          <div class='grid-width'>
            #{result}
          </div>
        </form>
      </div>
      <small>
      <fieldset data-type='horizontal'>
        <legend>Mode</legend>
        <label for='correctIncorrectMode'>Correct/Incorrect</label><input id='correctIncorrectMode' name='mode' type='radio' value='correct-incorrect' checked='true'>
        <label for='lastItemMode'>Last Item</label><input id='lastItemMode' name='mode' type='radio' value='last-item'>
      </fieldset>
      </small>
      <div class='timer'>
        <button class='timer-button'>stop</button><span class='timer-seconds'></span>
      </div>
      <button>reset timer</button>
      <span id='confirm-reset' style='display:none;padding:5px;background-color:red;border:solid 1px'>Are you sure?<button>Yes, reset</button><button>No</button></span>
      "
    
    
    $("##{@pageId}").live "pageshow", (eventData) =>
      # Start with first grid, downsize each grid until it fits. Then set all to new size
      gridWidth = $("##{@pageId} .grid:first").width()
      fontSize = $("##{@pageId} .grid:first span").css('font-size')
      fontSize = fontSize.substr(0,fontSize.indexOf("px")) # Strip the px
      for letterSpan in $("##{@pageId} .grid span")
        letterSpan = $(letterSpan)
        letterSpan.css('font-size', "#{fontSize}px")
        safetyCounter = 0
        while letterSpan.width() > gridWidth and safetyCounter < 100
          letterSpan.css('font-size', "#{fontSize--}px")
          safetyCounter++
      $("##{@pageId} .grid span").css('font-size', "#{fontSize}px")

    # Use the right event type for touchscreens vs mouse
    selectEvent = if ('ontouchstart' of document.documentElement) then "touchstart" else "click"

    $("##{@pageId} button:contains(reset timer)").live selectEvent, (eventData) =>
      $("#confirm-reset").stop(true,true).show().fadeOut(5000)

    $("##{@pageId} button:contains(No)").live selectEvent, (eventData) =>
      $("#confirm-reset").hide()

    $("##{@pageId} button:contains(Yes, reset)").live selectEvent, (eventData) =>
      $('input[name=mode][value=correct-incorrect]').prop('checked', true)
      @wasReset = true
      @timer.stop()
      @timer.reset()
      $("#confirm-reset").hide()

    $("##{@pageId} .grid").live selectEvent, (eventData) =>
      return unless @timer.started
      target = $(eventData.currentTarget)
      if $('input[name=mode]:checked').val() == "last-item"
        return if target.hasClass("toggle-row")
        for gridItem,index in $("##{@pageId} .grid:not(.toggle-row)")
          lastSelectedIndex = index if $(gridItem).hasClass("selected")
          lastAttemptedIndex = index if gridItem == eventData.currentTarget
        return if lastAttemptedIndex < lastSelectedIndex
        $("##{@pageId} .grid").removeClass('last-attempted')
        target.toggleClass('last-attempted')
      else
        for gridItem,index in $("##{@pageId} .grid:not(.toggle-row)")
          lastAttemptedIndex = index if $(gridItem).hasClass("last-attempted")
          lastSelectedIndex = index if gridItem == eventData.currentTarget
        return if lastAttemptedIndex < lastSelectedIndex
        target.toggleClass("selected")

    $("##{@pageId} .grid.toggle-row").live selectEvent, (eventData) =>
      toggleRow = $(eventData.currentTarget)
      for gridItem in toggleRow.prevAll()
        gridItem = $(gridItem)
        break if gridItem.hasClass("toggle-row") and gridItem.css("display") != "none"
        # We want to be able to handle mistaken rowtoggles - so keep track of what was already selected so we can revert
        if toggleRow.hasClass("selected")
          # Need to turn everthing on
          gridItem.addClass("selected rowtoggled") unless gridItem.hasClass("selected")
        else
          # Need to turn off only non toggled
          gridItem.removeClass("selected rowtoggled") if gridItem.hasClass("rowtoggled")

  results: ->
    unless @assessment.currentPage.pageId == @pageId
      return @lastResult

    @lastResult = {}

    # Check if the first 10% are all wrong, if so auto_stop
    items = $("##{@pageId} .grid:not(.toggle-row)")
    @autoStopItems = items[0..@autostopAmount-1]
    if @includeAutostop and _.select(@autoStopItems, (item) -> $(item).hasClass("selected")).length == @autostopAmount
      @lastResult.auto_stop = true
      # Only set do this stuff the first time
      unless @autostop
        $(_.last(@autoStopItems)).toggleClass("last-attempted", true)
        @timer.stop()
        $.assessment.flash()
        @autostop = true
    else
      @autostop = false

    @lastResult.was_reset = true if @wasReset?
    @lastResult.time_remain = @timer.seconds
    return @lastResult unless @timer.hasStartedAndStopped() #optimization
    @lastResult.items = new Array()
    # Initialize to all wrong
    @lastResult.items[index] = false for gridItem,index in $("##{@pageId} .grid:not(.toggle-row)")
    @lastResult.attempted = null
    for gridItem,index in $("##{@pageId} .grid:not(.toggle-row)")
      gridItem = $(gridItem)
      @lastResult.items[index] = true unless gridItem.hasClass("selected")
      if gridItem.hasClass("last-attempted")
        @lastResult.attempted = index + 1
        if @autostop
          $(".validation-message").html("First #{@autostopAmount} incorrect - autostop.")
        else
          $(".validation-message ").html("")
        return @lastResult
      else
        $(".validation-message ").html("Select last item attempted")

    return @lastResult

  validate: ->
    results = @results()
    if results.time_remain == 60 or results.time_remain == undefined
      return "The timer must be started"
    if @timer.running
      return "The timer is still running"
    if results.time_remain == 0
      return true
    else if results.attempted?
      return true
    else
      return "The last letter attempted has not been selected"



