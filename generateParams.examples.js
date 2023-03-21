# concentric circles
function generateParams(span) {
  let distance = Math.hypot(Math.abs(parseInt(span.style.left.slice(0, -2)) - window.innerWidth/2), Math.abs(parseInt(span.style.top.slice(0, -2)) - window.innerHeight/2))
  charIntensity = distance + (Date.now()/10)
  charIntensity = charIntensity % 1000
//  let rgb = hslToRgb(hue, 1, 0.5)
//  let hex = rgbToHex(rgb[0], rgb[1], rgb[2])
  let hue = Math.abs(distance - (Date.now()/10))
  hue = hue % 1000
  let colorPalette = COLOR_PALETTES[0]
  return {
    charIntensity:1 - (charIntensity/1000 ),
    color: colorPalette[Math.floor(hue/1000 * colorPalette.length)],
  }
};

# Diagonal Lines
function generateParams(span) {
  let hue = (Math.abs(parseInt(span.style.left.slice(0, -2))/250 +  parseInt(span.style.top.slice(0, -2)) / 500 - Date.now()/1500 ) % 10) / 10
  let colorPalette = COLOR_PALETTES[0]
  return {
    charIntensity: ((Date.now()/1500 + parseInt(span.style.left.slice(0, -2))/250 +  parseInt(span.style.top.slice(0, -2)) / 125) % 10) / 10,
    color: colorPalette[Math.floor(hue * colorPalette.length)],
  }
};

# matrix
function generateParams(span) {
  let hue = (Math.abs(parseInt(span.style.left.slice(0, -2))/250 +  parseInt(span.style.top.slice(0, -2)) / 500 - Date.now()/1500 ) % 10) / 10
  let colorPalette = COLOR_PALETTES[0]

  let nextSpanId = parseInt(span.id) - Math.floor(window.innerWidth/CHARACTER_WIDTH)
  let nextSpan = {
    charIntensity: 0
  }
  if (nextSpanId > 0) {
    nextSpan = charSpans[nextSpanId.toString()]
  }

  let charIntensity = 0
  if (span.charIntensity < 0.001 && (Math.random() > 0.9999 || (nextSpan.charIntensity > 0.8 && nextSpan.charIntensity < 0.9))) {
    charIntensity = 1
  } else if (span.charIntensity >= 0.001) {
    charIntensity = span.charIntensity * 0.99
  }

//  charIntensity = span.charIntensity
  return {
    charIntensity,
    color: colorPalette[Math.floor(hue * colorPalette.length)],
  }
};

# diamonds (runs kinda slowly)
function generateParams(span) {
  let hue = (Math.abs(parseInt(span.style.left.slice(0, -2))/250 +  parseInt(span.style.top.slice(0, -2)) / 500 - Date.now()/1500 ) % 10) / 10
  let colorPalette = COLOR_PALETTES[0]

  let nextSpanId = parseInt(span.id) - Math.floor(window.innerWidth/CHARACTER_WIDTH)
  let nextSpan = {
    charIntensity: 0
  }
  if (nextSpanId > 0) {
    nextSpan = charSpans[nextSpanId.toString()]
  }

  let prevSpanId = parseInt(span.id) + Math.floor(window.innerWidth/CHARACTER_WIDTH)
  let prevSpan = {
    charIntensity: 0
  }
  if (prevSpanId < SPAN_COUNT) {
    prevSpan = charSpans[prevSpanId.toString()]
  }

  let leftSpanId = parseInt(span.id) + 1
  let leftSpan = {
    charIntensity: 0
  }
  if (leftSpanId < SPAN_COUNT) {
    leftSpan = charSpans[leftSpanId.toString()]
  }

  let rightSpanId = parseInt(span.id) - 1
  let rightSpan = {
    charIntensity: 0
  }
  if (rightSpanId > 0) {
    rightSpan = charSpans[rightSpanId.toString()]
  }

  let charIntensity = 0
  if (span.charIntensity < 0.01 &&
      (Math.random() > 0.999999 ||
        (nextSpan.charIntensity > 0.8 && nextSpan.charIntensity < 0.9) ||
        (prevSpan.charIntensity > 0.8 && prevSpan.charIntensity < 0.9) ||
        (leftSpan.charIntensity > 0.8 && leftSpan.charIntensity < 0.9) ||
        (rightSpan.charIntensity > 0.8 && rightSpan.charIntensity < 0.9)
      )) {
    charIntensity = 1
  } else if (span.charIntensity >= 0.01) {
    charIntensity = span.charIntensity * 0.99
  }

//  charIntensity = span.charIntensity
  return {
    charIntensity,
    color: colorPalette[Math.floor(hue * colorPalette.length)],
  }
};
