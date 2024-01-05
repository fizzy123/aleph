async function generateShowerParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  // show particles
  if (span.intensityOverride) {
    intensity = span.intensityOverride
    span.intensityOverride = 0
  }

  // fade if there's no other effect
  if (span.intensity >= 0.00001) {
    intensity = span.intensity - 2/CHARACTER_INTENSITY_ARRAYS[0].length
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
}

async function updateShowerParticles() {
  let particleConfig = {
    limit: 1000,
    generationRate: 1,
    startingXRange: window.innerWidth,
    startingYRange: window.innerHeight,
    speed: 10,
    angle: 30,
    angleDiff: 0.2,
    speedDiff: 0.3
  }
  particles = particleBuffers.shower

  // Add particles
  if (particles.length < particleConfig.limit) {
    if (Math.random() < particleConfig.generationRate) {
      if (Math.random() > 0.5) {
        x = 0
        y = Math.floor(particleConfig.startingYRange * Math.random())
      } else {
        x = Math.floor(particleConfig.startingXRange * Math.random())
        y = 0
      }
      let xPosition = x
      let yPosition = y
      let speed = particleConfig.speed
      let angle = particleConfig.angle
      let life = MAX_LIFE * Math.random() * 1.8
      particles.push({
        x: xPosition,
        y: yPosition,
        angleDegrees: angle,
        angleUp: Math.random() > 0.5,
        angleDiff: particleConfig.angleDiff,
        speedUp: Math.random() > 0.5,
        speedDiff: particleConfig.speedDiff,
        life: life,
        speed: speed,
      })
    }
  }

  // Update particles
  particles = await async.filter(particles, async function(particle) {
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

    particle.life = particle.life - 1

    let xdiff = particle.speed * Math.cos(particle.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = particle.speed * Math.sin(particle.angleDegrees / 360 * 2 * Math.PI)

    particle.x = particle.x + xdiff
    particle.y = particle.y + ydiff
    if (particle.angleUp) {
      particle.angleDegrees = particle.angleDegrees + particle.angleDiff
    } else {
      particle.angleDegrees = particle.angleDegrees - particle.angleDiff
    }
    if (Math.random() < 0.1) {
      particle.angleUp = !particle.angleUp
    }

    if (particle.speedUp) {
      particle.speed = particle.speed + particle.speedDiff
    } else {
      particle.speed = Math.abs(particle.speed - particle.speedDiff)
    }
    if (Math.random() < 0.1) {
      particle.speedUp = !particle.speedUp
    }

    if (particle.x < -window.innerWidth ||
        particle.x > window.innerWidth * 2 ||
        particle.y < -window.innerHeight ||
        particle.y > window.innerHeight * 2 ||
        particle.life < 0) {
      return false
    } else {
      return true
    }
  })
  particleBuffers.shower = particles
}
