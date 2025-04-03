// drawEmoji.ts - Renamed but keeping the same filename for compatibility
import {
  WithFaceExpressions,
  FaceDetection,
  FaceExpressions,
} from "face-api.js";

export const drawEmoji = async (
  detectionsWithExpressions: WithFaceExpressions<{
    detection: FaceDetection;
    expressions: FaceExpressions;
  }>[],
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext("2d");
  
  // Clear the entire canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Get dominant expression across all faces
  if (detectionsWithExpressions.length > 0) {
    // Process each detected face
    detectionsWithExpressions.forEach((detection, index) => {
      const expressionsArray = Object.entries(detection.expressions);
      const scoresArray = expressionsArray.map((i) => i[1]);
      const expressionNames = expressionsArray.map((i) => i[0]);
      const max = Math.max.apply(null, scoresArray);
      const expressionIndex = scoresArray.findIndex((score) => score === max);
      const expression = expressionNames[expressionIndex];
      
      // Only display the expression and emoji at the top (no face covering)
      displayExpressionAtTop(ctx, expression, index, canvas.width, detectionsWithExpressions.length);
    });
  }
};

// Function to display the expression name and a mini emoji at the top of the frame
const displayExpressionAtTop = (
  ctx: CanvasRenderingContext2D, 
  expression: string, 
  index: number, 
  canvasWidth: number,
  totalFaces: number
) => {
  // Create a small emoji image
  const miniEmoji = document.createElement("img");
  
  miniEmoji.onload = () => {
    // Save the current context state to restore later
    ctx.save();
    
    // Set text styling
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    
    // Calculate position (evenly distribute across the top if multiple faces)
    const segmentWidth = canvasWidth / (totalFaces + 1);
    const x = segmentWidth * (index + 1);
    const y = 50; // Top margin
    
    // Format the expression name (capitalize first letter)
    const formattedExpression = expression.charAt(0).toUpperCase() + expression.slice(1);
    
    // Draw text background for better visibility
    const textWidth = ctx.measureText(formattedExpression).width;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x - textWidth/2 - 35, y - 25, textWidth + 70, 40);
    
    // Draw mini emoji
    ctx.drawImage(miniEmoji, x - textWidth/2 - 30, y - 22, 30, 30);
    
    // Draw text
    ctx.fillStyle = "#ffffff";
    ctx.fillText(formattedExpression, x, y);
    
    // Restore the context state
    ctx.restore();
  };
  
  miniEmoji.src = `/emojis/${expression}.png`;
};