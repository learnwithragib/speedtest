import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

const TEST_DURATION = 10000; // 10 seconds
const UPDATE_INTERVAL = 100; // 100ms

export default function Home() {
  const [speed, setSpeed] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testing) {
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + (UPDATE_INTERVAL / TEST_DURATION) * 100, 100));
      }, UPDATE_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [testing]);

  async function runTest() {
    setTesting(true);
    setSpeed(null);
    setProgress(0);

    const servers = await axios.get('/api/servers');
    const testServers = servers.data.slice(0, 3); // Use top 3 servers

    let totalBytes = 0;
    const startTime = Date.now();

    while (Date.now() - startTime < TEST_DURATION) {
      await Promise.all(testServers.map(async (server: string) => {
        try {
          const response = await axios.get(`${server}/testfile`, { responseType: 'arraybuffer' });
          totalBytes += response.data.byteLength;
        } catch (error) {
          console.error('Error during speed test:', error);
        }
      }));
    }

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;
    const speedMbps = (totalBytes * 8) / (durationInSeconds * 1000000);

    setSpeed(parseFloat(speedMbps.toFixed(2)));
    setTesting(false);
    setProgress(100);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Network Speed Test</h1>
      {!testing && speed === null && (
        <button onClick={runTest} className={styles.button}>
          START
        </button>
      )}
      {testing && (
        <div className={styles.testing}>
          <div className={styles.spinner}></div>
          <p>Testing...</p>
        </div>
      )}
      {speed !== null && (
        <div className={styles.result}>
          <span className={styles.speed}>{speed}</span>
          <span className={styles.unit}>Mbps</span>
        </div>
      )}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}
