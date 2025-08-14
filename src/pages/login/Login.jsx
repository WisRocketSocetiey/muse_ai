import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

// Video assets (adjust paths if needed)
import classical from '../../assets/classical.mp4';
import hiphop from '../../assets/hip-hop.mp4';
import jazz from '../../assets/jazz.mp4';
import rock from '../../assets/rock.mp4';
import sultryPop from '../../assets/sultry-pop.mp4';
import youngStudio from '../../assets/young-studio.mp4';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // All candidate videos
  const videos = useMemo(
    () => [
      { id: 'classical', label: 'Classical', src: classical },
      { id: 'jazz', label: 'Jazz', src: jazz },
      { id: 'rock', label: 'Rock', src: rock },
      { id: 'hiphop', label: 'Hip-Hop', src: hiphop },
      { id: 'sultry', label: 'Sultry Pop', src: sultryPop },
      { id: 'studio', label: 'Young Studio', src: youngStudio },
    ],
    []
  );

  // Start on a random background
  const [activeId, setActiveId] = useState(() => {
    const rand = Math.floor(Math.random() * videos.length);
    return videos[rand].id;
  });

  const active = useMemo(
    () => videos.find(v => v.id === activeId) ?? videos[0],
    [activeId, videos]
  );

  const bgVideoRef = useRef(null);

  // Make sure autoplay resumes whenever the src changes
  useEffect(() => {
    if (bgVideoRef.current) {
      const v = bgVideoRef.current;
      const play = async () => {
        try { await v.play(); } catch (_) {}
      };
      v.load();
      play();
    }
  }, [activeId]);

  // Rotate to a different random video every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveId(prevId => {
        let nextId = prevId;
        while (nextId === prevId) {
          nextId = videos[Math.floor(Math.random() * videos.length)].id;
        }
        return nextId;
      });
    }, 8000); // adjust duration if you want

    return () => clearInterval(interval);
  }, [videos]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate auth
      await new Promise(res => setTimeout(res, 900));
      setUser?.({ id: 1, name: 'John Doe', email });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Hook up OAuth
    console.log('Google login clicked');
  };

  return (
    <div className={styles.container}>
      {/* Background video */}
      <video
        key={active.src}
        ref={bgVideoRef}
        className={`${styles.bgVideo} ${styles.bgSoftFocus}`}
        src={active.src}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={styles.bgOverlay} />
      <div className={styles.vignette} />

      {/* Centered content */}
      <div className={styles.layout}>
        <div className={styles.loginCardWrapper}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <h1 className={styles.title}>Welcome back</h1>
              <span className={styles.brand}>MUSE • AI</span>
            </div>

            <form onSubmit={handleLogin} className={styles.form}>
              <div>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`${styles.input} ${styles.inputGlow}`}
                  placeholder="you@domain.com"
                />
              </div>

              <div>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className={`${styles.input} ${styles.inputGlow}`}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? 'Logging in…' : 'Login'}
              </button>
            </form>

            <div className={styles.orText}>or</div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={styles.googleButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 48 48"
                style={{ marginRight: 8 }}
              >
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 16.4 18.8 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.4l-6.3-5.2C29.2 34.8 26.7 36 24 36c-5.2 0-9.7-3.6-11.3-8.5l-6.6 5.1C8.7 39.7 15.8 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3C34.8 32.4 30.3 36 24 36v8c11.1 0 20-8.9 20-20 0-1.3-.1-2.5-.4-3.5z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
