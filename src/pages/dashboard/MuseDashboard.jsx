import React, { useState } from "react";
import { Music, FileText, Video } from "lucide-react";
import styles from "./MuseDashboard.module.css";
import Lyrics from "../../components/Lyrics.jsx";
import MusicGenerator from "../../components/MusicGenerator.jsx";
import VideoGenerator from "../../components/VideoGenerator.jsx";

// Main MuseDashboard Component
export default function MuseDashboard() {
  const [activeFeature, setActiveFeature] = useState("lyrics");

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
      {/* Navigation Tabs */}
      <nav className={styles.navigationTabs}>
        <button
          className={`${styles.navTab} ${activeFeature === "lyrics" ? styles.activeTab : ""}`}
          onClick={() => setActiveFeature("lyrics")}
        >
          <FileText size={20} className={styles.tabIcon} />
          Lyrics
        </button>
        <button
          className={`${styles.navTab} ${activeFeature === "music" ? styles.activeTab : ""}`}
          onClick={() => setActiveFeature("music")}
        >
          <Music size={20} className={styles.tabIcon} />
          Music
        </button>
        <button
          className={`${styles.navTab} ${activeFeature === "video" ? styles.activeTab : ""}`}
          onClick={() => setActiveFeature("video")}
        >
          <Video size={20} className={styles.tabIcon} />
          Video
        </button>
      </nav>

      {/* Active Feature */}
      <main className={styles.featureContainer}>
        {renderActiveFeature()}
      </main>
    </div>
  );
}