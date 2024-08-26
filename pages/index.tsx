import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);

  const testFileUrl = '/api/testfile';
  const fileSize = 1 * 1024 * 1024; // 1 MB test file size
  const testData = 'X'.repeat(1024 * 1024); // 1 MB of data for upload test

  async function measureDownloadSpeed(): Promise<number> {
    const startTime = Date.now();
    
    try {
      await axios.get(testFileUrl, { responseType: 'arraybuffer' });
      const endTime = Date.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = (fileSize / durationInSeconds / 1024 / 1024) * 8;
      
      return parseFloat(speedMbps.toFixed(2));
    } catch (error) {
      console.error('Error measuring download speed:', error);
      return 0;
    }
  }

  async function measureUploadSpeed(): Promise<number> {
    const startTime = Date.now();
    
    try {
      await axios.post(testFileUrl, testData);
      const endTime = Date.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = (testData.length / durationInSeconds / 1024 / 1024) * 8;
      
      return parseFloat(speedMbps.toFixed(2));
    } catch (error) {
      console.error('Error measuring upload speed:', error);
      return 0;
    }
  }

  async function runTest() {
    setTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);

    const downloadSpeed = await measureDownloadSpeed();
    setDownloadSpeed(downloadSpeed);

    const uploadSpeed = await measureUploadSpeed();
    setUploadSpeed(uploadSpeed);

    setTesting(false);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Network Speed Test</h1>
      <button onClick={runTest} disabled={testing} className={styles.button}>
        {testing ? 'Testing...' : 'Start Test'}
      </button>
      {downloadSpeed !== null && (
        <p className={styles.result}>Download speed: {downloadSpeed} Mbps</p>
      )}
      {uploadSpeed !== null && (
        <p className={styles.result}>Upload speed: {uploadSpeed} Mbps</p>
      )}
    </div>
  );
}
