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
        w: 296,
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
  let canvasCtx = document.getElementById('ascii').getContext("2d", { willReadFrequently: true });
  for (let info of tilesetInfo) {
    let tilesetImage = document.getElementById(info.domID);
    tmpCanvas.setAttribute('width', info.w);
    tmpCanvas.setAttribute('height', info.h);
    tmpCtx.drawImage(tilesetImage, 0, 0, info.w, info.h);
  
    let tileset = []
    for (let i=info.startX; i<info.w; i+=info.tileW + info.tileGapX) {
        for (let j=info.startY; j<info.h; j+=info.tileH + info.tileGapY) {
            let tile = tmpCtx.getImageData(i, j, info.tileW, info.tileH);
            if (tileset.length == 6) {
              console.log(i,j)
            }
            const intensity = tile.data.reduce(
                (accumulator, currentValue) => {
                  if (currentValue != 0) {
                    return accumulator + 1
                  } else {
                    return accumulator
                  }
                }, 0
            ) / 4 / (info.tileW * info.tileH)
            tile.intensity = intensity
            tile.x = i
            tile.y = j
            tileset.push(tile)
        }
    }
    tileset.sort((a, b) => {
      if (a.intensity < b.intensity) {
        return -1;
      } else if (a.intensity > b.intensity) {
        return 1;
      } else {
        return 0
      }
    })
    tileset.info = info;
    tilesets.push(tileset);
  }

  if (MODES[CURRENT_MODE].resetFunc) {
    MODES[CURRENT_MODE].resetFunc()
  }
  let canvas = document.getElementById('ascii');
  canvas.setAttribute('width', window.innerWidth - (window.innerWidth % CHARACTER_WIDTH));
  canvas.setAttribute('height', window.innerHeight - (window.innerHeight % CHARACTER_HEIGHT));
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
  initHydra()
}

let intensityOn = false
async function draw() {
  let canvasCtx = document.getElementById('ascii').getContext("2d", { willReadFrequently: true });
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

        canvasCtx.fillStyle = newParams.backgroundColor
        canvasCtx.fillRect(span.x * CHARACTER_WIDTH, span.y * CHARACTER_HEIGHT, span.width, span.height)
      }

      // configure text params
      if (newParams.color) {
        span.color = newParams.color
      }
      if (newParams.weight) {
        span.fontWeight = newParams.weight;
      }
      if (newParams.charIntensity !== undefined) {
        let currentCharIntensityArray = CHARACTER_INTENSITY_ARRAYS[CHARSET_ID]
        let spanCharIndex = Math.floor(newParams.charIntensity * currentCharIntensityArray.length)
        if (spanCharIndex >= currentCharIntensityArray.length) {
          spanCharIndex = currentCharIntensityArray.length - 1
        }
        if (spanCharIndex < 0) {
          spanCharIndex = 0
        }
        span.charIntensity = newParams.charIntensity

        canvasCtx.fillStyle = newParams.color
        canvasCtx.font = "16px Roboto Mono";

        outputX = span.x * CHARACTER_WIDTH + 3
        outputY = (span.y + 1) * CHARACTER_HEIGHT - 1
        canvasCtx.fillText(currentCharIntensityArray[spanCharIndex], outputX, outputY)
      }
      if (newParams.tileColor !== undefined) {
        let paletteIndex = Math.floor(newParams.tileColor * paletteTileset.length)
        if (paletteIndex >= paletteTileset.length) {
          paletteIndex = paletteTileset.length - 1
        }
        if (paletteIndex < 0) {
          paletteIndex = 0
        }
      }
      if (newParams.tileChoice !== undefined) {
        let paletteIndex = Math.floor(newParams.tileChoice * paletteTileset.length)
        if (paletteIndex >= paletteTileset.length) {
          paletteIndex = paletteTileset.length - 1
        }
        if (paletteIndex < 0) {
          paletteIndex = 0
        }
        let tileIndex = Math.floor(newParams.charIntensity * paletteTileset[0].length)
        if (tileIndex >= paletteTileset[0].length) {
          tileIndex = paletteTileset[0].length - 1
        }
        if (tileIndex < 0) {
          tileIndex = 0
        }
        canvasCtx.putImageData(paletteTileset[paletteIndex][tileIndex], outputX, outputY)
      }
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
    if (event.key === " ") {
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
    } else if (event.key === "1") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "network"
    } else if (event.key === "2") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "shower"
    } else if (event.key === "3") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "waves"
    } else if (event.key === "4") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "noise"
    } else if (event.key === "5") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "fungus"
    } else if (event.key === "6") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "saturn"
    } else if (event.key === "7") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "asteroidBelt"
    } else if (event.key === "8") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "eclipse"
      reset = true
      cc[0] = 0.5
      cc[1] = 0.5
    } else if (event.key === "9") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "sun"
      reset = true
      cc[0] = 0.5
      cc[1] = 0.5
    } else if (event.key === "0") {
      if (MODES[CURRENT_MODE].resetFunc) {
        MODES[CURRENT_MODE].resetFunc()
      }
      CURRENT_MODE = "meteor"
    } else if (event.key === "k") {
      kaleid = !kaleid
      runHydra()
    } else if (event.key === "r") {
      repeat = !repeat
      runHydra()
    }
  })

//  let canvasCtx = document.getElementById('canvas').getContext("2d");
//  for (let tile of tilesets[0]) {
//    canvasCtx.putImageData(tile, tile.x, tile.y)
//  }
  MainLoop.setDraw(draw).start();
}

