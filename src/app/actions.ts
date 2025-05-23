'use server';

import { transcribeAudioMessage as transcribeAudioMessageFlow, type TranscribeAudioMessageInput, type TranscribeAudioMessageOutput } from '@/ai/flows/transcribe-audio-message';

export async function getAudioTranscription(input: TranscribeAudioMessageInput): Promise<TranscribeAudioMessageOutput> {
  try {
    // The flow itself will decide if the transcription should be shown.
    const result = await transcribeAudioMessageFlow(input);
    return result;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    // Return a default or error state if transcription fails
    return {
      transcription: 'Error: Could not transcribe audio.',
      showTranscription: true, // Show the error
    };
  }
}
