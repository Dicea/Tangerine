Tangerine =
  cloud:
    target   : "mikeymckay.iriscouch.com"
    username : "tangerine"
    password : "tangytangerine"
  subnet:
    base   : "http://192.168.1."
    start  : 100
    finish : 200
  port : "5985"

Tangerine.cloud.url = "http://#{Tangerine.cloud.username}:#{Tangerine.cloud.password}@#{Tangerine.cloud.target}"

Backbone.couch_connector.config.db_name        = "tangerine"
Backbone.couch_connector.config.ddoc_name      = "tangerine"
Backbone.couch_connector.config.global_changes = false

$.couch.db(Backbone.couch_connector.config.db_name).openDoc("Config", {success:(data) -> Tangerine.config = data})
