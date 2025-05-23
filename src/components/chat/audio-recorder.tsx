"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/i18n-provider';
import { Progress } from '@/components/ui/progress';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

const MAX_RECORDING_TIME_MS = 60000; // 1 minute
const RECORDING_PROGRESS_INTERVAL_MS = 100;

export function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;
    try {
      // Check permission status first, if available
      if (navigator.permissions && typeof navigator.permissions.query === 'function') {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'granted') {
          setPermissionGranted(true);
          return true;
        }
        if (permissionStatus.state === 'denied') {
          setPermissionGranted(false);
          return false;
        }
      }
      // If prompt or not determined, request permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      return true;
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setPermissionGranted(false);
      return false;
    }
  };

  const startRecording = async () => {
    if (!isSupported) return;
    
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Common format
        const duration = recordingStartTimeRef.current ? (Date.now() - recordingStartTimeRef.current) / 1000 : 0;
        onRecordingComplete(audioBlob, duration);
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();
      setRecordingTime(0);
      
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = Date.now() - recordingStartTimeRef.current;
          setRecordingTime(elapsed);
          if (elapsed >= MAX_RECORDING_TIME_MS) {
            stopRecording();
          }
        }
      }, RECORDING_PROGRESS_INTERVAL_MS);

    } catch (err) {
      console.error("Error starting recording:", err);
      setPermissionGranted(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);
    }
  };

  const recordingProgress = Math.min((recordingTime / MAX_RECORDING_TIME_MS) * 100, 100);
  const recordingTimeSeconds = Math.floor(recordingTime / 1000);

  if (!isSupported) {
    return (
      <Button variant="outline" size="icon" disabled>
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </Button>
    );
  }
  
  if (permissionGranted === false) {
     return (
      <Button variant="outline" size="icon" onClick={requestPermission} aria-label="Microphone permission denied. Click to retry.">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </Button>
    );
  }


  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || (permissionGranted === null && !isRecording)} /* Disable if permission not yet checked */
        aria-label={isRecording ? t('stopRecording') : t('startRecording')}
      >
        {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      {isRecording && (
        <div className="w-full flex items-center gap-2">
          <Progress value={recordingProgress} className="h-1.5 flex-grow" />
          <span className="text-xs text-muted-foreground">{recordingTimeSeconds}s</span>
        </div>
      )}
    </div>
  );
}
