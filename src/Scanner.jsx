import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function Scanner({ onScan, onClose }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState('');
  const scannerRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    // Initialize the QR code scanner
    const qrScanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 300, height: 300 }
      },
      false
    );

    qrScanner.render(
      (decodedText) => {
        // When QR code is scanned
        setScannedData(decodedText);
        onScan(decodedText);
        qrScanner.clear();
      },
      (error) => {
        console.log('Scanner error:', error);
      }
    );

    qrScannerRef.current = qrScanner;

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch((error) => {
          console.log('Error clearing scanner:', error);
        });
      }
    };
  }, [onScan]);

  const handleClose = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
    }
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Scan QR Code</h2>
          <button onClick={handleClose} style={styles.closeBtn}>✕</button>
        </div>
        
        <div style={styles.scannerContainer}>
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </div>

        {scannedData && (
          <div style={styles.result}>
            <p><strong>Scanned Data:</strong></p>
            <p style={styles.resultText}>{scannedData}</p>
          </div>
        )}

        <div style={styles.instructions}>
          <p>📱 Point your device camera at a QR code</p>
          <p>Allow camera access when prompted</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666'
  },
  scannerContainer: {
    marginBottom: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0'
  },
  result: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '15px'
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: '12px',
    backgroundColor: '#fff',
    padding: '8px',
    borderRadius: '4px',
    marginTop: '10px',
    wordBreak: 'break-all'
  },
  instructions: {
    backgroundColor: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: '4px',
    padding: '12px',
    fontSize: '13px',
    color: '#004085'
  }
};

export default Scanner;
