let LAST_SATURN_SETUP = Date.now()
let SATURN_PASS = false
let SATURN_PARAMS = [
  {
    angle: -30,
    x: 0.21,
    y: 0.73,
  },
  {
    angle: -20,
    x: 0.19,
    y: 0.65,
  },
  {
    angle: -10,
    x: 0.17,
    y: 0.55,
  },
  {
    angle: 30,
    x: 0.23,
    y: 0.17,
  },
  {
    angle: 0,
    x: 0.17,
    y: 0.45,
  },
  {
    angle: 20,
    x: 0.17,
    y: 0.25,
  },
  {
    angle: 10,
    x: 0.17,
    y: 0.32,
  },
]
let SATURN_PARAMS_INDEX = 0
let SATURN_SIZE_FACTOR = 0

async function generateSaturnParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  // generate random stars and have them twinkle out
  if (span.intensity < 0.001 && Math.random() > 0.9995) {
    intensity = 1
  } else if (span.intensity >= 0.075) {
    intensity = span.intensity - 2/CHARACTER_INTENSITY_ARRAYS[0].length
    if (intensity < 0.075) {
      span.particle = false
    }
  }

  spanX = span.x * CHARACTER_WIDTH
  spanY = span.y * CHARACTER_HEIGHT

  spanXDiff = spanX - (window.innerWidth/2)
  spanYDiff = spanY - (window.innerHeight/2)
  distance = Math.sqrt(Math.pow(spanXDiff, 2) + Math.pow(spanYDiff, 2))
  if (distance < 300 + SATURN_SIZE_FACTOR && !span.particle) {
    if ((300 + SATURN_SIZE_FACTOR - distance) < 100) {
      intensity = 1 -  (300 + SATURN_SIZE_FACTOR - distance) / 100
    } else {
      intensity = 0.001
    }
  }

  if (span.intensityOverride) {
    if (span.saturnDirection != SATURN_PASS) {
      span.particle = true
    }
    if (!((!span.saturnDirection) != SATURN_PASS && distance < 300 + SATURN_SIZE_FACTOR)) {
      intensity = span.intensityOverride
    }
    span.intensityOverride = 0
  }

  splitInt = intensitySplit(intensity)
  let charColor = intensityToColor(splitInt.charIntensity)
  let bgColor = intensityToColor(splitInt.bgIntensity)
  return {
    intensity,
    charIntensity: splitInt.charIntensity,
    bgIntensity: splitInt.bgIntensity,
    color: charColor,
    backgroundColor: bgColor,
  }
};

async function updateSaturnParticles() {
  particles = particleBuffers.saturn
  let CRITTER_ANGLE = SATURN_PARAMS[SATURN_PARAMS_INDEX].angle / 360 * 2 * Math.PI
  if (particles.length < 200) {
    if (Math.random() < 0.1) {
      for (let i = 0; i < 1; i++) {
        let xPosition = Math.floor(SATURN_PARAMS[SATURN_PARAMS_INDEX].x * window.innerWidth) + Math.random() * 100
        let yPosition = Math.floor(SATURN_PARAMS[SATURN_PARAMS_INDEX].y * window.innerHeight) + Math.random() * 100
        let speed = 15
        let angle = -90
        let life = MAX_LIFE
        particles.push({
          x: xPosition,
          y: yPosition,
          angleDegrees: angle,
          angleUp: true,
          life: life,
          speed: speed,
        })
      }
    }
  }
  particles = await async.filter(particles, async function(particle) {
    let spanX = Math.round(particle.x / CHARACTER_WIDTH)
    let spanY = Math.round(particle.y / CHARACTER_HEIGHT)
    let spanId = getSpanId(spanX, spanY)
    let span = charSpans[spanId.toString()]
    if (span) {
      span.intensityOverride = particle.life/MAX_LIFE
      if (span.intensityOverride > 1) {
        span.intensityOverride = 1
      }
      span.saturnDirection = particle.saturnDirection
    }

    // update values
    let xdiff = particle.speed * Math.cos(particle.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = particle.speed * Math.sin(particle.angleDegrees / 360 * 2 * Math.PI) / 3

    let realXDiff = xdiff * Math.cos(CRITTER_ANGLE) - ydiff * Math.sin(CRITTER_ANGLE)
    let realYDiff = xdiff * Math.sin(CRITTER_ANGLE) - ydiff * Math.cos(CRITTER_ANGLE)

    particle.x = particle.x + realXDiff
    particle.y = particle.y + realYDiff
    particle.saturnDirection = realXDiff > 0
    if (particle.angleUp) {
      particle.angleDegrees = (particle.angleDegrees + 1.5) % 360
    }

    if (particle.x < 0 ||
        particle.x > window.innerWidth ||
        particle.y < 0 ||
        particle.y > window.innerHeight ||
        particle.life < 1) {
      return false
    } else {
      return true
    }
  })
  particleBuffers.saturn = particles
}

function saturnResetFunc() {
  SATURN_PASS = Math.random() > 0.5
  SATURN_PARAMS_INDEX = Math.floor(SATURN_PARAMS.length * Math.random())
  if (SATURN_PARAMS_INDEX > SATURN_PARAMS.length - 1) {
    SATURN_PARAMS_INDEX = SATURN_PARAMS.length - 1
  }
  SATURN_SIZE_FACTOR = Math.random() * 200 - 100
  particleBuffers.saturn = []
  LAST_SATURN_SETUP = Date.now()
}
