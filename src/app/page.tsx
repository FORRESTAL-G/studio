
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChatArea } from '@/components/chat/chat-area';
import { VoiceCallUi } from '@/components/call/voice-call-ui';
import type { Message } from '@/types';
import { getAudioTranscription } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export default function GiUxAlpha2Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Default to online
  // isSending is now primarily for text messages or other async operations
  const [isSending, setIsSending] = useState(false); 
  const { toast } = useToast();

  // Effect for online/offline status (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...message, id: uuidv4(), timestamp: Date.now() }]);
  };
  
  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
  };


  const simulateAiResponse = (userMessageText?: string) => {
    setIsAiTyping(true);
    // Simulate setting isSending for text messages if the AI response is the async part
    setIsSending(true); 
    setTimeout(() => {
      let aiResponseText = "I've received your message.";
      if (userMessageText?.toLowerCase().includes("hello") || userMessageText?.toLowerCase().includes("ciao")) {
        aiResponseText = "Hello there! How can I help you today?";
      } else if (userMessageText?.toLowerCase().includes("help")) {
        aiResponseText = "Sure, I can try to help. What do you need assistance with?";
      }
      addMessage({ sender: 'ai', text: aiResponseText, status: 'sent' });
      setIsAiTyping(false);
      setIsSending(false); // Reset isSending after AI response for text
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = (text: string) => {
    if (!isOnline) {
      toast({ title: "Offline", description: "Cannot send messages while offline.", variant: "destructive" });
      return;
    }
    const userMessageId = uuidv4();
    // Assuming sending text itself is quick, but AI response is async
    addMessage({ id: userMessageId, text, sender: 'user', timestamp: Date.now(), status: 'sent' });
    simulateAiResponse(text);
  };

  const handleSendAudio = (audioBlob: Blob, duration: number) => {
    if (!isOnline) {
      toast({ title: "Offline", description: "Cannot send audio while offline.", variant: "destructive" });
      return;
    }
    
    // Feature is disabled, just show a toast.
    toast({ 
      title: "Feature Disabled", 
      description: "Sending and transcribing audio messages is currently disabled."
    });
    // No message added to chat, no call to backend, no setIsSending.
  };

  const handleToggleCall = () => {
    if (!isOnline && !isCallActive) {
       toast({ title: "Offline", description: "Cannot start calls while offline.", variant: "destructive" });
      return;
    }
    setIsCallActive(!isCallActive);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header isOnline={isOnline} />
      <main className="flex-grow flex flex-col overflow-hidden">
        <ChatArea messages={messages} isAiTyping={isAiTyping} />
      </main>
      <Footer
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        onToggleCall={handleToggleCall}
        isCallActive={isCallActive}
        isSending={isSending} // isSending will now reflect text sending state
      />
      {isCallActive && <VoiceCallUi onClose={() => setIsCallActive(false)} />}
    </div>
  );
}
