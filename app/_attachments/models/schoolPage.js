var SchoolPage,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

SchoolPage = (function(_super) {

  __extends(SchoolPage, _super);

  function SchoolPage(options) {
    var dataAttribute, inputElements, listAttributes, listElement, properties, property, template, _i, _j, _k, _len, _len2, _len3,
      _this = this;
    SchoolPage.__super__.constructor.call(this, options);
    this.schools = options.schools;
    this.selectNameText = options.selectNameText;
    properties = ["name", "district", "province", "schoolId"];
    for (_i = 0, _len = properties.length; _i < _len; _i++) {
      property = properties[_i];
      this[property + "Text"] = options[property + "Text"];
    }
    listAttributes = "";
    for (_j = 0, _len2 = properties.length; _j < _len2; _j++) {
      dataAttribute = properties[_j];
      listAttributes += "data-" + dataAttribute + "='{{" + dataAttribute + "}}' ";
    }
    listElement = "<li style='display:none' " + listAttributes + ">{{district}} - {{province}} - {{name}}</li>";
    inputElements = "";
    for (_k = 0, _len3 = properties.length; _k < _len3; _k++) {
      dataAttribute = properties[_k];
      inputElements += "      <div data-role='fieldcontain'>        <label for='" + dataAttribute + "'>{{" + dataAttribute + "Text}}</label>        <input type='text' name='" + dataAttribute + "' id='" + dataAttribute + "'></input>      </div>      ";
    }
    template = "      <div>        <h4>          {{selectSchoolText}}        </h4>      </div>      <form id='{{pageId}}-form'>        " + inputElements + "      </form>      <ul>        {{#schools}}          " + listElement + "        {{/schools}}      </ul>      <br/>      <br/>    ";
    this.schoolTemplate = Handlebars.compile(template);
    this.content = this.schoolTemplate(this);
    $("div#" + this.pageId + " form#" + this.pageId + "-form input").live("propertychange keyup input paste", function(event) {
      var currentName, school, _l, _len4, _ref, _results;
      currentName = $(event.target).val();
      _ref = $("div#" + _this.pageId + " li");
      _results = [];
      for (_l = 0, _len4 = _ref.length; _l < _len4; _l++) {
        school = _ref[_l];
        school = $(school);
        school.hide();
        if (school.html().match(new RegExp(currentName, "i"))) {
          _results.push(school.show());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    console.log("div#" + this.pageId + " li");
    $("div#" + this.pageId + " li").live("click", function(eventData) {
      var dataAttribute, school, selectedElement, _l, _len4, _len5, _m, _ref, _ref2, _results;
      _ref = $("div#" + _this.pageId + " li");
      for (_l = 0, _len4 = _ref.length; _l < _len4; _l++) {
        school = _ref[_l];
        $(school).hide();
      }
      selectedElement = $(eventData.currentTarget);
      _ref2 = ["name", "province", "district", "schoolId"];
      _results = [];
      for (_m = 0, _len5 = _ref2.length; _m < _len5; _m++) {
        dataAttribute = _ref2[_m];
        _results.push($("div#" + _this.pageId + " form input#" + dataAttribute).val(selectedElement.attr("data-" + dataAttribute)));
      }
      return _results;
    });
  }

  SchoolPage.prototype.propertiesForSerialization = function() {
    var properties, property, _i, _len, _ref;
    properties = SchoolPage.__super__.propertiesForSerialization.call(this);
    properties.push("schools");
    properties.push("selectNameText");
    _ref = ["name", "province", "district", "schoolId"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      property = _ref[_i];
      properties.push(property + "Text");
    }
    return properties;
  };

  SchoolPage.prototype.validate = function() {
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

  return SchoolPage;

})(SubtestPage);

SchoolPage.deserialize = function(pageObject) {
  var schoolPage;
  schoolPage = new SchoolPage(pageObject);
  schoolPage.load(pageObject);
  schoolPage.content = schoolPage.template(schoolPage._schoolTemplate(), schoolPage);
  return schoolPage;
};
