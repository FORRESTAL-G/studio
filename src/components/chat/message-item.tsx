
"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from "@/components/ui/card";
import { AudioPlayer } from "@/components/chat/audio-player";
import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from '@/contexts/i18n-provider';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const { t } = useTranslation();
  const isUser = message.sender === 'user';

  const getStatusIcon = () => {
    if (message.status === 'pending' || message.status === 'transcribing') return <Clock className="h-3 w-3 text-muted-foreground" />;
    if (message.status === 'failed') return <AlertCircle className="h-3 w-3 text-destructive" />;
    if (message.status === 'sent') return <CheckCircle className="h-3 w-3 text-green-500" />;
    return null;
  };

  return (
    <div className={cn("flex items-end gap-2 my-2", isUser ? "justify-end" : "justify-start")}>
      <Card className={cn(
        "max-w-[75%] rounded-xl shadow-lg",
        isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none",
        !isUser && "ml-0",
        isUser && "mr-0"
      )}>
        <CardContent className="p-3">
          {message.text && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
          {message.audioUrl && (
            <div className="mt-1">
              <AudioPlayer audioUrl={message.audioUrl} audioDuration={message.audioDuration} />
            </div>
          )}
          {message.transcription && message.showTranscription && (
            <div className="mt-2 pt-2 border-t border-border/50">
              <p className="text-xs font-semibold">{t('transcription')}</p>
              <p className="text-xs italic opacity-80">{message.transcription}</p>
            </div>
          )}
          {message.status === 'transcribing' && !message.transcription && (
             <p className="text-xs italic opacity-80 mt-1">{t('aiTyping')}</p>
          )}
          <div className={cn("text-xs opacity-70 mt-1 flex items-center gap-1", isUser ? "justify-end" : "justify-start")}>
            {isUser && getStatusIcon()}
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
