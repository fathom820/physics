// Elements
var canvas1 = document.getElementById("canvas1");
var canvas2 = document.getElementById("canvas2");
var c1 = canvas1.getContext("2d");
var c2 = canvas2.getContext("2d");
canvas1.width = innerWidth;
canvas1.height = innerHeight;
canvas2.width = innerWidth;
canvas2.height = innerHeight;

var resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", init);

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", clear);

var helpMenu = document.getElementById("helpMenu");

var helpButton = document.getElementById("helpButton");
helpButton.addEventListener("click", showHelp);
function showHelp() {
  helpMenu.style.display = "block";
  helpButton.style.display = "none";
}

var closeHelpButton = document.getElementById("closeHelpButton");
closeHelpButton.addEventListener("click", closeHelpMenu);
function closeHelpMenu() {
  helpMenu.style.display = "none";
  helpButton.style.display = "block";
}
var gravitySlider = document.getElementById("gravitySlider");
var gravityLabel = document.getElementById("gravityLabel");
gravityLabel.innerHtml = "Gravity: " + String(gravitySlider.value)
gravitySlider.oninput = function() {
  gravity = Number(this.value);
  gravityLabel.innerHTML = "Gravity: " + String(this.value);
}

var frictionSlider = document.getElementById("frictionSlider");
var frictionLabel = document.getElementById("frictionLabel");
frictionLabel.innerHTML = "Friction: 10%";
frictionSlider.oninput = function() {
  // friction is equal to 1 minus the actual value of the slider
  // the friction label is set to be 1 - friction, essentially inverting the slider
  friction = 1 - Number(frictionSlider.value).toFixed(2)
  frictionLabel.innerHTML = "Friction: " + String(((1 - friction) / 1 * 100 ).toFixed(0)) + "%";
}

var countSlider = document.getElementById("countSlider");
var countLabel = document.getElementById("countLabel");
countLabel.innerHTML = "Count: 25";
countSlider.oninput = function() {
  count = Number(this.value)
  countLabel.innerHTML = "Count: " + String(this.value);
}

var traceCheckbox = document.getElementById("traceCheckbox");
function toggleTrace() {
  if (traceCheckbox.checked == true) {
    traceLines = true;
    
  } else {
    traceLines = false;
    c2.beginPath();
    c2.clearRect(0, 0, c2.width, c2.height);
  }
}
var gravity = Number(gravitySlider.value);
var friction = 1 - Number(frictionSlider.value);
var traceLines = false;
var ballArray = [];
var count = 25;


var colors = [
    // green shades
    "#066801",
    "#066801",
    "#27B320",
    "#5CB457",
    "#61925F",
    // blue shades
    "#2B3669",
    "#0B1957",
    "#2A3E97",
    "#535F97",
    "#555C7B",
    // yellow shades
    "#9A7332",
    "#805001",
    "#DD9828",
    "#DEB26B",
    "#B59C75",
    // red shades
    "#993134",
    "#7F0104",
    "#DB272C",
    "#DC6A6D",
    "#B37476"
    ];


// Helper Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function clear() {
  c1.clearRect(0, 0, canvas1.width, canvas1.height);
  c2.clearRect(0, 0, canvas2.width, canvas2.height);
  ballArray = [];
}

function init() {
  c1.clearRect(0, 0, canvas1.width, canvas1.height)
  c2.clearRect(0, 0, canvas2.width, canvas2.height);
  ballArray = [];
  for (var i = 0; i < count; i++) {
    var dx = randomIntFromRange(-10 , 10);
    var dy = randomIntFromRange(-5 , 5);
    var radius = 15;
    var x = randomIntFromRange(radius + 1, canvas1.width - radius - 1);
    var y = randomIntFromRange(0, canvas1.height - radius);
    var color = colors[randomIntFromRange(0, colors.length)];
    ballArray.push(new Ball(x, y, dx, dy, radius, color));
  }
}

function animate() {
  //requestAnimationFrame(animate);
  c1.clearRect(0, 0, canvas1.width, canvas1.height)
  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
  }
}


//Ball Object
function Ball(x, y, dx, dy, radius, color) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;

  this.update = function() {
    if (this.y + this.radius + this.dy + gravity> canvas1.height) {
			
			// TRIES TO INTERPOLATE SO THAT IT DOESN'T BOUNCE
			// PREMATURELY, this is done by making it stop at the edge
			//this.y = canvas1.height - this.radius;
			//this.x = this.x + this.dx;

      this.dy = -this.dy * friction;
      this.dx = this.dx * friction;
      //c1.fillStyle="#FFFFFF";

    } else {
      this.dy += gravity;
    }
    
    if (this.x + this.radius + this.dx >= canvas1.width || this.x - this.radius + this.dx <= 0) {
			
			// Same as the function for Y, but has to account for
			// both directions
			if (this.dx < 0) {
				//this.x = this.radius;
				//this.y = this.y + this.dy;
			}
			else if (this.dx > 0) {
				//this.x = canvas1.width-this.radius;
			}

      this.dx = -this.dx * friction;
			this.dy = this.dy * friction;
    }
    
    this.draw();
  }
  

  this.draw = function() {
    c1.beginPath();
    c1.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
    
		c1.fillStyle = this.color;
		c1.fill();
    c1.strokeStyle = "#000000";
		c1.stroke();
		c1.closePath();
    
    if(traceLines) {
      c2.beginPath();
      c2.moveTo(this.x, this.y);
      c2.lineTo(this.x + this.dx, this.y + this.dy);
      c2.strokeStyle = this.color;
      c2.stroke();
      c2.closePath();
    }
    this.x += this.dx;
    this.y += this.dy;
  }
}

init();
setInterval(animate, 10);