import React, { useRef, useEffect } from 'react';

export default function FadingVideo({ src, className, style }) {
  const videoRef = useRef(null);
  const fadingOutRef = useRef(false);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const FADE_MS = 500;
    const FADE_OUT_LEAD = 0.55;

    const fadeTo = (targetOpacity) => {
      const video = videoRef.current;
      if (!video) return;

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      const startOpacity = parseFloat(video.style.opacity || 0);
      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / FADE_MS, 1);
        
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        if (videoRef.current) {
          videoRef.current.style.opacity = currentOpacity;
        }

        if (progress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const handleLoadedData = () => {
      const video = videoRef.current;
      if (!video) return;
      video.style.opacity = 0;
      video.play().catch(e => console.log('AutoPlay prevented:', e));
      fadeTo(1);
    };

    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (!video) return;

      const timeRemaining = video.duration - video.currentTime;
      if (!fadingOutRef.current && timeRemaining <= FADE_OUT_LEAD && timeRemaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const handleEnded = () => {
      const video = videoRef.current;
      if (!video) return;

      video.style.opacity = 0;
      setTimeout(() => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log('Play prevented on loop:', e));
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);
      
      if (video.readyState >= 2) {
        handleLoadedData();
      }
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (video) {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{ ...style, opacity: 0 }}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}
