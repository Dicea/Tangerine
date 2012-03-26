class TextPage extends SubtestPage
  propertiesForSerialization: ->
    properties = super()
    properties.push("content")
    return properties
