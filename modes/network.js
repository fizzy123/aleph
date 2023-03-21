async function updateNetworkParticles() {
  let particleConfig = {
    limit: 1000,
    generationRate: 0.2,
    startingXRange: window.innerWidth,
    startingYRange: window.innerHeight,
    speed: 15,
    angle: randomChoice([0, 90, 180, 270]),
    angleDiff: 90,
    speedDiff: 0.3
  };
  particles = particleBuffers.network

  // Add particles
  if (particles.length < particleConfig.limit) {
    if (Math.random() < particleConfig.generationRate) {
      let xPosition = Math.floor(window.innerWidth * Math.random())
      let yPosition = Math.floor(window.innerHeight * Math.random())
      let speed = particleConfig.speed
      let angle = particleConfig.angle
      let life = MAX_LIFE * 10
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

  populatedSpans = {}
  // Update particles
  particles = await async.filter(particles, async function(particle) {
    let isCollision = false
    let spanX = Math.floor(particle.x / CHARACTER_WIDTH)
    let spanY = Math.floor(particle.y / CHARACTER_HEIGHT)
    let spanId = getSpanId(spanX, spanY)
    let span = charSpans[spanId.toString()]
    if (populatedSpans[spanId]) {
      return false
    }
    populatedSpans[spanId] = true
    if (span) {
      span.intensityOverride = particle.life/MAX_LIFE
      if (span.intensityOverride > 1) {
        span.intensityOverride = 1
      }

      switch (particle.angleDegrees) {
        case 0:
          nextSpanId = getSpanId(wrapAround(span.x + 1, MAX_X + 1), span.y)
          nextSpan = charSpans[nextSpanId]
          if (nextSpan && nextSpan.intensity >= 0.01) {
            isCollision = true
          }
          break;
        case 90:
          nextSpanId = getSpanId(span.x, wrapAround(span.y + 1, MAX_Y + 1))
          nextSpan = charSpans[nextSpanId]
          if (nextSpan && nextSpan.intensity >= 0.01) {
            isCollision = true
          }
          break;
        case 180:
          nextSpanId = getSpanId(wrapAround(span.x - 1, MAX_X + 1), span.y)
          nextSpan = charSpans[nextSpanId]
          if (nextSpan && nextSpan.intensity >= 0.01) {
            isCollision = true
          }
          break;
        case 270:
          nextSpanId = getSpanId(span.x, wrapAround(span.y - 1, MAX_Y + 1))
          nextSpan = charSpans[nextSpanId]
          if (nextSpan && nextSpan.intensity >= 0.01) {
            isCollision = true
          }
          break;
      }
    }

    if (isCollision) {
      if (particle.angleUp) {
        particle.angleDegrees = (particle.angleDegrees + particle.angleDiff + 360) % 360
      } else {
        particle.angleDegrees = (particle.angleDegrees - particle.angleDiff + 360) % 360
      }
    }

    particle.life = particle.life - 1

    let xdiff = particle.speed * Math.cos(particle.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = particle.speed * Math.sin(particle.angleDegrees / 360 * 2 * Math.PI)

    if (Math.random() < 0.1) {
      particle.angleUp = !particle.angleUp
    }

    particle.x = particle.x + xdiff
    particle.y = particle.y + ydiff

    width = MAX_X * CHARACTER_WIDTH
    height = MAX_Y * CHARACTER_HEIGHT
    if (particle.x < 0) {
      particle.x = particle.x + width
    }
    if (particle.x >= width) {
      particle.x = particle.x - width
    }
    if (particle.y < 0) {
      particle.y = particle.y + height
    }
    if (particle.y >= height) {
      particle.y = particle.y - height
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
  particleBuffers.network = particles
}

async function generateNetworkParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  if (span.intensity >= 0.01) {
    intensity = span.intensity - 1/CHARACTER_INTENSITY_ARRAYS[0].length
  } else {
    intensity = span.intensity
  }

  // show particles
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
}
