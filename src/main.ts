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
  ]
}

// Function to adjust SVG text to fit the screen
function adjustSvgText() {
  const svgContainer = document.getElementById('svg-container') as SVGSVGElement
  const mainText = document.getElementById('main-text') as SVGTextElement
  const textContainer = document.getElementById('text-container')

  if (!svgContainer || !mainText || !textContainer) return

  // Get container dimensions
  const containerWidth = textContainer.clientWidth

  // Adjust font size based on container width
  const fontSize = Math.max(containerWidth * 0.08, 40) // Responsive font size with minimum of 40px
  mainText.setAttribute('font-size', fontSize.toString())

  // Adjust stroke width based on font size
  const strokeWidth = fontSize / 50
  mainText.setAttribute('stroke-width', strokeWidth.toString())
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

// Create a new p5 instance
const sketch = (p: p5) => {
  // Variable to store the current user color
  let currentColor = getRandomColor()
  let nextColor = getRandomColor()
  let isDragging = false

  // Setup function runs once at the beginning
  p.setup = () => {
    // Create canvas that fills the p5-container
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('p5-container')

    // Set background to transparent
    p.clear()

    // Set initial stroke color and weight
    p.stroke(currentColor)
    p.strokeWeight(4)

    // Update the color indicator with the initial color
    updateColorIndicator(currentColor)

    // Display the current and next color to the user
    console.log('Your current color is:', currentColor)
    console.log('Your next color will be:', nextColor)

    // Ensure SVG text is properly sized
    adjustSvgText()
  }

  // Draw function runs continuously
  p.draw = () => {
    // Draw a line when mouse is pressed
    if (p.mouseIsPressed) {
      // If this is the start of a new drag, change the color
      if (!isDragging) {
        // Use the next color that was shown in the indicator
        currentColor = nextColor
        // Generate a new next color for after this drag
        nextColor = getRandomColor()
        p.stroke(currentColor)
        updateColorIndicator(currentColor)
        isDragging = true
        console.log('Current color:', currentColor)
        console.log('Next color will be:', nextColor)
      }

      p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY)
    } else {
      // When mouse is released, show the next color in the indicator
      if (isDragging) {
        updateColorIndicator(nextColor)
        console.log('Next color:', nextColor)
      }
      // Reset dragging state when mouse is released
      isDragging = false
    }
  }

  // Handle window resize
  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight)
    adjustSvgText()
  }

  // Add key press functionality to clear the canvas
  p.keyPressed = () => {
    // Clear canvas when 'c' is pressed
    if (p.key === 'c' || p.key === 'C') {
      p.clear()
    }
  }
}

// Initialize p5 sketch
new p5(sketch)

// Call adjustSvgText when the page loads
window.addEventListener('load', adjustSvgText)

// Call adjustSvgText when the window is resized
window.addEventListener('resize', adjustSvgText)
