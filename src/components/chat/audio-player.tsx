"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/contexts/i18n-provider';

interface AudioPlayerProps {
  audioUrl: string;
  audioDuration?: number; // Optional: if known, can display duration
}

export function AudioPlayer({ audioUrl, audioDuration: knownDuration }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(knownDuration || 0);
  const { t } = useTranslation();

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      } else {
        setProgress(0); // Reset progress if duration is not valid
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      // Optionally, reset to beginning: audio.currentTime = 0;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Set initial duration if provided and valid
    if (knownDuration && !isNaN(knownDuration) && isFinite(knownDuration)) {
        setDuration(knownDuration);
    }


    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [knownDuration]);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      setIsPlaying(true);
    }
  };


  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 w-full max-w-xs">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <Button variant="ghost" size="icon" onClick={togglePlayPause} aria-label={isPlaying ? t('pauseAudio') : t('playAudio')}>
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </Button>
       <Button variant="ghost" size="icon" onClick={handleRestart} aria-label="Restart Audio">
        <RefreshCw size={18} />
      </Button>
      <div className="flex-grow flex flex-col gap-1">
        <Progress value={progress} className="w-full h-2" />
        <div className="text-xs text-muted-foreground text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}
