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
  aspectRatio: 4/3, // 4:3 aspect ratio for the canvas
  baseWidth: 1280, // Base width for 4:3 ratio
  baseHeight: 960, // Base height for 4:3 ratio
  text: ["DEAR WORLD", " LEADERS,", "PLEASE STOP", "FUCKING UP", "OUR PLANET"], // Text split into 5 lines
  fontSize: 240, // Font size in points
  strokeWeight: 2, // Stroke weight for text

  // Constants for localStorage
  DRAWING_STORAGE_KEY: 'dearworldleaders_drawing'
}

export default config;
