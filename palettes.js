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
