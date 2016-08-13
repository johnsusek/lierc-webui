var Liercd = function(url) {
  var baseurl = url;
  var connections = [];
  var listeners = {};

  $.ajax({
    url: baseurl + "/",
    type: "GET",
    dataType: "json",
    success: function(res) {
      res.forEach(function(res) {
        var connection = new Connection(res.id, res.Config, baseurl);
        connections.push(connection);
        fire("connection", connection);
      });
    }
  });

  this.on = function(name, func) {
    if (!listeners[name])
      listeners[name] = [];
    listeners[name].push(func);
  };

  function fire (name, data) {
    if (listeners[name]) {
      listeners[name].forEach(function(func) {
        func(data);
      });
    }
  };

  this.connections = function() {
    return connections;
  };
};

var liercd = new Liercd("/api");

liercd.on("connection", function(connection) {
  connection.on("open", function() {
    console.log(this.config.Host);
  });
  connection.on("join", function(message) {
    console.log(message.Params[0]);
  });
});
