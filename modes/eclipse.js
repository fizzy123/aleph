async function generateEclipseParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  if (span.intensity) {
    intensity = span.intensity
  }

  if (span.intensityOverride) {
    intensity = span.intensityOverride
    span.intensityOverride = 0
  }

  spanX = span.x * CHARACTER_WIDTH
  spanY = span.y * CHARACTER_HEIGHT
  spanXDiff = spanX - (window.innerWidth/2)
  spanYDiff = spanY - (window.innerHeight/2)
  distance = Math.sqrt(Math.pow(spanXDiff, 2) + Math.pow(spanYDiff, 2))
  if (distance < 300 + SUN_SIZE_FACTOR) {
    intensity = 0
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

async function updateEclipseParticles() {
  particles = particleBuffers.sun
  if (particles.length < 2000) {
    for (let i = 0; i < 5; i++) {
      let xPosition = Math.floor(0.5 * window.innerWidth)
      let yPosition = Math.floor(0.5 * window.innerHeight)
      let speed = 15
      let angle = Math.floor(Math.random() * 360)
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
      particle.angleDegrees = (particle.angleDegrees + 5) % 360
    } else {
      particle.angleDegrees = particle.angleDegrees - 5
      if (particle.angleDegrees < 0) {
        particle.angleDegrees = 359
      }
    }
    particle.life = particle.life - 2
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
  particleBuffers.sun = particles
}
