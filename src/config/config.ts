// Configuration object with defined colors and settings
const config = {
  colors: [
    '#FF595E', // Bright Red
    '#FFCA3A', // Sunny Yellow
    '#8AC926', // Lime Green
    '#1982C4', // Sky Blue
    '#6A4C93', // Crayon Purple
    '#FF924C', // Orange Sherbet
    '#C4F0C2', // Pastel Green
    '#9D4EDD', // Vivid Violet
    '#FFD6A5'  // Creamy Peach
  ],
  brushSize: 16, // 4x thicker than original (4)
  brushOpacity: 0.8, // Opacity of the brush (0-1)
  aspectRatio: 16/9, // 4:3 aspect ratio for the canvas
  baseWidth: 1280, // Base width for 4:3 ratio
  baseHeight: 720, // Base height for 4:3 ratio
  text: ["Dear world Leaders", "PLEASE STOP", "FUCKING UP", "OUR PLANET"], // Text split into 4 lines
  fontSize: 230, // Font size in points
  strokeWeight: 2, // Stroke weight for text

  // Blend mode configuration
  defaultBlendMode: 'BLEND', // Default blend mode
  blendModes: [
    'BLEND',     // Default
    'MULTIPLY',  // Multiplies colors (darker)
    'SCREEN',    // Opposite of multiply (lighter)
    'OVERLAY',   // Mix of multiply and screen
    'SOFT_LIGHT', // Softer version of overlay
    'HARD_LIGHT', // Harsher version of overlay
    'DODGE',     // Lightens the base color
    'BURN',      // Darkens the base color
    'ADD',       // Adds colors together (brighter)
    'DIFFERENCE' // Subtracts colors (creates contrast)
  ],

  // Constants for localStorage
  DRAWING_STORAGE_KEY: 'dearworldleaders_drawing'
}

export default config;
