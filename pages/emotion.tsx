// Home.tsx component with external expression display
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import styles from "../styles/Emotion.module.css";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Loader from "../components/Loader";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentExpression, setCurrentExpression] = useState<string>("");
  
  const loadModels = async () => {
    const MODEL_URL = `/models`;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.load(MODEL_URL),
      faceapi.nets.faceExpressionNet.load(MODEL_URL),
    ]);
  };
  
  const handleLoadWaiting = async () => {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (webcamRef.current?.video?.readyState == 4) {
          resolve(true);
          clearInterval(timer);
        }
      }, 500);
    });
  };
  
  const faceDetectHandler = async () => {
    await loadModels();
    await handleLoadWaiting();
    if (webcamRef.current && canvasRef.current) {
      setIsLoaded(true);
      const webcam = webcamRef.current.video as HTMLVideoElement;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      
      const video = webcamRef.current.video;
      
      (async function draw() {
        const detectionsWithExpressions = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        
        // Clear the canvas completely - we won't draw anything on it
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (detectionsWithExpressions.length > 0) {
          // Just get the dominant expression from the first face detected
          const detection = detectionsWithExpressions[0];
          const expressionsArray = Object.entries(detection.expressions);
          const scoresArray = expressionsArray.map((i) => i[1]);
          const expressionNames = expressionsArray.map((i) => i[0]);
          const max = Math.max.apply(null, scoresArray);
          const expressionIndex = scoresArray.findIndex((score) => score === max);
          const expression = expressionNames[expressionIndex];
          
          // Format the expression name (capitalize first letter)
          const formattedExpression = expression.charAt(0).toUpperCase() + expression.slice(1);
          
          // Update state with the current expression
          setCurrentExpression(formattedExpression);
        }
        
        requestAnimationFrame(draw);
      })();
    }
  };
  
  useEffect(() => {
    faceDetectHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Face2Emoji</title>
          <meta name="description" content="Display emotion from facial expressions" />
          <meta property="og:image" key="ogImage" content="/emojis/happy.png" />
          <link rel="icon" href="/emojis/happy.png" />
        </Head>
        <header className={styles.header}>
          <h1 className={styles.title}>Face2Emoji</h1>
        </header>
        
        {/* Expression display outside the camera */}
        {currentExpression && (
          <div className={styles.expressionContainer}>
            <div className={styles.expressionBox}>
              <img 
                src={`/emojis/${currentExpression.toLowerCase()}.png`} 
                alt={currentExpression}
                className={styles.expressionEmoji}
              />
              <span className={styles.expressionText}>{currentExpression}</span>
            </div>
          </div>
        )}
        
        <main className={styles.main}>
          <Webcam 
            audio={false} 
            ref={webcamRef} 
            className={styles.video}
            mirrored={true}
          />
          <canvas 
            ref={canvasRef} 
            className={styles.video} 
            style={{ display: 'none' }} // Hide the canvas as we're not using it for display
          />
        </main>
      </div>
      {!isLoaded && <Loader />}
    </>
  );
}