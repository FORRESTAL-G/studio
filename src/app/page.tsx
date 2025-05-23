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

// Ensure uuid is installed: npm install uuid @types/uuid
// For this exercise, we assume it's available or a similar utility is used.

export default function GiUxAlpha2Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Default to online
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
    setTimeout(() => {
      let aiResponseText = "I've received your message.";
      if (userMessageText?.toLowerCase().includes("hello") || userMessageText?.toLowerCase().includes("ciao")) {
        aiResponseText = "Hello there! How can I help you today?";
      } else if (userMessageText?.toLowerCase().includes("help")) {
        aiResponseText = "Sure, I can try to help. What do you need assistance with?";
      }
      addMessage({ sender: 'ai', text: aiResponseText, status: 'sent' });
      setIsAiTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = (text: string) => {
    if (!isOnline) {
      toast({ title: "Offline", description: "Cannot send messages while offline.", variant: "destructive" });
      return;
    }
    const userMessageId = uuidv4();
    setMessages(prev => [...prev, { id: userMessageId, text, sender: 'user', timestamp: Date.now(), status: 'sent' }]);
    simulateAiResponse(text);
  };

  const handleSendAudio = async (audioBlob: Blob, duration: number) => {
    if (!isOnline) {
      toast({ title: "Offline", description: "Cannot send audio while offline.", variant: "destructive" });
      return;
    }
    
    setIsSending(true);
    const userMessageId = uuidv4();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Convert Blob to Data URI for AI
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const audioDataUri = reader.result as string;
      
      setMessages(prev => [...prev, { 
        id: userMessageId, 
        audioUrl, 
        audioDataUri,
        audioDuration: duration, 
        sender: 'user', 
        timestamp: Date.now(), 
        status: 'transcribing' 
      }]);

      try {
        const transcriptionResult = await getAudioTranscription({ audioDataUri });
        updateMessage(userMessageId, {
          transcription: transcriptionResult.transcription,
          showTranscription: transcriptionResult.showTranscription,
          status: 'sent',
        });
        // Simulate AI processing the audio content if needed, or just acknowledge
        setIsAiTyping(true);
        setTimeout(() => {
          addMessage({ sender: 'ai', text: "I've processed your audio message.", status: 'sent' });
          setIsAiTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Transcription error:", error);
        updateMessage(userMessageId, {
          transcription: "Failed to transcribe audio.",
          showTranscription: true,
          status: 'failed',
        });
        toast({ title: "Error", description: "Could not transcribe audio.", variant: "destructive" });
      } finally {
        setIsSending(false);
      }
    };
    reader.onerror = () => {
        console.error("Error converting blob to data URI");
        toast({ title: "Error", description: "Failed to process audio.", variant: "destructive" });
        setIsSending(false);
    };
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
        isSending={isSending}
      />
      {isCallActive && <VoiceCallUi onClose={() => setIsCallActive(false)} />}
    </div>
  );
}
