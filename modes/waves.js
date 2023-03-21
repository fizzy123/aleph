async function generateWavesParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  let neighbors = getNeighborParams(span)
  // average rule
  let sum = neighbors.map(function(neighbor) {
    return neighbor.intensity
  }).reduce(function(intensity, currentValue) {
    return intensity + currentValue
  }, 0)

  let deviation = neighbors.map(function(neighbor) {
    return neighbor.intensity
  }).reduce(function(intensity, currentValue) {
    return Math.abs(intensity - sum/8) + currentValue
  }, 0) / 8

  if (span.intensity < 0.01) {
    span.bounce = true
    console
  }
  if (deviation > 0.14) {
    intensity = (span.intensity + 0.1) % 1
  } else {
    if (span.bounce) {
      intensity = Math.abs(sum/8 + 0.02)
      if (intensity > 1) {
        span.bounce = false
      }
    } else {
      intensity = Math.abs(sum/8 - 0.01)
    }
  }

  // fade if there's no other effect
  if (span.intensity >= 0.00001 && neighbors.length === 0) {
    intensity = span.intensity - 1/CHARACTER_INTENSITY_ARRAYS[0].length
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
