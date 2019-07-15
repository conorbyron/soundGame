var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.addEventListener('touchstart', handleStart, false);
document.body.addEventListener('touchend', handleEnd, false);
document.body.addEventListener('touchmove', handleMove, false);

var osc = new Tone.Oscillator({
  frequency: 440,
  type: 'square',
}).toMaster();
//Tone.Transport.start();

function handleStart(e) {
  e.preventDefault();
  var touches = e.changedTouches;
  osc.frequency.value = 440 - 220 * touches[0].pageY / window.innerHeight;
  osc.start();
  Tone.Master.volume.rampTo(0, 0.05);
  setColour(touches[0].pageY);
}

function handleEnd(e) {
  e.preventDefault();
  if (e.changedTouches.length == 1) Tone.Master.volume.rampTo(-Infinity, 0.05);
}

function handleMove(e) {
  e.preventDefault();
  var touches = e.changedTouches;
  osc.frequency.value = 440 - 220 * touches[0].pageY / window.innerHeight;
  setColour(touches[0].pageY);
}

function setColour(xVal) {
  if (xVal <= canvas.height / 2) {
    var dist = 2 * xVal / canvas.height;
    var r = Math.floor(241 + dist * 14);
    var g = Math.floor(84 + dist * 171);
    var b = Math.floor(35 + dist * 220);
    ctx.fillStyle = 'rgb(' + r + ', ' + g + ',' + b + ')';
  } else {
    var dist = (2 * xVal - canvas.height) / canvas.height;
    var r = Math.floor(255 - dist * 244);
    var g = Math.floor(255 - dist * 98);
    var b = Math.floor(255 - dist * 41);
    ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

