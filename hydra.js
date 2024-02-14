let kaleid = false
let repeat = false

// register WebMIDI
navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  console.log(midiAccess);
  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;
  for (var input of midiAccess.inputs.values()){
      input.onmidimessage = getMIDIMessage;
  }
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

//create an array to hold our cc values and init to a normalized value
var cc=Array(128).fill(0.5)
// we want a little bit of scrolling at the beginning
cc[0] = 0.52
cc[1] = 0.51

// scale modulation should start at nothing
cc[8] = 0 
// self modulation should start at nothing
cc[9] = 0 
// self rotate modulation should start at nothing
cc[5] = 0 
// feedback should start at nothing
cc[6] = 0 
// voronoi should start at nothing
cc[7] = 0 
cc[10] = 0.25
cc[11] = 0
cc[12] = 1
// hue should start at nothing
cc[2] = 0 
// intensity should start at 0
cc[4] = 0
// no repeat modulation at start
cc[14] = 0
cc[15] = 0

getMIDIMessage = function(midiMessage) {
  var arr = midiMessage.data
  var index = arr[1]
  //console.log('Midi received on cc#' + index + ' value:' + arr[2])    // uncomment to monitor incoming Midi
  var val = (arr[2])/128.0  // normalize CC values to 0.0 - 1.0
  cc[index]=val
}

function initHydra() {
  const hydraCanvas = document.getElementById("hydra");

  hydraCanvas.setAttribute('width', window.innerWidth);
  hydraCanvas.setAttribute('height', window.innerHeight);
  let hydra = new Hydra({
    detectAudio: false,
    canvas: hydraCanvas,
  })

  runHydra()
}

/*
 * 0 - scrollX
 * 1 - scrollY
 * 2 - color oscilation
 * 3 - kaleid (turn on with "k")
 *
 * 4 - intensity
 * 5 - modulateRotate
 * 6 - feedback
 * 7 - voronoi modulation
 *
 * 8 - curvy modulation
 * 9 - self modulation amount
 * 10 - self modulation size (works best under kaleidoscope)
 * 11 - self modulate angle (works best under kaleidoscope)
 *
 * press "r" to enable modulate repeat
 * 12 - scale
 * 13 -
 * 14 - modulate repeat x modulation amount
 * 15 - modulate repeat y modulation amount
 */
function runHydra() {
  // hydra code
  const ascii = document.getElementById("ascii");
  s0.init({src: ascii})
  s1.init({src: ascii})
  let chain = src(s0)
    .scale(() => (cc[12]))
    .scrollX(0, ()=>(cc[0] - 0.5))
    .scrollY(0, ()=>(cc[1] - 0.5))
    .modulateScale(noise()
                     .scale(2)
                     .scrollX(0, 0.1)
                     .scrollY(0, 0.2)
      , ()=>cc[8])
    .hue(() => (Math.sin(time)) * cc[2])
  	.brightness(() => cc[4] * 2 * (Math.random() * 0.3 - 0.2))
  	.scrollX(() => cc[4] * 4 * ((Math.random() * 0.004) - 0.002))
	  .scrollY(() => cc[4] * 4 * ((Math.random() * 0.004) - 0.002))
    .modulate(src(s1)
                .scale(() => (cc[10] * 4))
                .rotate(0, () => (cc[11] * 4))
      , ()=>cc[9])
    .modulateRotate(src(s1), ()=>(cc[5]))
    .modulate(src(o0).scrollX(0.01).scrollY(0.005), ()=>(cc[6]))
    .modulate(voronoi(), ()=>cc[7])
  if (repeat) {
    chain = chain.modulateRepeat(noise()
      .scale(2)
      .scrollX(0, 0.1)
      .scrollY(0, 0.2)
      , 1, 1, ()=>(cc[14] * 3), ()=>(cc[15] * 3))
  }
  if (kaleid) {
    chain = chain
//      .scale(0.9, window.innerWidth/window.innerHeight)
      .kaleid(()=>(cc[3] * 8)).rotate(Math.PI/2)
//      .kaleid(()=>(1)).rotate(Math.PI/2)
  }
    chain.out(o0)
    render(o0)
}
