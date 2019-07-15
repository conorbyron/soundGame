//var app = new PIXI.Application();
//document.body.appendChild(app.view);
var canvas = document.getElementById('canvas');
var ball = document.querySelector('.ball');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var width = canvas.width;
var height = canvas.height;
console.log(height + ' ' + width);
var ctx = canvas.getContext('2d');
ctx.font = '40px Helvetica';
ctx.textAlign = 'center';
ctx.fillText('En Avant', width / 2, 30);
ctx.save();
ctx.translate(width - 30, height / 2);
ctx.rotate(Math.PI / 2);
ctx.fillText('À Droite', 0, 0);
ctx.restore();
ctx.save();
ctx.translate(width / 2, height - 30);
ctx.rotate(Math.PI);
ctx.fillText('En Arrière', 0, 0);
ctx.restore();
ctx.save();
ctx.translate(30, height / 2);
ctx.rotate(3 * Math.PI / 2);
ctx.fillText('À Gauche', 0, 0);
ctx.restore();

var x = 0;
var y = 0;
var lastX = 0;
var lastY = 0;

// The application will create a canvas element for you that you
// can then insert into the DOM

document.body.addEventListener('touchstart', handleStart, false);

/*
var myShakeEvent = new Shake({
  threshold: 10,
  timeout: 150,
});

myShakeEvent.start();

window.addEventListener('shake', handleStart, false);
*/

var feedbackDelay = new Tone.FeedbackDelay('8n', 0.5).toMaster();
feedbackDelay.wet.value = 0.0;

var synth = new Tone.Synth({
  oscillator: {
    type: 'triangle',
  },
  envelope: {
    attack: 0.01,
    decay: 0.0,
    sustain: 0.8,
    release: 0.5,
  },
}).connect(feedbackDelay);
Tone.Transport.start();
var pattern = new Tone.Pattern(
  function(time, note) {
    synth.triggerAttackRelease(note, '16n', time);
  },
  ['C4', 'E4', 'G4'],
  'up',
).start();

pattern.interval = '8n';

function handleStart() {
  synth.triggerAttackRelease('C4', '0.5');
}

function handleOrientation(event) {
  x = event.beta; // In degree in the range [-180,180]
  y = event.gamma; // In degree in the range [-90,90]

  var xPos = x;

  if (xPos > 45) {
    xPos = 45;
  }
  if (xPos < -45) {
    xPos = -45;
  }

  ball.style.top = height * (xPos + 45) / 90 - 25 + 'px';
  ball.style.left = width * (y + 90) / 180 - 25 + 'px';
}

function patternTime(xVal, yVal) {
  if (xVal > 45) {
    xVal = 45;
  }
  if (xVal < -45) {
    xVal = -45;
  }

  if (!(xVal >= 0 && lastX >= 0) && !(xVal < 0 && lastX < 0))
    pattern.pattern = xVal > 0 ? 'down' : 'up';

  //  pattern.interval = 1.0; //Math.floor(Math.abs(xVal) / 5) ;
  pattern.interval = Math.floor(Math.abs(xVal) / 5) + 'n';

  /*
  if (yVal >= 0) {
    synth.envelope.attack = 0.01;
    synth.envelope.release = 4.0 * Math.abs(yVal) / 90;
  } else {
    synth.envelope.attack = 4.0 * Math.abs(yVal) / 90;
    synth.envelope.release = 0.01;
  }
  */
  var directionY = 0;
  if (yVal < -15) directionY = -1;
  else if (yVal > 15) directionY = 1;

  if (directionY != lastY) {
    switch (directionY) {
      case -1:
        synth.envelope.attack = 1.0;
        feedbackDelay.wet.value = 0.0;
        break;
      case 0:
        synth.envelope.attack = 0.01;
        feedbackDelay.wet.value = 0.0;
        break;
      case 1:
        synth.envelope.attack = 0.01;
        feedbackDelay.wet.value = 1.0;
        break;
      default:
        break;
    }
    lastY = directionY;
  }

  lastX = xVal;
}

(function loop() {
  patternTime(x, y);
  setTimeout(loop, 1000);
})();

window.addEventListener('deviceorientation', handleOrientation);
