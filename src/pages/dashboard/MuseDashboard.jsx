import React, { useEffect, useState } from "react";
import styles from "./MuseDashboard.module.css";
import Lyrics from "../../components/Lyrics.jsx";
import MusicGenerator from "../../components/MusicGenerator.jsx";
import VideoGenerator from "../../components/VideoGenerator.jsx";

// Main MuseDashboard Component
export default function MuseDashboard() {
  const [workerResponse, setWorkerResponse] = useState(null);
  const [activeFeature, setActiveFeature] = useState("lyrics");

  useEffect(() => {
    // Hardcoded call to OrpheusWorker backend (Cloudflare deployment)
    // Replace the URL below with your actual deployed worker URL
    fetch("https://orpheus-worker.YOUR_SUBDOMAIN.workers.dev/api/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "chat",
        prompt: "Hello from MuseDashboard",
        system: "You are a helpful assistant."
      })
    })
      .then(async (res) => {
        // Try to parse as JSON, fallback to text
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        return res.text();
      })
      .then((data) => setWorkerResponse(data))
      .catch((err) => setWorkerResponse({ error: err.message }));
  }, []);

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "lyrics":
        return <Lyrics />;
      case "music":
        return <MusicGenerator />;
      case "video":
        return <VideoGenerator />;
      default:
        return <Lyrics />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Muse Dashboard</h1>
        <p className={styles.dashboardSubtitle}>Your creative hub for music, lyrics, and video</p>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.navigationTabs}>
        <button
          className={`${styles.navTab} ${activeFeature === "lyrics" ? styles.activeTab : ""}`}
          onClick={() => setActiveFeature("lyrics")}
        >
          <span className={styles.tabIcon}>🎵</span>
          Lyrics
        </button>
        <button
          className={`${styles.navTab} ${activeFeature === "music" ? styles.activeTab : ""}`}
          onClick={() => setActiveFeature("music")}
        >
          <span className={styles.tabIcon}>🎹</span>
          Music
        </button>
        <button
          className={`${styles.navTab} ${activeFeature === "video" ? styles.activeTab : ""}`}
          onClick={() => setActiveFeature("video")}
        >
          <span className={styles.tabIcon}>🎬</span>
          Video
        </button>
      </nav>

      {/* Worker Status */}
      <div className={styles.workerStatus}>
        <details className={styles.workerDetails}>
          <summary className={styles.workerSummary}>
            OrpheusWorker Status {workerResponse ? "✅" : "⏳"}
          </summary>
          <pre className={styles.workerResponse}>
            {workerResponse
              ? typeof workerResponse === "object"
                ? JSON.stringify(workerResponse, null, 2)
                : workerResponse
              : "Loading..."}
          </pre>
        </details>
      </div>

      {/* Active Feature */}
      <main className={styles.featureContainer}>
        {renderActiveFeature()}
      </main>
    </div>
  );
}