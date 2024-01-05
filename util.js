function wrapAround(val, width) {
  return (val + width) % width
}

function componentToHex(c) {
  var hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function intensityToColor(intensity) {
  if (intensity <= 0) {
    return "#000000"
  }
  if (intensity > 1) {
    intensity = 1
  }
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]
  colorPosition = (1 - intensity) * (colorPalette.length - 2)
  lowColorIndex = Math.floor(colorPosition)
  highColorIndex = lowColorIndex + 1
  gradientAmount = colorPosition - lowColorIndex
  lowColor = colorPalette[lowColorIndex]
  highColor = colorPalette[highColorIndex]
  lowColorRgb = hexToRgb(lowColor)
  highColorRgb = hexToRgb(highColor)
  if (!highColorRgb || !lowColorRgb) {
    console.log("COLOR")
    console.log(intensity)
    console.log(colorPosition)
    console.log(highColorIndex)
    console.log(colorPalette.length)
  }
  newR = (lowColorRgb.r * (1-gradientAmount)) + highColorRgb.r * gradientAmount
  newG = (lowColorRgb.g * (1-gradientAmount)) + highColorRgb.g * gradientAmount
  newB = (lowColorRgb.b * (1-gradientAmount)) + highColorRgb.b * gradientAmount
  return rgbToHex(newR, newG, newB)
}

function getNeighborParams(span) {
  neighbors = []
  let x = span.x
  let y = span.y
  let xPlus = span.x + 1
  if (xPlus > MAX_X) {
    xPlus = 0
  }
  let yPlus = span.y + 1
  if (yPlus > MAX_Y) {
    yPlus = 0
  }
  let xMinus = span.x - 1
  if (xMinus < 0) {
    xMinus = MAX_X
  }
  let yMinus = span.y - 1
  if (yMinus < 0) {
    yMinus = MAX_Y
  }


  let spanId = getSpanId(xPlus, yPlus)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }

  spanId = getSpanId(x, yPlus)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }

  spanId = getSpanId(xMinus, yPlus)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }

  spanId = getSpanId(xPlus, y)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }

  spanId = getSpanId(xMinus, y)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }

  spanId = getSpanId(xPlus, yMinus)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }

  spanId = getSpanId(x, yMinus)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }

  spanId = getSpanId(xMinus, yMinus)
  if (paramsBuffers[activeCharSpanId][spanId]) {
    neighbors.push(paramsBuffers[activeCharSpanId][spanId])
  }
  return neighbors
}

// supports both simple arrays and complex weighted arrays
let randomChoice = (array) => {
  if (array.length === 0) {
    return
  }
  if (array[0].weight === undefined || Array.isArray(array[0])) {
    return array[Math.floor(array.length * Math.random())]
  } else {
    // First, we loop the main dataset to count up the total weight. We're starting the counter at one because the upper boundary of Math.random() is exclusive.
    var total = 0;
    for (var i = 0; i < array.length; ++i) {
      total += parseInt(array[i].weight);
    }

    // Total in hand, we can now pick a random value akin to our
    // random index from before.
    const threshold = Math.random() * total;

    // Now we just need to loop through the main data one more time
    // until we discover which value would live within this
    // particular threshold. We need to keep a running count of
    // weights as we go, so let's just reuse the "total" variable
    // since it was already declared.
    total = 0;
    for (var i = 0; i < array.length; ++i) {
      // Add the weight to our running total.
      total += parseInt(array[i].weight);

      // If this value falls within the threshold, we're done!
      if (total >= threshold) {
        return array[i].value;
      }
    }
    return array[i].value;
  }
}

let intensitySplit = (intensity) => {
  let charIntensity = 0
  let bgIntensity = 0
  if (intensity * 2 < 1) {
    charIntensity = intensity * 2
    bgIntensity = 0
  } else {
    charIntensity = 2 * (1 - intensity)
    bgIntensity = intensity * 2 - 1
  }
  return {
    charIntensity,
    bgIntensity
  }
}


