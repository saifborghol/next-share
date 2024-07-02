import { useRef, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import logger from "../lib/logger";

export default function Home() {
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef(null);
  const [screenshot, setScreenshot] = useState(null);

  const captureScreenshot = async () => {
    if (navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: "monitor",
          },
          audio: {
            suppressLocalAudioPlayback: false,
          },
          preferCurrentTab: false,
          selfBrowserSurface: "exclude",
          systemAudio: "include",
          surfaceSwitching: "include",
          monitorTypeSurfaces: "include",
        });

        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const bitmap = await imageCapture.grabFrame();

        if (canvasRef.current) {
          canvasRef.current.width = bitmap.width;
          canvasRef.current.height = bitmap.height;
          const context = canvasRef.current.getContext("2d");

          if (context) {
            context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
            const image = canvasRef.current.toDataURL("image/png");
            setScreenshot(image);
            stopUserMedia(stream);
          }
        }
      } catch (err) {
        logger.error(err);
        setErrorMessage("Error getting screenshot. Please allow screen access in your browser settings.");
      }
    } else {
      setErrorMessage("navigator.mediaDevices not available in this browser");
    }
  };

  const stopUserMedia = (stream) => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Share Your Screenshot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.content}>
        <h1 className={styles.title}>Select your preferred screen!</h1>
        <button className={styles.card} onClick={captureScreenshot}>
          <p>Allow the browser to access screenshot</p>
        </button>
      </main>
      <div className="image-container">
        {screenshot && (
          <img
            src={screenshot}
            alt="Screenshot"
            className={styles.screenshotStyle}
          />
        )}
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
      <footer className={styles.footer}>
        <a
          href="https://www.officent.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img
            src="/officent_IT_logo.png"
            alt="Officent"
            className={styles.logo}
          />
        </a>
      </footer>
    </div>
  );
}
