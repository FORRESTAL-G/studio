"use client";

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, PhoneOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/contexts/i18n-provider';
import { cn } from '@/lib/utils';

interface VoiceCallUiProps {
  onClose: () => void;
}

const PulsingAvatar = ({ name, src, delay }: { name: string; src?: string; delay?: string }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className={cn("h-20 w-20 ring-4 ring-primary/50 ring-offset-2 ring-offset-background animate-pulse", delay)}>
        {src ? <AvatarImage src={src} alt={name} /> : <AvatarFallback>{name.substring(0,1)}</AvatarFallback>}
      </Avatar>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};


export function VoiceCallUi({ onClose }: VoiceCallUiProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-card">
        <CardHeader>
          <CardTitle className="text-center text-primary">{t('voiceCallActive')}</CardTitle>
          <p className="text-center text-muted-foreground text-lg font-mono">{formatDuration(callDuration)}</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
          <div className="flex justify-around w-full">
            <PulsingAvatar name={t('user')} src="https://placehold.co/100x100.png?text=U" data-ai-hint="person" />
            <PulsingAvatar name={t('ai')} src="https://placehold.co/100x100.png?text=AI" data-ai-hint="robot" delay="animate-pulse-delay-500" />
          </div>
          
          <div className="flex gap-4 mt-4">
            <Button
              variant={isMuted ? "secondary" : "outline"}
              size="lg"
              className="rounded-full p-4"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? t('unmute') : t('mute')}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full p-4"
              onClick={onClose}
              aria-label={t('endCall')}
            >
              <PhoneOff size={24} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add this to your globals.css or a style tag if not already present
// @tailwind base;
// @tailwind components;
// @tailwind utilities;
//
// @layer utilities {
//   .animate-pulse-delay-500 {
//     animation-delay: 0.5s;
//   }
// }
// This has been added as a comment because globals.css cannot be modified in the same change block.
// The animation-delay utility can be added to tailwind.config.ts if needed.
// For now, the animation will work without delay variance.
