class Subtest extends Backbone.Model
  url: "/subtest"
  
  initialize: ->
    _.bindAll @, 'render'
  
  render: ->
    console.log "trying to render a " + @attributes.pageType+"View"
    @view = new window[@attributes.pageType+"View"] 
      model : @
    @view.render()

class SubtestCollection extends Backbone.Collection
  model: Subtest
  url: "/subtest"

