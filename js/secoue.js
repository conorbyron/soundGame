var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var width = canvas.width;
var height = canvas.height;
console.log(height + ' ' + width);
var ctx = canvas.getContext('2d');
var d = new Date();

document.body.addEventListener('touchstart', handleStart, false);

var chorus = new Tone.Chorus(16, 0.5, 0.3).toMaster();

var metalSynth = new Tone.MetalSynth({
  frequency: 100,
  envelope: {
    attack: 0.1,
    decay: 1.4,
    sustain: 0.7,
    release: 1.0,
  },
  harmonicity: 9.1,
  modulationIndex: 16,
  resonance: 1000,
  octaves: 1.5,
}).connect(chorus);
var myShakeEvent = new Shake({
  threshold: 10,
  timeout: 150,
});

myShakeEvent.start();

window.addEventListener('shake', handleStart, false);

function handleStart() {
  metalSynth.triggerAttack();
  lightUp();
}

function lightUp() {
  var elapsed = 0;
  var repeat = setInterval(function() {
    var yellow = Math.floor(255 * elapsed / 1000);
    ctx.fillStyle = 'rgb(255, 255,' + yellow + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    elapsed += 50;
  }, 50);
  setTimeout(function() {
    clearInterval(repeat);
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, 1000);
}
