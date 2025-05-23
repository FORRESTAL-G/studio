
'use server';

import { transcribeAudioMessage as transcribeAudioMessageFlow, type TranscribeAudioMessageInput, type TranscribeAudioMessageOutput } from '@/ai/flows/transcribe-audio-message';

export async function getAudioTranscription(input: TranscribeAudioMessageInput): Promise<TranscribeAudioMessageOutput> {
  // Audio transcription feature is disabled.
  // Return a message indicating this, without calling the AI flow.
  console.log('getAudioTranscription called, but feature is disabled.');
  return {
    transcription: 'Audio transcription feature is currently disabled.',
    showTranscription: true, // Ensure this message is shown if this function were somehow called
  };
}
