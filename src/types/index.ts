export interface Message {
  id: string;
  text?: string;
  audioUrl?: string; // Data URI for audio
  audioDataUri?: string; // For sending to AI
  audioDuration?: number; // in seconds
  transcription?: string;
  showTranscription?: boolean;
  sender: 'user' | 'ai';
  timestamp: number;
  status?: 'pending' | 'sent' | 'failed' | 'transcribing';
}
