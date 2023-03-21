async function generateNoiseParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  let neighbors = getNeighborParams(span)
  // average rule
  let sum = neighbors.map(function(neighbor) {
    return neighbor.intensity
  }).reduce(function(intensity, currentValue) {
    return intensity + currentValue
  }, 0)
  intensity = sum/8 - 0.03

  // add random pixels
  if (Math.random() > 0.998) {
    span.rise = true
  }
  if (span.rise) {
    intensity = span.intensity + 0.02
  }
  if (intensity > 1) {
    intensity = 1
    span.rise = false
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
