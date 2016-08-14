var Completion = function(element) {
  var TAB = 9;
  var RESET = ""

  this.completions = ["lee", "alice", "winston", "john"];
  this.completing = false;
  this.matches = []
  this.position = 0;
  this.index = 0;
  this.el = element;

  this.complete = function(e) {
    if (! this.completing)
      this.start();
    this.cycle();
  };

  this.stop = function() {
    this.completing = false;
    this.matches = [];
    this.position = 0;
    this.index = 0;
  };

  this.start = function() {
    this.position = this.el.selectionStart;
    this.completing = true
    this.matches = this.find_matches().concat([RESET]);
    this.index = 0;
  };

  this.cycle = function() {
    if (this.index >= this.matches.length)
      this.index = 0;

    var start = this.el.value.substring(0, this.position)
    var end = this.matches[this.index++];

    if (end != RESET) {
      // add a ":" if this is the first word on the line
      if (start.indexOf(" ") == -1) {
        end += ":";
      }
      end += " ";
    }

    this.el.value = start + end;
    this.move_cursor();
  };

  this.move_cursor = function() {
    var length = this.el.value.length;
    this.el.setSelectionRange(length, length);
  }

  this.find_matches = function() {
    var word = this.last_word();
    var matches = [];
    var length = word.length;
    
    for (var i=0; i < this.completions.length; i++) {
      var w = this.completions[i];
      if (w.length < length)
        continue;
      if (w.substring(0, length) == word)
        matches.push(w.substr(length));
    }

    return matches;
  };

  this.last_word = function() {
    return this.el.value.replace(/.*\s/, "");
  };
};
