import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Head from "next/head";
import styles from "../styles/Emotion.module.css";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

export default function Emotion() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentExpression, setCurrentExpression] = useState("");
  
  // Generate random positions for floating emojis
  const floatingEmojis = [
    { emoji: "😊", top: "10%", left: "5%" },
    { emoji: "😍", top: "15%", right: "8%" },
    { emoji: "🤔", top: "30%", left: "12%" },
    { emoji: "😌", top: "60%", left: "8%" },
    { emoji: "🥳", top: "70%", right: "10%" },
    { emoji: "😎", top: "85%", left: "15%" },
    { emoji: "🤩", top: "80%", right: "5%" },
    { emoji: "😂", top: "20%", left: "20%" },
    { emoji: "😱", top: "40%", right: "12%" },
    { emoji: "🙃", top: "90%", left: "8%" },
    { emoji: "🥰", top: "5%", right: "15%" }
  ];

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
      const webcam = webcamRef.current.video;
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
          <title>EmotionEssence | Camera</title>
          <meta name="description" content="AI-powered emotion detection" />
          <meta property="og:image" key="ogImage" content="/emojis/happy.png" />
          <link rel="icon" href="/emojis/happy.png" />
        </Head>
        
       

        {/* Floating emojis background */}
        <div className={styles.floatingEmojis}>
          {floatingEmojis.map((item, index) => (
            <span 
              key={index} 
              className={styles.floatingEmoji} 
              style={{ 
                top: item.top, 
                left: item.left, 
                right: item.right 
              }}
            >
              {item.emoji}
            </span>
          ))}
        </div>

        {/* Expression display outside the camera */}
        {currentExpression && (
          <div className={styles.expressionContainer}>
            <div className={styles.expressionBox}>
              <Image
                src={`/emojis/${currentExpression.toLowerCase()}.png`}
                alt={currentExpression}
                width={64}
                height={64}
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
          <div className={styles.buttonContainer}>
            <Link href="/">
              <a className={styles.backButton}>
              <span className={styles.buttonIcon}>←</span>
                Back to Home
                
              </a>
            </Link>
          </div>
        </main>

        
       
          
      </div>
      
      
      {!isLoaded && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
          <p className={styles.loaderText}>Loading emotion detection...</p>
        </div>
      )}
    </>
  );
}