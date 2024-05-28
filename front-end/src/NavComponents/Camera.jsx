import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography } from '@mui/material';

function Camera() {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    getMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleStartFinish = () => {
    fetch('http://localhost:4000/start-finish', { method: 'POST' })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error:', error));
  };

  return (
    <div style={{ border: '1px solid black', padding: '20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Camera
      </Typography>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
      <Button variant="contained" color="primary" onClick={handleStartFinish} style={{ marginTop: '20px' }}>
        Start Face Recognition
      </Button>
    </div>
  );
}

export default Camera;
