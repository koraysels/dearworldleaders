import './style/style.css'
import p5 from 'p5'

// Configuration object with defined colors
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
  strokeWeight: 2 // Stroke weight for text
}

// Function to get a random color from config
function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * config.colors.length)
  return config.colors[randomIndex]
}

// Function to update the color indicator
function updateColorIndicator(color: string) {
  const colorIndicator = document.getElementById('color-indicator')
  if (colorIndicator) {
    colorIndicator.style.backgroundColor = color
  }
}

// Function to draw a smooth line between two points
function drawSmoothLine(g: p5 | p5.Graphics, x1: number, y1: number, x2: number, y2: number) {
  // Calculate distance between points
  const distance = g.dist(x1, y1, x2, y2);

  // If the distance is very small, just draw a single point
  if (distance < 3) {
    g.point(x2, y2);
    return;
  }

  // Calculate how many points to interpolate based on distance
  const steps = Math.min(Math.max(Math.floor(distance / 2), 3), 10);

  // Draw a series of connected lines for smoother appearance
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const nextT = (i + 1) / steps;

    // Linear interpolation between points
    const x1i = g.lerp(x1, x2, t);
    const y1i = g.lerp(y1, y2, t);
    const x2i = g.lerp(x1, x2, nextT);
    const y2i = g.lerp(y1, y2, nextT);

    g.line(x1i, y1i, x2i, y2i);
  }
}

// Function to calculate canvas dimensions with 4:3 aspect ratio
function calculateCanvasDimensions(windowWidth: number, windowHeight: number) {
  // Calculate dimensions that fit within the window while maintaining 4:3 ratio
  let canvasWidth, canvasHeight;

  // If window is wider than 4:3 would require
  if (windowWidth / windowHeight > 4/3) {
    // Height is the limiting factor
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * (4/3);
  } else {
    // Width is the limiting factor
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / (4/3);
  }

  return { width: canvasWidth, height: canvasHeight };
}

// Create a new p5 instance
const sketch = (p: p5) => {
  // Variable to store the current user color
  let currentColor = getRandomColor()
  let nextColor = getRandomColor()
  let isDragging = false
  let drawingBuffer: p5.Graphics | null = null
  let textLayer: p5.Graphics | null = null
  let franxurterFont: p5.Font

  // Preload function to load assets before setup
  p.preload = () => {
    // Preload the Franxurter font
    franxurterFont = p.loadFont('/Franxurter.otf')
  }

  // Setup function runs once at the beginning
  p.setup = () => {
    // Calculate canvas dimensions with 4:3 aspect ratio
    const dimensions = calculateCanvasDimensions(window.innerWidth, window.innerHeight);

    // Create canvas with 4:3 aspect ratio
    const canvas = p.createCanvas(dimensions.width, dimensions.height)
    canvas.parent('p5-container')

    // Set pixel density to 2 for better rendering on high-DPI displays
    p.pixelDensity(2)

    // Enable smoothing for better line quality
    p.smooth()

    // Set white background
    p.background(255)

    // Create drawing buffer with the same dimensions
    drawingBuffer = p.createGraphics(p.width, p.height)
    drawingBuffer.pixelDensity(2)
    drawingBuffer.smooth()

    // Set blend mode to MULTIPLY for the drawing buffer
    drawingBuffer.blendMode(p.MULTIPLY)

    // Set initial stroke color and weight for both main canvas and buffer
    p.stroke(currentColor)
    p.strokeWeight(config.brushSize)
    drawingBuffer.stroke(currentColor)
    drawingBuffer.strokeWeight(config.brushSize)

    // Create text layer
    createTextLayer()

    // Update the color indicator with the initial color
    updateColorIndicator(currentColor)

    // Add event listener to the save icon
    const saveIcon = document.getElementById('save-icon')
    if (saveIcon) {
      saveIcon.addEventListener('click', () => {
        p.save('dearworldleaders_drawing.png')
      })
    }
  }

  // Function to create the text layer
  const createTextLayer = () => {
    // Create a graphics buffer for the text
    textLayer = p.createGraphics(p.width, p.height)
    textLayer.pixelDensity(2)
    textLayer.smooth()

    // Set the font
    textLayer.textFont(franxurterFont)

    // Calculate font size based on canvas dimensions
    const scaleFactor = Math.min(p.width / config.baseWidth, p.height / config.baseHeight)
    const fontSize = config.fontSize * scaleFactor

    // Set text properties
    textLayer.textSize(fontSize)
    textLayer.textAlign(p.CENTER, p.CENTER)

    // Set transparent fill and black stroke
    textLayer.fill(0, 0) // Transparent fill
    textLayer.stroke(0) // Black stroke
    textLayer.strokeWeight(config.strokeWeight * scaleFactor)

    // Use the text lines from config
    const lines = config.text

    // Calculate line height and vertical spacing
    const lineHeight = 167 * scaleFactor // Use 167pts line height as specified
    const totalHeight = lineHeight * lines.length
    const startY = (p.height - totalHeight) / 2 + lineHeight / 2

    // Draw each line of text
    lines.forEach((line, index) => {
      const yPos = startY + index * lineHeight
      textLayer.text(line, p.width / 2, yPos)
    })
  }

  // Draw function runs continuously
  p.draw = () => {
    // Ensure white background is maintained
    p.background(255)

    // Display the drawing buffer first
    if (drawingBuffer) {
      p.image(drawingBuffer, 0, 0)
    }

    // Display the text layer on top so the black stroke remains visible
    if (textLayer) {
      p.image(textLayer, 0, 0)
    }

    // Draw a line when mouse is pressed
    if (p.mouseIsPressed && drawingBuffer) {
      // If this is the start of a new drag, change the color
      if (!isDragging) {
        // Use the next color that was shown in the indicator
        currentColor = nextColor
        // Generate a new next color for after this drag
        nextColor = getRandomColor()
        // Set the stroke color for the drawing buffer
        drawingBuffer.stroke(currentColor)
        updateColorIndicator(currentColor)
        isDragging = true
      }

      // Draw a smoother line to the drawing buffer
      drawSmoothLine(drawingBuffer, p.pmouseX, p.pmouseY, p.mouseX, p.mouseY)
    } else {
      // When mouse is released, show the next color in the indicator
      if (isDragging) {
        updateColorIndicator(nextColor)
      }
      // Reset dragging state when mouse is released
      isDragging = false
    }
  }

  // Handle window resize
  p.windowResized = () => {
    // Clear the p5-container to remove any old canvases
    const container = document.getElementById('p5-container')
    if (container) {
      // Remove all child elements except the current canvas
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }

    // Calculate new dimensions with 4:3 aspect ratio
    const dimensions = calculateCanvasDimensions(window.innerWidth, window.innerHeight);
    p.resizeCanvas(dimensions.width, dimensions.height)

    // Redraw the white background
    p.background(255)

    // Create a temporary copy of the drawing buffer content
    let tempDrawingBuffer = null
    if (drawingBuffer) {
      tempDrawingBuffer = p.createImage(drawingBuffer.width, drawingBuffer.height)
      tempDrawingBuffer.copy(drawingBuffer, 0, 0, drawingBuffer.width, drawingBuffer.height, 0, 0, drawingBuffer.width, drawingBuffer.height)
    }

    // Recreate the drawing buffer with new dimensions
    drawingBuffer = p.createGraphics(p.width, p.height)
    drawingBuffer.pixelDensity(2)
    drawingBuffer.smooth()
    drawingBuffer.blendMode(p.MULTIPLY)
    drawingBuffer.stroke(currentColor)
    drawingBuffer.strokeWeight(config.brushSize)

    // Copy the content back if we had a previous buffer
    if (tempDrawingBuffer) {
      drawingBuffer.image(tempDrawingBuffer, 0, 0, p.width, p.height)
    }

    // Recreate the text layer with new dimensions
    createTextLayer()

    // Re-append the canvas to the container
    const canvas = document.querySelector('canvas')
    if (canvas && container) {
      container.appendChild(canvas)
    }
  }

  // Add key press functionality to clear the canvas or save the result
  p.keyPressed = () => {
    // Clear canvas when 'c' is pressed
    if (p.key === 'c' || p.key === 'C') {
      // Reset to white background
      p.background(255)
      // Clear the drawing buffer
      if (drawingBuffer) {
        drawingBuffer.clear()
      }
    }
    // Save canvas when 's' is pressed
    else if (p.key === 's' || p.key === 'S') {
      p.save('dearworldleaders_drawing.png')
    }
  }
}

// ASCII art console message
console.log(`
  _____                 _                       _   _             _  __                       _____      _     
 |  __ \\               | |                     | | | |           | |/ /                      / ____|    | |    
 | |  | | _____   _____| | ___  _ __   ___  __| | | |__  _   _  | ' / ___  _ __ __ _ _   _  \\___ \\___ | |___ 
 | |  | |/ _ \\ \\ / / _ \\ |/ _ \\| '_ \\ / _ \\/ _\` | | '_ \\| | | | |  < / _ \\| '__/ _\` | | | |  ___) \\ \\| / __|
 | |__| |  __/\\ V /  __/ | (_) | |_) |  __/ (_| | | |_) | |_| | | . \\ (_) | | | (_| | |_| | |____/ > | \\__ \\
 |_____/ \\___| \\_/ \\___|_|\\___/| .__/ \\___|\\__,_| |_.__/ \\__, | |_|\\_\\___/|_|  \\__,_|\\__, | |_____/_/|_|___/
                               | |                        __/ |                       __/ |                  
                               |_|                       |___/                       |___/                   
`);

// Initialize p5 sketch
new p5(sketch)
