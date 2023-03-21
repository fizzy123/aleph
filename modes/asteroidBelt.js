let ASTEROID_PARAMS = [
  {
    angle: -130,
    x: 0.6,
    angleDiff: -1/15,
  },
  {
    angle: -110,
    x: 0.5,
    angleDiff: -1/15,
  },
  {
    angle: -90,
    x: 0.4,
    angleDiff: -1/15,
  },
  {
    angle: -90,
    x: 0.3,
    angleDiff: 1/15,
  },
  {
    angle: -50,
    x: 0.1,
    angleDiff: 1/15,
  },
  {
    angle: -70,
    x: 0.2,
    angleDiff: 1/15,
  },
]
let ASTEROID_PARAMS_INDEX = 0
let LAST_ASTEROID_SETUP = Date.now()

async function generateAsteroidBeltParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  if (span.intensity < 0.001 && Math.random() > 0.9999) {
    intensity = 1
  } else if (span.intensity >= 0.00001) {
    intensity = span.intensity - 1/CHARACTER_INTENSITY_ARRAYS[0].length
  }

  spanX = span.x * CHARACTER_WIDTH
  spanY = span.y * CHARACTER_HEIGHT
  spanXDiff = spanX - (window.innerWidth/2)
  spanYDiff = spanY - (window.innerHeight/2)
  distance = Math.sqrt(Math.pow(spanXDiff, 2) + Math.pow(spanYDiff, 2))
  if (distance < 350) {
  //  intensity = 1
  }

  if (span.intensityOverride) {
    intensity = span.intensityOverride
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

async function updateAsteroidBeltParticles() {
  particles = particleBuffers.asteroidBelt
  if (particles.length < 100) {
    if (Math.random() < 0.5) {
      for (let i = 0; i < 1; i++) {
        let xPosition = Math.floor(ASTEROID_PARAMS[ASTEROID_PARAMS_INDEX].x * window.innerWidth) + Math.random() * 800
        let yPosition = window.innerHeight
        let speed = 15
        let angle = ASTEROID_PARAMS[ASTEROID_PARAMS_INDEX].angle
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
    }

    // update values
    let xdiff = particle.speed * Math.cos(particle.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = particle.speed * Math.sin(particle.angleDegrees / 360 * 2 * Math.PI)

    particle.x = particle.x + xdiff
    particle.y = particle.y + ydiff
    if (particle.angleUp) {
      particle.angleDegrees = (particle.angleDegrees + ASTEROID_PARAMS[ASTEROID_PARAMS_INDEX].angleDiff * 3) % 360
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
  particleBuffers.asteroidBelt = particles
}

function asteroidBeltResetFunc() {
  ASTEROID_PARAMS_INDEX = Math.floor(ASTEROID_PARAMS.length * Math.random())
  if (ASTEROID_PARAMS_INDEX > ASTEROID_PARAMS.length - 1) {
    ASTEROID_PARAMS_INDEX = ASTEROID_PARAMS.length - 1
  }
  particleBuffers.asteroid = []
  LAST_ASTEROID_SETUP = Date.now()
  particleBuffers.asteroidBelt = []
}
