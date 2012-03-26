var SubtestPage, footerMessage,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

footerMessage = "Good effort, let's go onto the next page";

$('form').live('submit', function(event, ui) {
  return false;
});

$('button:contains(Skip assessment)').live('click', function(event, ui) {
  var page;
  page = $.assessment.currentPage;
  page.nextPage.render();
  return page.lastResult = {
    skipped: true
  };
});

SubtestPage = (function(_super) {

  __extends(SubtestPage, _super);

  function SubtestPage() {
    SubtestPage.__super__.constructor.apply(this, arguments);
  }

  SubtestPage.prototype.initialize = function(options) {
    this.pageId = (options != null ? options.pageId : void 0) || "";
    this.pageType = (options != null ? options.pageType : void 0) || this.constructor.toString().match(/function +(.*?)\(/)[1];
    return this.allowSkip = ((options != null ? options.allowSkip : void 0) != null) && options.allowSkip;
  };

  SubtestPage.prototype.render = function() {};

  SubtestPage.prototype.renderNextPage = function() {
    var validationResult;
    validationResult = this.validate();
    if (validationResult !== true) {
      $("#" + this.pageId + " div.validation-message").html("").stop(true, true).show().html(validationResult).fadeOut(5000);
      return;
    }
    this.results();
    return this.nextPage.render();
  };

  SubtestPage.prototype.propertiesForSerialization = function() {
    return ["pageId", "pageType", "urlPath", "urlScheme"];
  };

  SubtestPage.prototype.name = function() {
    return this.pageId.underscore().titleize();
  };

  SubtestPage.prototype.load = function(data) {
    var property, _i, _len, _ref, _results;
    _ref = this.propertiesForSerialization();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      property = _ref[_i];
      _results.push(this[property] = data[property]);
    }
    return _results;
  };

  SubtestPage.prototype.toPaper = function() {
    return this.content;
  };

  SubtestPage.prototype.addTimer = function(options) {
    return this.timer = new Timer({
      page: this,
      startTime: options.seconds,
      onStop: options.onStop
    });
  };

  SubtestPage.prototype.validate = function() {
    var inputElement, _i, _len, _ref;
    _ref = $("div#" + this.pageId + " form input");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      inputElement = _ref[_i];
      if ($(inputElement).val() === "") {
        return "'" + ($("label[for=" + inputElement.id + "]").html()) + "' is empty";
      }
    }
    return true;
  };

  SubtestPage.prototype.results = function() {
    var objectData;
    if (this.assessment.currentPage.pageId !== this.pageId) return this.lastResult;
    this.lastResult = null;
    objectData = {};
    $.each($("div#" + this.pageId + " form").serializeArray(), function() {
      var value;
      if (this.value != null) {
        value = this.value;
      } else {
        value = '';
      }
      if (objectData[this.name] != null) {
        if (!objectData[this.name].push) {
          objectData[this.name] = [objectData[this.name]];
        }
        return objectData[this.name].push(value);
      } else {
        return objectData[this.name] = value;
      }
    });
    this.lastResult = objectData;
    return this.lastResult;
  };

  SubtestPage.validateCurrentPageUpdateNextButton = function() {
    var passedValidation;
    if ($.assessment == null) return;
    passedValidation = $.assessment.currentPage.validate() === true;
    return $("div#" + $.assessment.currentPage.pageId + " button:contains(Next)").toggleClass("passedValidation", passedValidation);
  };

  SubtestPage.loadFromCouchDB = function(urlPath, callback) {
    return this.loadFromHTTP({
      url: $.couchDBDatabasePath + urlPath
    }, callback);
  };

  SubtestPage.loadFromHTTP = function(options, callback) {
    var urlPath;
    console.log("attempting the following");
    console.log(options);
    console.log(callback.toString());
    if (options.url == null) {
      throw "Must pass 'url' option to loadFromHTTP, received: " + options;
    }
    if (options.url.match(/http/)) {
      urlPath = options.url.substring(options.url.lastIndexOf("://") + 3);
    } else {
      urlPath = options.url;
    }
    $.extend(options, {
      type: 'GET',
      dataType: 'json',
      success: function(result) {
        var subtestPage;
        try {
          subtestPage = SubtestPage.deserialize(result);
          subtestPage.urlPath = urlPath;
          subtestPage.urlScheme = "http";
          subtestPage.revision = result._rev;
          return typeof callback === "function" ? callback(subtestPage) : void 0;
        } catch (error) {
          console.log("this error: " + error);
          console.log("Error in SubtestPage.loadFromHTTP: while loading the following object:");
          return console.log(result);
        }
      },
      error: function() {
        throw "Failed to load: " + urlPath;
      }
    });
    return $.ajax(options);
  };

  return SubtestPage;

})(Backbone.Model);

SubtestPage.deserialize = function(pageObject) {
  var result;
  switch (pageObject.pageType) {
    case "UntimedSubtest":
      return UntimedSubtest.deserialize(pageObject);
    case "UntimedSubtestLinked":
      return UntimedSubtestLinked.deserialize(pageObject);
    case "PhonemePage":
      return PhonemePage.deserialize(pageObject);
    default:
      result = new window[pageObject.pageType](pageObject);
      result.load(pageObject);
      return result;
  }
};

SubtestPage.loadFromLocalStorage = function(urlPath) {
  var subtestPage;
  subtestPage = SubtestPage.deserialize(JSON.parse(localStorage[urlPath]));
  subtestPage.urlScheme = "localstorage";
  return subtestPage;
};

$('div.ui-footer button').live('click', function(event, ui) {
  var button, validationResult;
  validationResult = $.assessment.currentPage.validate();
  if (validationResult === true) {
    button = $(event.currentTarget);
    return $.mobile.changePage(button.attr("href"));
  } else {
    $("#_infoPage div[data-role='content']").html("Please fix the following before proceeding:<br/>" + validationResult);
    return $.mobile.changePage("#_infoPage");
  }
});
