var ToggleGridWithTimer,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ToggleGridWithTimer = (function(_super) {

  __extends(ToggleGridWithTimer, _super);

  function ToggleGridWithTimer(options) {
    var index, letter, result, selectEvent, _len, _ref, _ref2,
      _this = this;
    this.letters = (_ref = options.items) != null ? _ref : options.letters;
    if (options != null ? options.numberOfColumns : void 0) {
      this.numberOfColumns = options.numberOfColumns;
    } else {
      if (this.letters.length > 80) {
        this.numberOfColumns = 10;
      } else {
        this.numberOfColumns = 5;
      }
    }
    if (options.includeAutostop != null) {
      this.includeAutostop = options.includeAutostop;
    } else {
      this.includeAutostop = true;
    }
    this.autostopAmount = options.autostopAmount || this.letters.length / 10;
    this.footerMessage = footerMessage;
    ToggleGridWithTimer.__super__.constructor.call(this, options);
    this.addTimer({
      seconds: (options != null ? options.seconds : void 0) || 60,
      onStop: function() {
        $('input[name=mode][value=last-item]').prop('checked', true);
        return $.assessment.flash();
      }
    });
    result = "<table><tr>";
    _ref2 = this.letters;
    for (index = 0, _len = _ref2.length; index < _len; index++) {
      letter = _ref2[index];
      result += "<td class='grid columns-" + this.numberOfColumns + "'><span class='grid-text' >" + letter + "</span></td>";
      if ((index + 1) % this.numberOfColumns === 0) {
        result += "<td class='toggle-row grid " + (!((index + 1) % this.numberOfColumns === 0) ? "toggle-row-portrait" : void 0) + "'><span class='grid-text '>*</span></td></tr><tr>";
      }
    }
    result += "</tr></table>";
    this.content = "      <div class='enumerator-help'>" + options.enumeratorHelp + "</div>      <div class='student-dialog'>" + options.studentDialog + "</div>      <div class='timer'>        <button class='timer-button'>start</button><span class='timer-seconds'></span>      </div>      <div class='toggle-grid-with-timer' data-role='content'>	        <form>          <div class='grid-width'>            " + result + "          </div>        </form>      </div>      <small>      <fieldset data-type='horizontal'>        <legend>Mode</legend>        <label for='correctIncorrectMode'>Correct/Incorrect</label><input id='correctIncorrectMode' name='mode' type='radio' value='correct-incorrect' checked='true'>        <label for='lastItemMode'>Last Item</label><input id='lastItemMode' name='mode' type='radio' value='last-item'>      </fieldset>      </small>      <div class='timer'>        <button class='timer-button'>stop</button><span class='timer-seconds'></span>      </div>      <button>reset timer</button>      <span id='confirm-reset' style='display:none;padding:5px;background-color:red;border:solid 1px'>Are you sure?<button>Yes, reset</button><button>No</button></span>      ";
    $("#" + this.pageId).live("pageshow", function(eventData) {
      var fontSize, gridWidth, letterSpan, safetyCounter, _i, _len2, _ref3;
      gridWidth = $("#" + _this.pageId + " .grid:first").width();
      fontSize = $("#" + _this.pageId + " .grid:first span").css('font-size');
      fontSize = fontSize.substr(0, fontSize.indexOf("px"));
      _ref3 = $("#" + _this.pageId + " .grid span");
      for (_i = 0, _len2 = _ref3.length; _i < _len2; _i++) {
        letterSpan = _ref3[_i];
        letterSpan = $(letterSpan);
        letterSpan.css('font-size', "" + fontSize + "px");
        safetyCounter = 0;
        while (letterSpan.width() > gridWidth && safetyCounter < 100) {
          letterSpan.css('font-size', "" + (fontSize--) + "px");
          safetyCounter++;
        }
      }
      return $("#" + _this.pageId + " .grid span").css('font-size', "" + fontSize + "px");
    });
    selectEvent = 'ontouchstart' in document.documentElement ? "touchstart" : "click";
    $("#" + this.pageId + " button:contains(reset timer)").live(selectEvent, function(eventData) {
      return $("#confirm-reset").stop(true, true).show().fadeOut(5000);
    });
    $("#" + this.pageId + " button:contains(No)").live(selectEvent, function(eventData) {
      return $("#confirm-reset").hide();
    });
    $("#" + this.pageId + " button:contains(Yes, reset)").live(selectEvent, function(eventData) {
      $('input[name=mode][value=correct-incorrect]').prop('checked', true);
      _this.wasReset = true;
      _this.timer.stop();
      _this.timer.reset();
      return $("#confirm-reset").hide();
    });
    $("#" + this.pageId + " .grid").live(selectEvent, function(eventData) {
      var gridItem, index, lastAttemptedIndex, lastSelectedIndex, target, _len2, _len3, _ref3, _ref4;
      if (!_this.timer.started) return;
      target = $(eventData.currentTarget);
      if ($('input[name=mode]:checked').val() === "last-item") {
        if (target.hasClass("toggle-row")) return;
        _ref3 = $("#" + _this.pageId + " .grid:not(.toggle-row)");
        for (index = 0, _len2 = _ref3.length; index < _len2; index++) {
          gridItem = _ref3[index];
          if ($(gridItem).hasClass("selected")) lastSelectedIndex = index;
          if (gridItem === eventData.currentTarget) lastAttemptedIndex = index;
        }
        if (lastAttemptedIndex < lastSelectedIndex) return;
        $("#" + _this.pageId + " .grid").removeClass('last-attempted');
        return target.toggleClass('last-attempted');
      } else {
        _ref4 = $("#" + _this.pageId + " .grid:not(.toggle-row)");
        for (index = 0, _len3 = _ref4.length; index < _len3; index++) {
          gridItem = _ref4[index];
          if ($(gridItem).hasClass("last-attempted")) lastAttemptedIndex = index;
          if (gridItem === eventData.currentTarget) lastSelectedIndex = index;
        }
        if (lastAttemptedIndex < lastSelectedIndex) return;
        return target.toggleClass("selected");
      }
    });
    $("#" + this.pageId + " .grid.toggle-row").live(selectEvent, function(eventData) {
      var gridItem, toggleRow, _i, _len2, _ref3, _results;
      toggleRow = $(eventData.currentTarget);
      _ref3 = toggleRow.prevAll();
      _results = [];
      for (_i = 0, _len2 = _ref3.length; _i < _len2; _i++) {
        gridItem = _ref3[_i];
        gridItem = $(gridItem);
        if (gridItem.hasClass("toggle-row") && gridItem.css("display") !== "none") {
          break;
        }
        if (toggleRow.hasClass("selected")) {
          if (!gridItem.hasClass("selected")) {
            _results.push(gridItem.addClass("selected rowtoggled"));
          } else {
            _results.push(void 0);
          }
        } else {
          if (gridItem.hasClass("rowtoggled")) {
            _results.push(gridItem.removeClass("selected rowtoggled"));
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    });
  }

  ToggleGridWithTimer.prototype.results = function() {
    var gridItem, index, items, _len, _len2, _ref, _ref2;
    if (this.assessment.currentPage.pageId !== this.pageId) return this.lastResult;
    this.lastResult = {};
    items = $("#" + this.pageId + " .grid:not(.toggle-row)");
    this.autoStopItems = items.slice(0, (this.autostopAmount - 1) + 1 || 9e9);
    if (this.includeAutostop && _.select(this.autoStopItems, function(item) {
      return $(item).hasClass("selected");
    }).length === this.autostopAmount) {
      this.lastResult.auto_stop = true;
      if (!this.autostop) {
        $(_.last(this.autoStopItems)).toggleClass("last-attempted", true);
        this.timer.stop();
        $.assessment.flash();
        this.autostop = true;
      }
    } else {
      this.autostop = false;
    }
    if (this.wasReset != null) this.lastResult.was_reset = true;
    this.lastResult.time_remain = this.timer.seconds;
    if (!this.timer.hasStartedAndStopped()) return this.lastResult;
    this.lastResult.items = new Array();
    _ref = $("#" + this.pageId + " .grid:not(.toggle-row)");
    for (index = 0, _len = _ref.length; index < _len; index++) {
      gridItem = _ref[index];
      this.lastResult.items[index] = false;
    }
    this.lastResult.attempted = null;
    _ref2 = $("#" + this.pageId + " .grid:not(.toggle-row)");
    for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
      gridItem = _ref2[index];
      gridItem = $(gridItem);
      if (!gridItem.hasClass("selected")) this.lastResult.items[index] = true;
      if (gridItem.hasClass("last-attempted")) {
        this.lastResult.attempted = index + 1;
        if (this.autostop) {
          $(".validation-message").html("First " + this.autostopAmount + " incorrect - autostop.");
        } else {
          $(".validation-message ").html("");
        }
        return this.lastResult;
      } else {
        $(".validation-message ").html("Select last item attempted");
      }
    }
    return this.lastResult;
  };

  ToggleGridWithTimer.prototype.validate = function() {
    var results;
    results = this.results();
    if (results.time_remain === 60 || results.time_remain === void 0) {
      return "The timer must be started";
    }
    if (this.timer.running) return "The timer is still running";
    if (results.time_remain === 0) {
      return true;
    } else if (results.attempted != null) {
      return true;
    } else {
      return "The last letter attempted has not been selected";
    }
  };

  return ToggleGridWithTimer;

})(SubtestPage);
