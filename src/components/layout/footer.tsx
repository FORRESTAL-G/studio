"use client";

import React, { useState } from 'react';
import { Send, Phone, PhoneOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AudioRecorder } from '@/components/chat/audio-recorder';
import { useTranslation } from '@/contexts/i18n-provider';

interface FooterProps {
  onSendMessage: (text: string) => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  onToggleCall: () => void;
  isCallActive: boolean;
  isSending: boolean;
}

export function Footer({
  onSendMessage,
  onSendAudio,
  onToggleCall,
  isCallActive,
  isSending,
}: FooterProps) {
  const [messageText, setMessageText] = useState('');
  const { t } = useTranslation();

  const handleSendText = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (messageText.trim() && !isSending) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  return (
    <footer className="sticky bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 sm:p-4">
      <div className="container mx-auto">
        <form onSubmit={handleSendText} className="flex items-end gap-2 sm:gap-3">
          <AudioRecorder onRecordingComplete={onSendAudio} disabled={isSending} />
          <Input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={t('messageInputPlaceholder')}
            className="flex-grow min-h-[40px] resize-none"
            disabled={isSending}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!messageText.trim() || isSending} aria-label={t('sendMessage')}>
            {isSending && !messageText.trim() ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
          <Button
            variant={isCallActive ? "destructive" : "outline"}
            size="icon"
            onClick={onToggleCall}
            aria-label={isCallActive ? t('endCall') : t('startCall')}
          >
            {isCallActive ? <PhoneOff className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </footer>
  );
}
