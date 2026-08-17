import { useState, useCallback, useRef, useEffect } from 'react';

interface CameraState {
  stream: MediaStream | null;
  error: string | null;
  isStarting: boolean;
}

export const useCamera = () => {
  const [state, setState] = useState<CameraState>({
    stream: null,
    error: null,
    isStarting: false,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
      setState(prev => ({ ...prev, stream: null }));
    }
  }, [state.stream]);

  const startCamera = useCallback(async () => {
    setState(prev => ({ ...prev, isStarting: true, error: null }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }
        },
        audio: false
      });
      setState({ stream, error: null, isStarting: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
      }
    } catch (err: any) {
      let errorMsg = 'Failed to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera access is blocked. Please enable it in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera found on this device.';
      }
      setState({ stream: null, error: errorMsg, isStarting: false });
    }
  }, []);

  // Ensure stream is stopped when unmounting
  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [state.stream]);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current || !state.stream) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, [state.stream]);

  return { 
    ...state, 
    startCamera, 
    stopCamera, 
    capturePhoto, 
    videoRef 
  };
};
