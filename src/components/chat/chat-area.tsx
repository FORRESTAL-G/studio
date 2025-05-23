"use client";

import React, { useEffect, useRef } from 'react';
import { MessageItem } from "@/components/chat/message-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types";
import { useTranslation } from '@/contexts/i18n-provider';

interface ChatAreaProps {
  messages: Message[];
  isAiTyping: boolean;
}

export function ChatArea({ messages, isAiTyping }: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isAiTyping]);

  return (
    <ScrollArea className="flex-grow p-4 bg-background" ref={scrollAreaRef}>
      <div className="max-w-3xl mx-auto space-y-1">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {isAiTyping && (
          <div className="flex justify-start items-end gap-2 my-2">
             <div className="h-8 w-8"></div> {/* Spacer for avatar */}
            <div className="bg-card text-card-foreground p-3 rounded-xl rounded-bl-none shadow-md">
              <p className="text-sm italic">{t('aiTyping')}</p>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
