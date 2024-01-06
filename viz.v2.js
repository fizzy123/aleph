let activeCharSpanId = 0;
let charSpans = [{}, {}];
let paramsBuffers = [{}, {}];
let particleBuffers = {
  network: [],
  shower: [],
  saturn: [],
  asteroidBelt: [],
  sun: [], // shared by sun and eclipse modes
  meteor: [],
};
let particleConfigs = [{
  limit: 1000,
  generationRate: 0.01,
  startingXRange: window.innerWidth,
  startingYRange: window.innerHeight,
  speed: 15,
  angle: 0,
  angleDiff: 90,
  speedDiff: 0.3
}];
let spanWidth
let spanHeight
let mouseX
let mouseY

let CHARACTER_HEIGHT = 15;
let CHARACTER_WIDTH = 15;
let MAX_X = 0;
let MAX_Y = 0;

const tilesetInfo = [
    {
        domID: "tiles",
        w: 512,
        h: 512,
        startX: 16,
        startY: 16,
        tileGapX: 8,
        tileGapY: 8,
        tileW: 16,
        tileH: 16,
    }
]
let tilesets = [];

let paletteTileset;

const CHARACTER_INTENSITY_ARRAYS = [
  `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^\`'. `.split("").reverse().join(""),
  ` .:-=+*#%@`
]

let reset = false
let currentPaletteIndex
let currentBufferIndex = 0
let CHARSET_ID = 0

let LOGO_SRCS=[
  "bitshifter/Bit_Shifter_-_skull_and_crossbolts_06_c_no_text_-_white_-_transparent_bg_-_3000x3000.png",
  "bitshifter/Bit_Shifter_-_skull_and_crossbolts_07_with_text_-_white_-_transparent_bg_-_3000x3000.png",
  "bitshifter/Bit_Shifter_-_skull_and_text_logo_08_-_alt_layout_-_white_grey_-_transparent_bg_-_4500x4500.png",
  "bitshifter/Bit_Shifter_-_skull_ring_logo_20191003_-_90%_-_white_-_transparent_bg_-_3000x3000.png",
]
let tmpCanvas=document.createElement("canvas");
var tmpCtx=tmpCanvas.getContext("2d", { willReadFrequently: true });
function createPaletteTileset(tileset, palette) {
    paletteTileset = []
    for (let color of palette) {
        let paletteTiles = []
        for (let tile of tileset) {
            let paletteTile = tmpCtx.createImageData(tileset.info.tileW, tileset.info.tileH);
            paletteTile.data.set(tile.data);
            for (let i = 0; i < paletteTile.data.length; i += 4) {
                if (paletteTile.data[i + 0] !== 0 ||
                    paletteTile.data[i + 1] !== 0 ||
                    paletteTile.data[i + 2] !== 0
                ) {
                    let rgbColor = hexToRgb(color)
                    paletteTile.data[i + 0] = rgbColor.r // R value
                    paletteTile.data[i + 1] = rgbColor.g // G value
                    paletteTile.data[i + 2] = rgbColor.b // B value
                    paletteTile.data[i + 3] = 255; // A value
                }
            }
            paletteTiles.push(paletteTile)
        }
        paletteTileset.push(paletteTiles)
    }
}

function getSpanId(spanX, spanY) {
  return spanY * Math.floor(window.innerWidth/CHARACTER_WIDTH) + spanX
}

function init() {
  for (let info of tilesetInfo) {
    let tilesetImage = document.getElementById(info.domID);
    tmpCtx.drawImage(tilesetImage, 0, 0, info.w, info.h);
  
    let tileset = []
    for (let i=info.startX; i<info.w; i+=info.tileW + info.tileGapX) {
        for (let j=info.startY; i<info.h; i+=info.tileH + info.tileGapY) {
            let tile = tmpCtx.getImageData(i, j, info.tileW, info.tileH);
            tileset.push(tile)
        }
    }
    tileset.info = info;
    tilesets.push(tileset);
  }

  if (MODES[CURRENT_MODE].resetFunc) {
    MODES[CURRENT_MODE].resetFunc()
  }
  let canvas = document.getElementById('canvas');
  canvas.setAttribute('width', window.innerWidth);
  canvas.setAttribute('height', window.innerHeight);
  currentPaletteIndex = Math.floor(Math.random() * COLOR_PALETTES.length)
  createPaletteTileset(tilesets[CHARSET_ID], COLOR_PALETTES[currentPaletteIndex])

  document.body.style.backgroundColor = "black";
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  MAX_X = Math.floor(windowWidth/CHARACTER_WIDTH)
  MAX_Y = Math.floor(windowHeight/CHARACTER_HEIGHT)
  for (let [charSpanId, charSpan] of charSpans.entries()) {
    for(let y=0; y<windowHeight/CHARACTER_HEIGHT; y++) {
      for(let x=0; x<windowWidth/CHARACTER_WIDTH; x++) {
        let id = y * Math.floor(windowWidth/CHARACTER_WIDTH) + x
        const charSpan = {}
        charSpan.id = id
        charSpan.x = x
        charSpan.y = y
//        charSpan.intensity = Math.random();
        charSpan.intensity = 0;
        charSpan.top = y * CHARACTER_HEIGHT;
        charSpan.left = x * CHARACTER_WIDTH;
        charSpan.color = "white";
        charSpan.width = 15;
        charSpan.height = 15;
        charSpans[charSpanId][id.toString()] = charSpan

        spanWidth = x
      }
      spanHeight = y
    }
  }
}

let intensityOn = false
async function draw() {
  let canvasCtx = document.getElementById('canvas').getContext("2d");
  // update particles
  await MODES[CURRENT_MODE].updateParticles()

  tmpParamsBuffer = {}
  // render spans
  for (let spanId in charSpans[activeCharSpanId]) {
      start = Date.now()
      let span = charSpans[activeCharSpanId][spanId]
      let newParams = await MODES[CURRENT_MODE].generateParams(span);

      tmpParamsBuffer[spanId] = newParams;
      if (reset) {
        newParams = {}
        newParams.color = "#000"
        newParams.intensity = 0
      }

      // pass on intensity
      if (newParams.intensity !== undefined) {
        span.intensity = newParams.intensity
      }

      // configure bg params
      if (newParams.bgIntensity !== undefined) {
        span.backgroundColor = newParams.backgroundColor
        span.bgIntensity = newParams.bgIntensity

//        canvasCtx.fillStyle = newParams.backgroundColor
//        canvasCtx.fillRect(span.x * CHARACTER_WIDTH, span.y * CHARACTER_HEIGHT, span.width, span.height)
      }

      // configure text params
      if (newParams.color) {
        span.color = newParams.color
      }
      if (newParams.weight) {
        span.fontWeight = newParams.weight;
      }
      if (newParams.charIntensity !== undefined) {
        let spanCharIndex = Math.floor(newParams.charIntensity * paletteTileset.length)
        if (spanCharIndex >= paletteTileset.length) {
          spanCharIndex = paletteTileset.length - 1
        }
        if (spanCharIndex < 0) {
          spanCharIndex = 0
        }
        span.charIntensity = newParams.charIntensity

        outputX = span.x * CHARACTER_WIDTH + 3
        outputY = (span.y + 1) * CHARACTER_HEIGHT - 1
        canvasCtx.putImageData(paletteTileset[spanCharIndex][0], outputX, outputY)
      }
  }
  if (intensityOn) {
    let canvas = document.getElementById('canvas');
    let canvasCtx = canvas.getContext("2d");
    let imageData = canvasCtx.getImageData( 0, 0, canvas.width, canvas.height );
    let glitchImageData = await glitch( { seed: 500 * Math.random() })
    .fromImageData( imageData )
    .toDataURL()

    document.getElementById("test").style.removeProperty("display")
    document.getElementById("test").src = glitchImageData;
    document.getElementById("test").style.setProperty("width", canvas.width)
    document.getElementById("test").style.setProperty("height", canvas.height)
//    canvasCtx.putImageData( glitchImageData, 0, 0 );
  } else {
    document.getElementById("test").style.setProperty("display", "none")
  }
//  document.getElementById("fps").innerText = MainLoop.getFPS()
  paramsBuffers[activeCharSpanId] = tmpParamsBuffer
  reset = false
}

MAX_LIFE = 150

STARTING_POINTS = []

let CURRENT_MODE = 'network';
let MODES = {}
window.onload = function() {
  MainLoop.setMaxAllowedFPS(60)
  MODES = {
    network: {
      generateParams: generateNetworkParams,
      updateParticles: updateNetworkParticles,
    },
    shower: {
      generateParams: generateShowerParams,
      updateParticles: updateShowerParticles,
    },
    waves: {
      generateParams: generateWavesParams,
      updateParticles: async () => {},
    },
    noise: {
      generateParams: generateNoiseParams,
      updateParticles: async () => {},
    },
    fungus: {
      generateParams: generateFungusParams,
      updateParticles: async () => {},
    },
    saturn: {
      generateParams: generateSaturnParams,
      updateParticles: updateSaturnParticles,
      resetFunc: saturnResetFunc,
    },
    asteroidBelt: {
      generateParams: generateAsteroidBeltParams,
      updateParticles: updateAsteroidBeltParticles,
      resetFunc: asteroidBeltResetFunc,
    },
    eclipse: {
      generateParams: generateEclipseParams,
      updateParticles: updateEclipseParticles,
      resetFunc: sunResetFunc,
    },
    sun: {
      generateParams: generateSunParams,
      updateParticles: updateEclipseParticles,
      resetFunc: sunResetFunc,
    },
    meteor: {
      generateParams: generateMeteorParams,
      updateParticles: updateMeteorParticles,
      resetFunc: meteorResetFunc,
    },
  }
  init()

  window.onresize = function() {
    document.body.innerHTML = "";
    charSpans = [{}, {}]
    init()
  }
  document.addEventListener('keydown', (event) => {
      if (event.key === " ") {
          intensityOn = true
      }
  })
  document.addEventListener('keyup', (event) => {
    var name = event.key;
    var code = event.code;
    if (event.key === "q") {
      currentPaletteIndex = Math.floor(Math.random() * COLOR_PALETTES.length)
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      availableModes = Object.keys(MODES)
      availableModes.splice(availableModes.indexOf(CURRENT_MODE), 1)
      CURRENT_MODE = randomChoice(availableModes)
      if (["sun", "eclipse"].includes(CURRENT_MODE)) {
        reset = true
      }
      if (document.getElementById("logo").src === "file:///Users/seonyoo/ascii-viz/bitshifter/transparent.png") {
        logo_image = randomChoice(LOGO_SRCS)
        document.getElementById("logo").src=logo_image;
        if (CURRENT_MODE === "meteor" || CURRENT_MODE === "saturn") {
          document.getElementById("logo").src="bitshifter/transparent.png" 
        }
      } else {
        document.getElementById("logo").src="bitshifter/transparent.png" 
      }
    } else if (event.key === " ") {
        intensityOn = false
        if (activeCharSpanId == 0) {
            activeCharSpanId = 1
        } else {
            activeCharSpanId = 0
        }
        currentPaletteIndex = Math.floor(Math.random() * COLOR_PALETTES.length)
        if (MODES[CURRENT_MODE].resetFunc) {
          MODES[CURRENT_MODE].resetFunc()
        }
    }
  })

//  let canvasCtx = document.getElementById('canvas').getContext("2d");
//  canvasCtx.putImageData(paletteTileset[4][10], 10, 10)
  MainLoop.setDraw(draw).start();
}

LOGO_ON = false
