var Completion = function(element) {
  var TAB = 9;

  this.completions = ["lee", "alice", "winston", "john"];
  this.completing = false;
  this.matches = []
  this.position = 0;
  this.index = 0;
  this.el = element;

  this.complete = function(e) {
    if (e.which == TAB) {
      e.preventDefault();

      if (! this.completing)
        this.start();

      this.cycle();
    }
    else {
      this.stop();
    }
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
    this.matches = this.find_matches(this.word()).concat([""]);
    this.index = 0;
  };

  this.cycle = function() {
    if (this.index >= this.matches.length)
      this.index = 0;

    var start = this.el.value.substring(0, this.position)
    var end = this.matches[this.index++];

    // "" represents returning to no completion, so no space added
    if (end != "") {
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

  this.find_matches = function(word) {
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

  this.word = function() {
    return this.el.value.replace(/.*\s/, "");
  };

  this.el.addEventListener("keydown", this.complete.bind(this), true);
};

$(document).ready(function() {
  $('input[type=text]').each(function() {
    new Completion(this);
  });
});