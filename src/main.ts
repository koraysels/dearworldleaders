import './style/style.css'
import p5 from 'p5'
import 'tippy.js/dist/tippy.css'

import config from './config/config'
import { getRandomColor, updateColorIndicator } from './utils/color-utils'
import { calculateCanvasDimensions } from './utils/canvas-utils'
import { loadDrawingFromLocalStorage } from './utils/storage-utils'
import { isMobileDevice } from './utils/device-utils'
import { Brush } from './components/brush/Brush'
import { Canvas } from './components/canvas/Canvas'
import { TextLayer } from './components/textLayer/TextLayer'
import { UI } from './components/ui/UI'

// Create a new p5 instance
const sketch = (p: p5) => {
  // Variable to store the current user color
  let currentColor = getRandomColor();
  let nextColor = getRandomColor();
  let isDragging = false;
  let isRandomColorMode = true;

  // Component instances
  let brush: Brush;
  let canvas: Canvas;
  let textLayer: TextLayer;
  let ui: UI;

  // Font
  let franxurterFont: p5.Font;

  // Preload function to load assets before setup
  p.preload = () => {
    // Preload the Franxurter font - use relative path to comply with CSP
    franxurterFont = p.loadFont('./Franxurter.otf');
  };

  // Setup function runs once at the beginning
  p.setup = () => {
    // Calculate canvas dimensions with 4:3 aspect ratio
    const dimensions = calculateCanvasDimensions(window.innerWidth, window.innerHeight);

    // Create canvas with 4:3 aspect ratio
    const p5Canvas = p.createCanvas(dimensions.width, dimensions.height);
    p5Canvas.parent('p5-container');

    // Set pixel density to 2 for better rendering on high-DPI displays
    p.pixelDensity(2);

    // Enable smoothing for better line quality
    p.smooth();

    // Set white background
    p.background(255);

    // Initialize components
    brush = new Brush();
    canvas = new Canvas(p);
    textLayer = new TextLayer(p, franxurterFont);

    // Initialize UI with color and blend mode selection callbacks
    ui = new UI(
      p, 
      canvas, 
      brush, 
      // Color selection callback
      (selectedColor: string) => {
        if (selectedColor === 'random') {
          // Enable random color mode
          isRandomColorMode = true;
          // Set a random color for the next stroke
          nextColor = getRandomColor();
          // Update the color indicator with a multicolor appearance
          const colorIndicator = document.getElementById('color-indicator');
          if (colorIndicator) {
            colorIndicator.style.background = 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)';
          }
        } else {
          // Disable random color mode
          isRandomColorMode = false;
          // Update the next color with the selected color
          nextColor = selectedColor;
          // Update the color indicator
          updateColorIndicator(nextColor);
        }
      },
      // Blend mode selection callback
      (selectedBlendMode: string) => {
        // Set the blend mode on the canvas
        canvas.setBlendMode(selectedBlendMode);
      }
    );

    // Create drawing buffer
    const drawingBuffer = canvas.createDrawingBuffer();

    // Set initial stroke color and weight
    // Parse the hex color and add the opacity value
    const r = parseInt(currentColor.slice(1, 3), 16);
    const g = parseInt(currentColor.slice(3, 5), 16);
    const b = parseInt(currentColor.slice(5, 7), 16);
    const a = config.brushOpacity * 255; // Convert 0-1 to 0-255 for p5.js

    p.stroke(r, g, b, a);
    // If on a mobile device, use half the brush size
    const brushSize = isMobileDevice() ? config.brushSize / 2 : config.brushSize;
    p.strokeWeight(brushSize);
    canvas.setStrokeColor(currentColor);
    canvas.setStrokeWeight(brushSize);

    // Create text layer
    textLayer.createTextLayer();

    // Update the color indicator with the multicolor wheel appearance for random mode
    const colorIndicator = document.getElementById('color-indicator');
    if (colorIndicator) {
      colorIndicator.style.background = 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)';
    }

    // Check if there's a saved drawing in localStorage and load it
    const drawingLoaded = loadDrawingFromLocalStorage(p, drawingBuffer);
    if (drawingLoaded) {
      canvas.setHasSavedDrawing(true);
      ui.updateUIForSavedDrawing(true);
    }
  };

  // Draw function runs continuously
  p.draw = () => {
    // Ensure white background is maintained
    p.background(255);

    // Display the drawing buffer
    const drawingBuffer = canvas.getDrawingBuffer();
    if (drawingBuffer) {
      p.image(drawingBuffer, 0, 0);
    }

    // Display the text layer on top so the black stroke remains visible
    const textLayerGraphics = textLayer.getTextLayer();
    if (textLayerGraphics) {
      p.image(textLayerGraphics, 0, 0);
    }

    // Show preview dot when not drawing
    if (!isDragging && !p.mouseIsPressed && p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height) {
      // Parse the next color and add the opacity value
      const r = parseInt(nextColor.slice(1, 3), 16);
      const g = parseInt(nextColor.slice(3, 5), 16);
      const b = parseInt(nextColor.slice(5, 7), 16);
      const a = config.brushOpacity * 255; // Convert 0-1 to 0-255 for p5.js

      // Save current drawing settings
      p.push();

      // Set the fill color to match the next brush stroke
      p.fill(r, g, b, a);
      p.noStroke();

      // Draw the preview dot
      const brushSize = isMobileDevice() ? config.brushSize / 2 : config.brushSize;
      p.ellipse(p.mouseX, p.mouseY, brushSize, brushSize);

      // Restore previous drawing settings
      p.pop();
    }

    // Draw a line when mouse is pressed
    if (p.mouseIsPressed && drawingBuffer) {
      // If this is the start of a new drag, change the color
      if (!isDragging) {
        // Use the next color that was shown in the indicator
        currentColor = nextColor;
        // Set the stroke color for the drawing buffer
        canvas.setStrokeColor(currentColor);
        isDragging = true;
      }

      // Draw using spring-based brush technique
      brush.drawSpringBrush(drawingBuffer, p.mouseX, p.mouseY);

      // Mark that we have a drawing that should be saved
      canvas.setHasSavedDrawing(true);
    } else {
      // When mouse is released, show the next color in the indicator
      if (isDragging) {
        // If in random color mode, generate a new random color for the next stroke
        if (isRandomColorMode) {
          nextColor = getRandomColor();
          // Keep the color indicator with the multicolor appearance
          const colorIndicator = document.getElementById('color-indicator');
          if (colorIndicator) {
            colorIndicator.style.background = 'conic-gradient(red, orange, yellow, green, blue, indigo, violet, red)';
          }
        } else {
          // Otherwise, just update the color indicator with the next color
          updateColorIndicator(nextColor);
        }

        // Reset brush state when drawing stops
        brush.resetBrush();

        // Save the drawing to localStorage when the user stops drawing
        canvas.saveDrawing();
      }
      // Reset dragging state when mouse is released
      isDragging = false;
    }
  };

  // Handle window resize
  p.windowResized = () => {
    // Calculate new dimensions with 4:3 aspect ratio
    const dimensions = calculateCanvasDimensions(window.innerWidth, window.innerHeight);

    // Resize the canvas using p5's built-in method
    p.resizeCanvas(dimensions.width, dimensions.height);

    // Redraw the white background
    p.background(255);

    // Create a temporary copy of the drawing buffer content
    const tempDrawingBuffer = canvas.createTempDrawingBuffer();

    // Resize components
    canvas.resize(tempDrawingBuffer);
    textLayer.resize();

    // Reset brush
    brush.resetAll();
  };

  // Add key press functionality to clear the canvas or save the result
  p.keyPressed = () => {
    // Clear canvas when 'c' is pressed
    if (p.key === 'c' || p.key === 'C') {
      // Reset to white background
      p.background(255);
      // Clear the drawing buffer
      canvas.clearDrawingBuffer();
      // Reset brush
      brush.resetAll();
      // Reset dragging state
      isDragging = false;
      // Update UI
      ui.updateUIForSavedDrawing(false);
    }
    // Save canvas when 's' is pressed
    else if (p.key === 's' || p.key === 'S') {
      p.save('dearworldleaders_drawing.png');
    }
  };
};

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
