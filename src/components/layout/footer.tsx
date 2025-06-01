
"use client";

import React, { useState } from 'react';
import { ArrowUp, Phone, PhoneOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Changed from Input
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

  const handleSendText = () => { // Removed e?: React.FormEvent
    // e?.preventDefault(); // Removed
    if (messageText.trim() && !isSending) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  return (
    <footer className="sticky bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 sm:p-4">
      <div className="container mx-auto">
        {/* Removed onSubmit from form */}
        <form className="flex items-end w-full">
          <div className="flex-shrink-0 mr-2 sm:mr-3">
            <AudioRecorder onRecordingComplete={onSendAudio} disabled={isSending} />
          </div>
          <Textarea // Changed from Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={t('messageInputPlaceholder')}
            className="flex-grow h-12 min-h-[48px] resize-none mr-2 sm:mr-3"
            disabled={isSending}
            autoComplete="off"
            // Pressing Enter in Textarea will now default to newline
            // and not submit the form because the button is not type="submit"
            // and form has no onSubmit related to Enter key.
          />
          <Button
            type="button" // Changed from "submit"
            onClick={handleSendText} // Added onClick handler
            className="h-12 w-12 p-0 flex items-center justify-center rounded-full flex-shrink-0"
            disabled={!messageText.trim() || isSending}
            aria-label={t('sendMessage')}
          >
            {isSending && !messageText.trim() ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ArrowUp className="h-6 w-6" />
            )}
          </Button>
          
          <div className="flex-grow flex items-center justify-end pl-2 sm:pl-3">
            <Button
              variant={isCallActive ? "destructive" : "primary"}
              className="h-12 w-12 p-0 rounded-full flex items-center justify-center flex-shrink-0"
              onClick={onToggleCall}
              aria-label={isCallActive ? t('endCall') : t('startCall')}
            >
              {isCallActive ? (
                <PhoneOff className="h-6 w-6" />
              ) : (
                <Phone className="h-6 w-6" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </footer>
  );
}
