import Link from 'next/link';
import Image from 'next/image';
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>MS Club | EmotionEssence</title>
        <meta name="description" content="See What Your Emotions Reveal. AI-powered emotion detection" />
        <meta property="og:image" key="ogImage" content="https://msclubsliit.org/assets/ms_club_logo_light.png" />
        <link rel="icon" href="https://msclubsliit.org/favicon.ico" />
      </Head>
      <div className={styles.backgroundAnimation}></div>
      <div className={styles.floatingEmojis}>
        <span className={styles.emoji} style={{ top: '10%', left: '5%' }}>😊</span>
        <span className={styles.emoji} style={{ top: '15%', right: '8%' }}>😍</span>
        <span className={styles.emoji} style={{ top: '30%', left: '12%' }}>🤔</span>
        <span className={styles.emoji} style={{ top: '25%', right: '15%' }}>😮</span>
        <span className={styles.emoji} style={{ top: '60%', left: '8%' }}>😌</span>
        <span className={styles.emoji} style={{ top: '70%', right: '10%' }}>🥳</span>
        <span className={styles.emoji} style={{ top: '85%', left: '15%' }}>😎</span>
        <span className={styles.emoji} style={{ top: '80%', right: '5%' }}>🤩</span>
      </div>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <span className={styles.cornerEmoji}>🧠</span>
          <Image
            className={styles.logo}
            src="https://msclubsliit.org/assets/ms_club_logo_light.png"
            alt="MS Club Logo"
            width={340}
            height={170}
          />
          <span className={styles.cornerEmoji}>💡</span>
        </div>

        <main className={styles.main}>
          <div className={styles.titleSection}
            style={{
              transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
            }}>
            <h1 className={styles.title}>
              <span className={styles.emotiPrefix}>Emotion</span>
              <span className={styles.essenceSuffix}>Essence</span>
              <span className={styles.titleEmoji}>✨</span>
            </h1>
            <div className={styles.aiElements}>
              <div className={styles.aiIcon}></div>
              <span>AI-powered emotion detection</span>
              <span className={styles.aiEmoji}>🤖</span>
            </div>
          </div>

          <h2 className={styles.tagline}>
            <span className={styles.taglineEmoji}></span>
            See What Your Emotions Reveal
            <span className={styles.taglineEmoji}></span>
          </h2>

          <div className={styles.emojiRow}>
            <span>😀</span><span>😢</span><span>😡</span><span>😲</span><span>😐</span>
          </div>

          <div className={styles.buttonContainer}>
            <Link href="/emotion">
              <a className={styles.tryNowButton}>
                Try Now
                <span className={styles.buttonIcon}>→</span>
              </a>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
