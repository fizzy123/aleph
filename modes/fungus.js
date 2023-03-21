async function generateFungusParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  let intensity = 0

  let neighbors = getNeighborParams(span)
  // life
  let count = neighbors.filter(function(neighbor) {
    return neighbor.intensity > 0.64
  }).length
  if (count > 2 && count < 4) {
    intensity = 1
  }
  if (count >= 4) {
    intensity = 0
  }
  if (count <= 2) {
    intensity = 0
  }

  // fade if there's no other effect
  if (span.intensity >= 0.00001) {
    intensity = span.intensity - 1/CHARACTER_INTENSITY_ARRAYS[0].length / 2
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
