let METEOR_PARAMS = [
  {
    angle: 240,
    x: 0.65,
    y: 0.55,
  },
  {
    angle: 220,
    x: 0.6,
    y: 0.65,
  },
  {
    angle: 200,
    x: 0.55,
    y: 0.75,
  },
  {
    angle: 180,
    x: 0.5,
    y: 0.85,
  },
  {
    angle: 160,
    x: 0.45,
    y: 0.75,
  },
  {
    angle: 140,
    x: 0.4,
    y: 0.75,
  },
  {
    angle: 120,
    x: 0.35,
    y: 0.65,
  },
  {
    angle: 100,
    x: 0.3,
    y: 0.55
  }
]
let METEOR_SETTING_INDEX = 0
let METEOR_WIDTH_FACTOR = 0

async function generateMeteorParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]

  let intensity = 0
  if (span.intensity >= 0.00001) {
    intensity = 0.001
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

async function updateMeteorParticles() {
  particles = particleBuffers.meteor
  let PARTICLE_ANGLE = METEOR_PARAMS[METEOR_SETTING_INDEX].angle / 360 * 2 * Math.PI
  if (particles.length < 2000) {
    for (let i = 0; i < 5; i++) {
      let xPosition = Math.floor(METEOR_PARAMS[METEOR_SETTING_INDEX].x * window.innerWidth)
      let yPosition = Math.floor(METEOR_PARAMS[METEOR_SETTING_INDEX].y * window.innerHeight)
      let speed = 10
      let type = "normal"
      let angle = Math.floor(Math.random() * 360)
      let life = MAX_LIFE
      // Create star
      if (Math.random() < 0.2) {
        xPosition = Math.floor(window.innerWidth * Math.random())
        yPosition = Math.floor(window.innerHeight * Math.random())
        speed = 20 + Math.random() * 30
        type = "stars"
        angle = 90
        life = MAX_LIFE * Math.random()
      }
      particles.push({
        x: xPosition,
        y: yPosition,
        angleDegrees: angle,
        angleUp: true,
        life: life,
        speed: speed,
        type: type,
      })
    }
  }
  particles = particles.filter( function(particle) {
    let spanX = Math.round(particle.x / CHARACTER_WIDTH)
    let spanY = Math.round(particle.y / CHARACTER_HEIGHT)
    let spanId = getSpanId(spanX, spanY)
    let span = charSpans[activeCharSpanId][spanId.toString()]
    if (span) {
      span.intensityOverride = particle.life/MAX_LIFE
      if (span.intensityOverride > 1) {
        span.intensityOverride = 1
      }
    }

    // update values
    let xdiff = particle.speed * Math.cos(particle.angleDegrees / 360 * 2 * Math.PI) / (4 + METEOR_WIDTH_FACTOR)
    let ydiff = 0 - Math.abs(particle.speed * Math.sin(particle.angleDegrees / 360 * 2 * Math.PI))

    particle.x = particle.x + xdiff * Math.cos(PARTICLE_ANGLE) - ydiff * Math.sin(PARTICLE_ANGLE)
    particle.y = particle.y + xdiff * Math.sin(PARTICLE_ANGLE) - ydiff * Math.cos(PARTICLE_ANGLE)
    if (particle.type !== "stars") {
      if (particle.angleUp) {
        particle.angleDegrees = (particle.angleDegrees + 5) % 360
      } else {
        particle.angleDegrees = particle.angleDegrees - 5
        if (particle.angleDegrees < 0) {
          particle.angleDegrees = 359
        }
      }
    }
    particle.life = particle.life - 1
    if (Math.random() > 0.9) {
      particle.angleUp = !particle.angleUp
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
  particleBuffers.meteor = particles
}

function meteorResetFunc() {
  METEOR_SETTING_INDEX = Math.floor(METEOR_PARAMS.length * Math.random())
  if (METEOR_SETTING_INDEX > METEOR_PARAMS.length - 1) {
    METEOR_SETTING_INDEX = METEOR_PARAMS.length - 1
  }
  METEOR_WIDTH_FACTOR = 4 * Math.random()
}
