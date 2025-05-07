// Configuration object with defined colors and settings
const config = {
  colors: [
    '#FF5733', // Orange-Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#F033FF', // Purple
    '#FF33F0', // Pink
    '#FFFF33', // Yellow
    '#33FFFF', // Cyan
    '#FF3333', // Red
    '#33FF33', // Lime
    '#3333FF'  // Deep Blue
  ],
  brushSize: 16, // 4x thicker than original (4)
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