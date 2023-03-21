let charSpans = {};
let CHARSET_ID = 0
let SPAN_COUNT = 0;
const CHARACTER_INTENSITY_ARRAYS = [
  `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^\`'. `.split("").reverse().join(""),
  ` .:-=+*#%@`
]
const CHARACTER_WIDTH = 15
const CHARACTER_HEIGHT = 15

var cursor_x = 0;
var cursor_y = 0;
document.onmousemove = function(event)
{
 cursor_x = event.pageX;
 cursor_y = event.pageY;
}

function posToInt(posStr) {
  return parseInt(posStr.slice(0, -2))
}

let lyric1 = "FATE FELL SHORT THIS TIME / YOUR SMILE FADES IN THE SUMMER / PLACE YOUR HAND IN MINE / I'LL LEAVE WHEN I WANNA / "
let lyric2 = "ARE WE ALONE? DO YOU FEEL IT? / SO LOST AND DISILLUSIONED / "

let critters = {
  asteroid:[],
  text:[],
  saturn:[],
  eclipse:[],
  meteor:[],
  intro: [],
}
// we want these to point at the same object
critters.sun = critters.eclipse
let MAX_LIFE = 150
function critterIntroAction() {
  for (let critter of critters.intro) {
    // update values
    let xdiff = critter.speed * Math.cos(critter.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = critter.speed * Math.sin(critter.angleDegrees / 360 * 2 * Math.PI)

    critter.x = critter.x + xdiff
    critter.y = critter.y + ydiff
    if (critter.angleUp) {
      critter.angleDegrees = (critter.angleDegrees + 5) % 360
    } else {
      critter.angleDegrees = critter.angleDegrees - 5
      if (critter.angleDegrees < 0) {
        critter.angleDegrees = 359
      }
    }
    if (Math.random() > 0.9) {
      critter.angleUp = !critter.angleUp
    }
  }

  for (let i=0;i<critters.intro.length;i++) {
    let critter = critters.intro[i]
    if (critter.x < 0 ||
        critter.x > window.innerWidth ||
        critter.y < 0 ||
        critter.y > window.innerHeight ||
        critter.life < 1) {
      critters.intro.splice(i, 1)
    }
  }
}

function critterTextAction() {
  let CRITTER_ANGLE = 10 / 360 * 2 * Math.PI
  if (critters.text.length < 1) {
      for (let i = 0; i < 0; i++) {
        let xPosition = 0
        let yPosition = 20
        let speed = 10
        let angle = 0
        let life = MAX_LIFE
        critters.text.push({
          x: xPosition,
          y: yPosition,
          angleDegrees: angle,
          angleUp: true,
          life: life,
          speed: speed,
        })
      }
  }
  for (let critter of critters.text) {
    // update values
    let xdiff = critter.speed * Math.cos(critter.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = critter.speed * Math.sin(critter.angleDegrees / 360 * 2 * Math.PI)

    critter.x = critter.x + xdiff
    critter.y = critter.y + ydiff
    if (critter.angleUp) {
      critter.angleDegrees = (critter.angleDegrees + 5) % 360
    } else {
      critter.angleDegrees = critter.angleDegrees - 5
      if (critter.angleDegrees < 0) {
        critter.angleDegrees = 359
      }
    }
    critter.life = critter.life - 2
    if (Math.random() > 0.9) {
      critter.angleUp = !critter.angleUp
    }
  }

  for (let i=0;i<critters.text.length;i++) {
    let critter = critters.text[i]
    if (critter.x < 0 ||
        critter.x > window.innerWidth ||
        critter.y < 0 ||
        critter.y > window.innerHeight ||
        critter.life < 1) {
      critters.text.splice(i, 1)
    }
  }
}

let SATURN_PASS = false
let SATURN_PARAMS = [
  {
    angle: -30,
    x: 0.21,
    y: 0.73,
  },
  {
    angle: -20,
    x: 0.19,
    y: 0.65,
  },
  {
    angle: -10,
    x: 0.17,
    y: 0.55,
  },
  {
    angle: 30,
    x: 0.23,
    y: 0.17,
  },
  {
    angle: 0,
    x: 0.17,
    y: 0.45,
  },
  {
    angle: 20,
    x: 0.17,
    y: 0.25,
  },
  {
    angle: 10,
    x: 0.17,
    y: 0.32,
  },
]
let SATURN_PARAMS_INDEX = 0
function critterSaturnAction() {
  let CRITTER_ANGLE = SATURN_PARAMS[SATURN_PARAMS_INDEX].angle / 360 * 2 * Math.PI
  if (critters.saturn.length < 200) {
    if (Math.random() < 0.1) {
      for (let i = 0; i < 1; i++) {
        let xPosition = Math.floor(SATURN_PARAMS[SATURN_PARAMS_INDEX].x * window.innerWidth) + Math.random() * 100
        let yPosition = Math.floor(SATURN_PARAMS[SATURN_PARAMS_INDEX].y * window.innerHeight) + Math.random() * 100
        let speed = 10
        let angle = -90
        let life = MAX_LIFE
        critters.saturn.push({
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
  for (let critter of critters.saturn) {
    // update values
    let xdiff = critter.speed * Math.cos(critter.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = critter.speed * Math.sin(critter.angleDegrees / 360 * 2 * Math.PI) / 3

    let realXDiff = xdiff * Math.cos(CRITTER_ANGLE) - ydiff * Math.sin(CRITTER_ANGLE)
    let realYDiff = xdiff * Math.sin(CRITTER_ANGLE) - ydiff * Math.cos(CRITTER_ANGLE)

    critter.x = critter.x + realXDiff
    critter.y = critter.y + realYDiff
    critter.saturnDirection = realXDiff > 0
    if (critter.angleUp) {
      critter.angleDegrees = (critter.angleDegrees + 1) % 360
    }
  }

  for (let i=0;i<critters.saturn.length;i++) {
    let critter = critters.saturn[i]
    if (critter.x < 0 ||
        critter.x > window.innerWidth ||
        critter.y < 0 ||
        critter.y > window.innerHeight ||
        critter.life < 1) {
      critters.saturn.splice(i, 1)
    }
  }
}

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

function critterAsteroidAction() {
  if (critters.asteroid.length < 100) {
    if (Math.random() < 0.5) {
      for (let i = 0; i < 1; i++) {
        let xPosition = Math.floor(ASTEROID_PARAMS[ASTEROID_PARAMS_INDEX].x * window.innerWidth) + Math.random() * 800
        let yPosition = window.innerHeight
        let speed = 5
        let angle = ASTEROID_PARAMS[ASTEROID_PARAMS_INDEX].angle
        let life = MAX_LIFE
        critters.asteroid.push({
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
  for (let critter of critters.asteroid) {
    // update values
    let xdiff = critter.speed * Math.cos(critter.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = critter.speed * Math.sin(critter.angleDegrees / 360 * 2 * Math.PI)

    critter.x = critter.x + xdiff
    critter.y = critter.y + ydiff
    if (critter.angleUp) {
      critter.angleDegrees = (critter.angleDegrees + ASTEROID_PARAMS[ASTEROID_PARAMS_INDEX].angleDiff) % 360
    }
  }

  for (let i=0;i<critters.asteroid.length;i++) {
    let critter = critters.asteroid[i]
    if (critter.x < 0 ||
        critter.x > window.innerWidth ||
        critter.y < 0 ||
        critter.y > window.innerHeight ||
        critter.life < 1) {
      critters.asteroid.splice(i, 1)
    }
  }
}

function critterSunAction() {
  critterEclipseAction()
}

function critterEclipseAction() {
  if (critters.eclipse.length < 2000) {
    for (let i = 0; i < 5; i++) {
      let xPosition = Math.floor(0.5 * window.innerWidth)
      let yPosition = Math.floor(0.5 * window.innerHeight)
      let speed = 10
      let angle = Math.floor(Math.random() * 360)
      let life = MAX_LIFE
      critters.eclipse.push({
        x: xPosition,
        y: yPosition,
        angleDegrees: angle,
        angleUp: true,
        life: life,
        speed: speed,
      })
    }
  }
  for (let critter of critters.eclipse) {
    // update values
    let xdiff = critter.speed * Math.cos(critter.angleDegrees / 360 * 2 * Math.PI)
    let ydiff = critter.speed * Math.sin(critter.angleDegrees / 360 * 2 * Math.PI)

    critter.x = critter.x + xdiff
    critter.y = critter.y + ydiff
    if (critter.angleUp) {
      critter.angleDegrees = (critter.angleDegrees + 5) % 360
    } else {
      critter.angleDegrees = critter.angleDegrees - 5
      if (critter.angleDegrees < 0) {
        critter.angleDegrees = 359
      }
    }
    critter.life = critter.life - 2
    if (Math.random() > 0.9) {
      critter.angleUp = !critter.angleUp
    }
  }

  for (let i=0;i<critters.eclipse.length;i++) {
    let critter = critters.eclipse[i]
    if (critter.x < 0 ||
        critter.x > window.innerWidth ||
        critter.y < 0 ||
        critter.y > window.innerHeight ||
        critter.life < 1) {
      critters.eclipse.splice(i, 1)
    }
  }
}

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
function critterMeteorAction() {
  let CRITTER_ANGLE = METEOR_PARAMS[METEOR_SETTING_INDEX].angle / 360 * 2 * Math.PI
  if (critters.meteor.length < 2000) {
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
      critters.meteor.push({
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
  for (let critter of critters.meteor) {
    // update values
    let xdiff = critter.speed * Math.cos(critter.angleDegrees / 360 * 2 * Math.PI) / (4 + METEOR_WIDTH_FACTOR)
    let ydiff = 0 - Math.abs(critter.speed * Math.sin(critter.angleDegrees / 360 * 2 * Math.PI))

    critter.x = critter.x + xdiff * Math.cos(CRITTER_ANGLE) - ydiff * Math.sin(CRITTER_ANGLE)
    critter.y = critter.y + xdiff * Math.sin(CRITTER_ANGLE) - ydiff * Math.cos(CRITTER_ANGLE)
    if (critter.type !== "stars") {
      if (critter.angleUp) {
        critter.angleDegrees = (critter.angleDegrees + 5) % 360
      } else {
        critter.angleDegrees = critter.angleDegrees - 5
        if (critter.angleDegrees < 0) {
          critter.angleDegrees = 359
        }
      }
    }
    critter.life = critter.life - 1
    if (Math.random() > 0.9) {
      critter.angleUp = !critter.angleUp
    }
  }

  for (let i=0;i<critters.meteor.length;i++) {
    let critter = critters.meteor[i]
    if (critter.x < 0 ||
        critter.x > window.innerWidth ||
        critter.y < 0 ||
        critter.y > window.innerHeight ||
        critter.life < 1) {
      critters.meteor.splice(i, 1)
    }
  }
}

function generateIntroParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]

  let charIntensity = 0
  if (span.charIntensity >= 0.00001) {
    charIntensity = span.charIntensity - 1/CHARACTER_INTENSITY_ARRAYS[0].length
  }

  if (span.charIntensityOverride) {
    charIntensity = span.charIntensityOverride
    span.charIntensityOverride = 0
  }

  let colorIndex = Math.floor((1 - charIntensity) * colorPalette.length)
  return {
    charIntensity,
    color: colorPalette[colorIndex],
  }
};

let SATURN_SIZE_FACTOR = 0
function generateSaturnParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]

  let charIntensity = 0
  if (span.charIntensity < 0.001 && Math.random() > 0.9999) {
    charIntensity = 1
  } else if (span.charIntensity >= 0.00001) {
    charIntensity = span.charIntensity - 1/CHARACTER_INTENSITY_ARRAYS[0].length
    if (charIntensity < 0.01) {
      span.particle = false
    }
  }

  spanX = posToInt(span.style.left)
  spanY = posToInt(span.style.top)

  spanXDiff = spanX - (window.innerWidth/2)
  spanYDiff = spanY - (window.innerHeight/2)
  distance = Math.sqrt(Math.pow(spanXDiff, 2) + Math.pow(spanYDiff, 2))
  if (distance < 300 + SATURN_SIZE_FACTOR && !span.particle) {
    if ((300 + SATURN_SIZE_FACTOR - distance) < 100) {
      charIntensity = 1 -  (300 + SATURN_SIZE_FACTOR - distance) / 100
    } else {
      charIntensity = 0.001
    }
  }

  if (span.charIntensityOverride) {
    if (span.saturnDirection != SATURN_PASS) {
      span.particle = true
    }
    if (!((!span.saturnDirection) != SATURN_PASS && distance < 300 + SATURN_SIZE_FACTOR)) {
      charIntensity = span.charIntensityOverride
    }
    span.charIntensityOverride = 0
  }

  let colorIndex = Math.floor((1 - charIntensity) * colorPalette.length)
  return {
    charIntensity,
    color: colorPalette[colorIndex],
  }
};

function generateAsteroidParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]

  let charIntensity = 0
  if (span.charIntensity < 0.001 && Math.random() > 0.9999) {
    charIntensity = 1
  } else if (span.charIntensity >= 0.00001) {
    charIntensity = span.charIntensity - 1/CHARACTER_INTENSITY_ARRAYS[0].length
  }

  spanX = posToInt(span.style.left)
  spanY = posToInt(span.style.top)
  spanXDiff = spanX - (window.innerWidth/2)
  spanYDiff = spanY - (window.innerHeight/2)
  distance = Math.sqrt(Math.pow(spanXDiff, 2) + Math.pow(spanYDiff, 2))
  if (distance < 350) {
  //  charIntensity = 1
  }

  if (span.charIntensityOverride) {
    charIntensity = span.charIntensityOverride
    span.charIntensityOverride = 0
  }

  let colorIndex = Math.floor((1 - charIntensity) * colorPalette.length)
  return {
    charIntensity,
    color: colorPalette[colorIndex],
  }
};

let SUN_SIZE_FACTOR = 0
function generateSunParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]

  spanX = posToInt(span.style.left)
  spanY = posToInt(span.style.top)
  spanXDiff = spanX - (window.innerWidth/2)
  spanYDiff = spanY - (window.innerHeight/2)
  distance = Math.sqrt(Math.pow(spanXDiff, 2) + Math.pow(spanYDiff, 2))
  let charIntensity = 0
  if (distance < 300 + SUN_SIZE_FACTOR) {
    charIntensity = 1
  }


  if (span.charIntensityOverride) {
    charIntensity = span.charIntensityOverride
    span.charIntensityOverride = 0
  }

//  charIntensity = span.charIntensity
  let colorIndex = Math.floor((1 - charIntensity) * colorPalette.length)
  return {
    charIntensity,
    color: colorPalette[colorIndex],
  }
};

function generateEclipseParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]

  let charIntensity = 0

  if (span.charIntensityOverride) {
    charIntensity = span.charIntensityOverride
    span.charIntensityOverride = 0
  }

  spanX = posToInt(span.style.left)
  spanY = posToInt(span.style.top)
  spanXDiff = spanX - (window.innerWidth/2)
  spanYDiff = spanY - (window.innerHeight/2)
  distance = Math.sqrt(Math.pow(spanXDiff, 2) + Math.pow(spanYDiff, 2))
  if (distance < 300 + SUN_SIZE_FACTOR) {
    charIntensity = 0
  } else {
    charIntensity = charIntensity * 1.75
  }

  let colorIndex = Math.floor((1 - charIntensity) * colorPalette.length)
  return {
    charIntensity,
    color: colorPalette[colorIndex],
  }
};

function generateMeteorParams(span) {
  let colorPalette = COLOR_PALETTES[currentPaletteIndex]

  let charIntensity = 0
  if (span.charIntensity >= 0.00001) {
    charIntensity = 0.001
  }

  if (span.charIntensityOverride) {
    charIntensity = span.charIntensityOverride
    span.charIntensityOverride = 0
  }

  let colorIndex = Math.floor((1 - charIntensity) * colorPalette.length)
  return {
    charIntensity,
    color: colorPalette[colorIndex],
  }
};

const COLOR_PALETTES = [
  // https://coolors.co/palette/0c0a3e-7b1e7a-b33f62-f9564f-f3c677
  [
    "#f3c677",
    "#f9564f",
    "#b33f62",
    "#7b1e7a",
    "#0c0a3e",
  ],
  // https://coolors.co/palette/11151c-212d40-364156-7d4e57-d66853
  [
    "#d66853",
    "#7d4e57",
    "#364156",
    "#212d40",
    "#11151c",
  ],
  // https://coolors.co/palette/331e36-41337a-6ea4bf-c2efeb-ecfee8
  [
    "#ecfee8",
    "#c2efeb",
    "#6ea4bf",
    "#41337a",
    "#331e36",
  ],
  // https://coolors.co/palette/0b132b-1c2541-3a506b-5bc0be-ffffff
  [
    "#ffffff",
    "#5bc0be",
    "#3a506b",
    "#1c2541",
    "#0b132b",
  ],
  // https://coolors.co/palette/ef6351-f38375-f7a399-fbc3bc-ffe3e0
  [
    "#ffe3e0",
    "#fbc3bc",
    "#f7a399",
    "#f38375",
    "#ef6351",
  ],
  // https://coolors.co/palette/231942-5e548e-9f86c0-be95c4-e0b1cb
  [
    "#e0b1cb",
    "#be95c4",
    "#9f86c0",
    "#5e548e",
    "#231942",
  ],
  // https://coolors.co/palette/eaeaea-893168-4a1942-2e1c2b-050404
  [
    "#eaeaea",
    "#893168",
    "#4a1942",
    "#2e1c2b",
    "#050404",
  ],
  // https://coolors.co/palette/0b132b-1c2541-3a506b-5bc0be-6fffe9
  [
    "#6fffe9",
    "#5bc0be",
    "#3a506b",
    "#1c2541",
    "#0b132b",
  ],
  // https://coolors.co/palette/0081a7-00afb9-fdfcdc-fed9b7-f07167
  [
    "#0081a7",
    "#00afb9",
    "#fdfcdc",
    "#fed9b7",
    "#f07167",
  ],
  // https://coolors.co/palette/faf3dd-c8d5b9-8fc0a9-68b0ab-696d7d
  [
    "#faf3dd",
    "#c8d5b9",
    "#8fc0a9",
    "#68b0ab",
    "#696d7d",
  ],
  // https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
  [
    "#c7f9cc",
    "#80ed99",
    "#57cc99",
    "#38a3a5",
    "#22577a",
  ],
  // https://coolors.co/palette/7400b8-6930c3-5e60ce-5390d9-4ea8de-48bfe3-56cfe1-64dfdf-72efdd-80ffdb
  [
    "#80ffdb",
    "#72efdd",
    "#64dfdf",
    "#56cfe1",
    "#48bfe3",
    "#4ea8de",
    "#5390d9",
    "#5e60ce",
    "#6930c3",
    "#7400b8",
  ],
  // https://coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
  [
    "#001219",
    "#005f73",
    "#0a9396",
    "#94d2bd",
    "#e9d8a6",
    "#ee9b00",
    "#ca6702",
    "#bb3e03",
    "#ae2012",
    "#9b2226",
  ],
  // https://coolors.co/palette/355070-6d597a-b56576-e56b6f-eaac8b
  [
    "#eaac8b",
    "#e56b6f",
    "#b56576",
    "#6d597a",
    "#355070",
  ],
  // https://coolors.co/palette/05668d-028090-00a896-02c39a-f0f3bd
  [
    "#f0f3bd",
    "#02c39a",
    "#00a896",
    "#028090",
    "#05668d",
  ],
  // https://coolors.co/palette/22223b-4a4e69-9a8c98-c9ada7-f2e9e4
  [
    "#f2e9e4",
    "#c9ada7",
    "#9a8c98",
    "#4a4e69",
    "#22223b",
  ],
  // https://coolors.co/palette/f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0
  [
    "#f72585",
    "#b5179e",
    "#7209b7",
    "#560bad",
    "#480ca8",
    "#3a0ca3",
    "#3f37c9",
    "#4361ee",
    "#4895ef",
    "#4cc9f0",
  ],
  // https://coolors.co/palette/ffd6ff-e7c6ff-c8b6ff-b8c0ff-bbd0ff
  [
    "#ffd6ff",
    "#e7c6ff",
    "#c8b6ff",
    "#b8c0ff",
    "#bbd0ff",
  ],
  // https://coolors.co/palette/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08
  [
    "#ffba08",
    "#faa307",
    "#f48c06",
    "#e85d04",
    "#dc2f02",
    "#d00000",
    "#9d0208",
    "#6a040f",
    "#370617",
    "#03071e",
  ],
  // https://coolors.co/palette/cad2c5-84a98c-52796f-354f52-2f3e46
  [
    "#cad2c5",
    "#84a98c",
    "#52796f",
    "#354f52",
    "#2f3e46",
  ],
  // https://coolors.co/palette/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-ade8f4-caf0f8
  [
    "#caf0f8",
    "#ade8f4",
    "#90e0ef",
    "#48cae4",
    "#00b4d8",
    "#0096c7",
    "#0077b6",
    "#023e8a",
    "#03045e",
  ],
  // https://coolors.co/palette/132a13-31572c-4f772d-90a955-ecf39e
  [
    "#ecf39e",
    "#90a955",
    "#4f772d",
    "#31572c",
    "#132a13",
  ],
  // https://coolors.co/palette/003049-d62828-f77f00-fcbf49-eae2b7
  [
    "#eae2b7",
    "#fcbf49",
    "#f77f00",
    "#d62828",
    "#003049",
  ],
  // https://coolors.co/palette/264653-2a9d8f-e9c46a-f4a261-e76f51
  [
    "#e76f51",
    "#f4a261",
    "#e9c46a",
    "#2a9d8f",
    "#264653",
  ],
  // https://coolors.co/palette/cdb4db-ffc8dd-ffafcc-bde0fe-a2d2ff
  [
    "#cdb4db",
    "#ffc8dd",
    "#ffafcc",
    "#bde0fe",
    "#a2d2ff"
  ],
  // https://coolors.co/palette/ffcdb2-ffb4a2-e5989b-b5838d-6d6875
  [
    "#ffcdb2",
    "#ffb4a2",
    "#e5989b",
    "#b5838d",
    "#6d6875"
  ],
  // https://coolors.co/palette/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
  [
    "#D9ED92",
    "#B5E48C",
    "#99D98C",
    "#76C893",
    "#52B69A",
    "#34A0A4",
    "#168AAD",
    "#1A759F",
    "#1E6091",
    "#184E77",
  ],
  // https://coolors.co/palette/22223b-4a4e69-9a8c98-c9ada7-f2e9e4
  [
    "#22223B",
    "#4A4E69",
    "#9A8C98",
    "#C9ADA7",
    "#F2E9E4",
  ]
]


let spanWidth
let spanHeight
let lyric1Buff = lyric1
let lyric2Buff = lyric2

function matchWidth(str, add) {
  while (str.length < spanWidth) {
    str = str.concat(add)
  }
  return str.slice(0, spanWidth)
}
window.onload = function() {
  let CHARSET_ID = 0

  function init() {
    document.body.style.backgroundColor = "black";
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    for(let y=0; y<windowHeight/CHARACTER_HEIGHT; y++) {
      for(let x=0; x<windowWidth/CHARACTER_WIDTH; x++) {
        let id = y * Math.floor(windowWidth/CHARACTER_WIDTH) + x
        const charSpan = document.createElement("span")
        charSpan.id = id
        charSpan.x = x
        charSpan.y = y
        charSpan.charIntensity = 0;
        charSpan.style.position = "absolute";
        charSpan.style.top = y * CHARACTER_HEIGHT;
        charSpan.style.left = x * CHARACTER_WIDTH;
        charSpan.style.fontFamily = "Roboto Mono";
        charSpan.style.color = "white";
        charSpans[id.toString()] = charSpan
        document.body.append(charSpan)

        spanWidth = x
      }
      spanHeight = y
    }
  }
  function draw() {
    modes.asteroid.critterAction();
    modes.saturn.critterAction();
    modes.eclipse.critterAction();
    modes.meteor.critterAction();
    if (currentMode === 'intro') {
      modes.intro.critterAction();
    }
    for (let critter of critters[currentMode]) {
      let spanX = Math.round(critter.x / CHARACTER_WIDTH)
      let spanY = Math.round(critter.y / CHARACTER_HEIGHT)
      let spanId = getSpanId(spanX, spanY)
      let span = charSpans[spanId.toString()]
      if (span) {
        span.charIntensityOverride = critter.life/MAX_LIFE
        span.saturnDirection = critter.saturnDirection
      }
    }
    for (let spanId in charSpans) {
      let span = charSpans[spanId]
      let newParams = modes[currentMode].generateParams(span);
      if (reset) {
        newParams = {}
        newParams.color = "#000"
        newParams.charIntensity = 0.0001
      }
      if (newParams.color) {
        span.style.color = newParams.color
      }
      if (newParams.backgroundColor) {
        span.style.backgroundColor = newParams.backgroundColor
      }

      if (newParams.charIntensity) {
        let currentCharIntensityArray = CHARACTER_INTENSITY_ARRAYS[CHARSET_ID]
        let spanCharIndex = Math.floor(newParams.charIntensity * currentCharIntensityArray.length)
        if (spanCharIndex >= currentCharIntensityArray.length) {
          spanCharIndex = currentCharIntensityArray.length - 1
        }
        if (spanCharIndex < 0) {
          spanCharIndex = 0
        }
        span.charIntensity = newParams.charIntensity
        span.innerHTML = currentCharIntensityArray[spanCharIndex]
      }
      if (newParams.weight) {
        span.style.fontWeight = newParams.weight;
      }
    }
    if (reset) {
      reset = false
    }
    if (throttle > throttleMult && currentMode === "text") {
      print([matchWidth(lyric1Buff, lyric1Buff)], 0, 0)
      lyric1Buff = lyric1Buff.slice(1) + lyric1Buff[0];


      print([matchWidth(lyric2Buff, lyric2Buff)], 0, spanHeight - 1)
      lyric2Buff = lyric2Buff.slice(1) + lyric2Buff[0];
      throttle = 0

    }
    throttle = throttle + 1
  }

  init()
  window.onresize = function() {
    document.body.innerHTML = "";
    charSpans = {}
    init()
  }
  MainLoop.setDraw(draw).start();

  WebMidi.enable(function(err) {
    if (err) throw err;
    WebMidi.getInputByName('IAC Driver Bus 1').addListener('noteon', 'all', function(e) {
      if (currentMode !== "intro") {
        randomMode();
      } else {
        if (e.note.name === "B" && e.note.octave === 3) {
          for (let i = 0; i < 1; i++) {
            let xPosition = Math.floor(0.5 * window.innerWidth)
            let yPosition = Math.floor(0.5 * window.innerHeight)
            let speed = 10
            let angle = Math.floor(Math.random() * 360)
            let life = MAX_LIFE
            critters.intro.push({
              x: xPosition,
              y: yPosition,
              angleDegrees: angle,
              angleUp: true,
              life: life,
              speed: speed,
            })
          }
        }
        if (e.note.name === "A" && e.note.octave === 3) {
          randomMode();
        }
      }
    });
  });
};

let LAST_SATURN_SETUP = Date.now()
let LAST_ASTEROID_SETUP = Date.now()
let modes = {
  "saturn": {
    generateParams: generateSaturnParams,
    critterAction: critterSaturnAction,
    customResetFunc: function() {
      SATURN_PASS = Math.random() > 0.5
      SATURN_PARAMS_INDEX = Math.floor(SATURN_PARAMS.length * Math.random())
      if (SATURN_PARAMS_INDEX > SATURN_PARAMS.length - 1) {
        SATURN_PARAMS_INDEX = SATURN_PARAMS.length - 1
      }
      SATURN_SIZE_FACTOR = Math.random() * 200 - 100
      critters.saturn = []
      LAST_SATURN_SETUP = Date.now()
    },
  },
  "asteroid": {
    generateParams: generateAsteroidParams,
    critterAction: critterAsteroidAction,
    customResetFunc: function() {
      ASTEROID_PARAMS_INDEX = Math.floor(ASTEROID_PARAMS.length * Math.random())
      if (ASTEROID_PARAMS_INDEX > ASTEROID_PARAMS.length - 1) {
        ASTEROID_PARAMS_INDEX = ASTEROID_PARAMS.length - 1
      }
      critters.asteroid = []
      LAST_ASTEROID_SETUP = Date.now()
    },
  },
  "sun": {
    generateParams: generateSunParams,
    critterAction: critterSunAction,
    customResetFunc: function() {
      SUN_SIZE_FACTOR = Math.random() * 200 - 100
    },
  },
  "eclipse": {
    generateParams: generateEclipseParams,
    critterAction: critterEclipseAction,
    customResetFunc: function() {
      SUN_SIZE_FACTOR = Math.random() * 200 - 100
    },
  },
  "meteor": {
    generateParams: generateMeteorParams,
    critterAction: critterMeteorAction,
    customResetFunc: function() {
      METEOR_SETTING_INDEX = Math.floor(METEOR_PARAMS.length * Math.random())
      if (METEOR_SETTING_INDEX > METEOR_PARAMS.length - 1) {
        METEOR_SETTING_INDEX = METEOR_PARAMS.length - 1
      }
      METEOR_WIDTH_FACTOR = 4 * Math.random()
    },
  },
  "intro": {
    generateParams: generateIntroParams,
    critterAction: critterIntroAction,
    customResetFunc: function() {
    },
  },
}
let generalModes = [
  "saturn", "asteroid", "sun", "eclipse", "meteor"
]
let currentMode = "sun"
let currentPaletteIndex = 0
let reset = false
function randomMode() {
  modes[currentMode].customResetFunc();
  let tempModes = generalModes.slice()
  tempModes.splice(tempModes.indexOf(currentMode), 1)
  // Saturn and needs some time to set up
  if (Date.now() - LAST_SATURN_SETUP < 1000 * 7) {
    tempModes.splice(tempModes.indexOf("saturn"), 1)
  }
  if (Date.now() - LAST_ASTEROID_SETUP < 1000 * 7) {
    tempModes.splice(tempModes.indexOf("asteroid"), 1)
  }
  currentMode = tempModes[Math.floor(Math.random() * tempModes.length)]
  currentPaletteIndex = Math.floor(Math.random() * COLOR_PALETTES.length)
  reset = true
}

let throttle = 0;
let throttleMult = 8;

function getSpanId(spanX, spanY) {
  return spanY * Math.floor(window.innerWidth/CHARACTER_WIDTH) + spanX 
}

function print(strArray, x, y, color) {
  for (let i=0;i<strArray.length;i++) {
    if (i >= spanHeight) {
      continue
    }
    for (let j=0;j<strArray[0].length;j++){
      if (j >= spanWidth) {
        continue
      }
      let spanX = x + j
      let spanY = y + i
      let spanId = getSpanId(spanX, spanY)
      let span = charSpans[spanId.toString()]
      span.innerHTML = strArray[i][j]
      if (color) {
        charIndex = CHARACTER_INTENSITY_ARRAYS[0].indexOf(strArray[i][j])

        span.charIntensity = charIndex/(CHARACTER_INTENSITY_ARRAYS[0].length)
        colorFactor = 1 - charIndex/(CHARACTER_INTENSITY_ARRAYS[0].length)

        let colorPalette = COLOR_PALETTES[currentPaletteIndex]
        let colorIndex = Math.floor(colorFactor * colorPalette.length)
        if (colorIndex > colorPalette.length - 1) {
          colorIndex = colorPalette.length - 1
        }
        span.style.color = colorPalette[colorIndex]
        if (Math.random() < 0.01) {
          let xPosition = posToInt(span.style.left)
          let yPosition = posToInt(span.style.top)
          let speed = 10
          let angle = Math.floor(Math.random() * 360)
          let life = MAX_LIFE
          critters.text.push({
            x: xPosition,
            y: yPosition,
            angleDegrees: angle,
            angleUp: true,
            life: life,
            speed: speed,
          })
        }
      } else {
        span.style.color = "#fff"
      }

    }
  }
}


function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


