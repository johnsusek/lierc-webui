var Connection = function(id, config, baseurl) {
  this.baseurl = baseurl;
  this.id = id;
  this.config = config;
  this.nick = config.Nick;
  this.retries = 0;
  this.eventsource = null;

  var listeners = {};

  this.on = function(name, func) {
    if (!listeners[name])
      listeners[name] = [];
    listeners[name].push(func.bind(this));
  };

  function fire (name, data) {
    if (listeners[name]) {
      listeners[name].forEach(function(listener) {
        listener(data);
      });
    }
  }

  this.url = function() {
    return this.baseurl + "/" + this.id + "/events/" + this.nick;
  };

  function connect() {
    var es = new EventSource(this.url());

    es.addEventListener("message", this.onmessage.bind(this));
    es.addEventListener("open",    this.onopen.bind(this));
    es.addEventListener("close",   this.onclose.bind(this));
    es.addEventListener("error",   this.onclose.bind(this));

    this.eventsource = es;
  };

  this.connect = function() {
    var backoff = Math.min(this.retries++, 30);
    console.log("connecting in " + backoff + " seconds");
    setTimeout(connect.bind(this), backoff * 1000);
  };

  this.onopen = function() {
    fire("open");
    this.retries = 0;
  };

  this.onclose = function() {
    fire("close");
    console.log("closed");
  };

  this.onmessage = function(e) {
    var message = JSON.parse(e.data);
    fire(message.Command.toLowerCase(), message);
    fire("message", message);
  };

  this.check = function() {
    if (! this.eventsource || this.eventsource.readyState == 2 ) {
      this.connect();
    }
  };

  setInterval(this.check.bind(this), 1000);
};
