// modified from maček's code on StackOverflow
// http://stackoverflow.com/questions/20318822/how-to-create-a-stopwatch-using-javascript

var Stopwatch = function(elem, options) {

  var timer       = createTimer(),
      /*startButton = createButton("start", start),
      stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset*/
      offset,
      clock,
      interval,
	  speed = 1;

  // default options
  options = options || {};
  options.delay = options.delay || 1;

  // append elements     
  elem.appendChild(timer);
//elem.appendChild(startButton);
//elem.appendChild(stopButton);
//elem.appendChild(resetButton);

  // initialize
  reset();

  // private functions
  function createTimer() {
    return document.createElement("span");
  }

  /*function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function(event) {
      handler();
      event.preventDefault();
    });
    return a;
  }*/

  function start() {
	alert("USING THIS");
    offset   = Date.now();
    interval = setInterval(update, options.delay);
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
    }
  }

  function reset() {
    clock = 0;
    render();
  }

  function update() {
    clock += delta()*speed;
    render();
  }

  function render() {
	var minutes = Math.floor(clock/60000);
	var seconds = Math.floor(clock/1000)%60;
	if (minutes < 10) minutes = "0" + minutes;
	if (seconds < 10) seconds = "0" + seconds;
	timer.innerHTML = minutes + ":" + seconds; 
	if(minutes == 60){
		stop();
		alert("It has seriously been an hour. This is what you're doing with your life.");
		timer.innerHTML = "FAIL";
	}
  }

  function delta() {
    var now = Date.now(),
        d   = now - offset;

    offset = now;
    return d;
  }

  function toggle(changespeed){
	speed = changespeed? changespeed : speed;
	if (interval && interval!=0) {
      clearInterval(interval);
	  interval = 0;
    }
	else{
		offset   = Date.now();
		interval = setInterval(update, options.delay);
	}
  }

  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
  this.toggle = toggle;
};