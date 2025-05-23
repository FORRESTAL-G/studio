'use server';
/**
 * @fileOverview A flow for transcribing audio messages using AI.
 *
 * - transcribeAudioMessage - A function that handles the audio transcription process.
 * - TranscribeAudioMessageInput - The input type for the transcribeAudioMessage function.
 * - TranscribeAudioMessageOutput - The return type for the transcribeAudioMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAudioMessageInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio message as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Fixed typo here
    ),
});
export type TranscribeAudioMessageInput = z.infer<typeof TranscribeAudioMessageInputSchema>;

const TranscribeAudioMessageOutputSchema = z.object({
  transcription: z.string().describe('The transcription of the audio message.'),
  showTranscription: z.boolean().describe('Whether to show the transcribed text.'),
});
export type TranscribeAudioMessageOutput = z.infer<typeof TranscribeAudioMessageOutputSchema>;

export async function transcribeAudioMessage(input: TranscribeAudioMessageInput): Promise<TranscribeAudioMessageOutput> {
  return transcribeAudioMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeAudioMessagePrompt',
  input: {schema: TranscribeAudioMessageInputSchema},
  output: {schema: TranscribeAudioMessageOutputSchema},
  prompt: `You are an AI assistant that transcribes audio messages.

You will receive an audio message as a data URI. Transcribe the audio message to text. 

After transcribing the message, determine whether the transcription should be shown to the user. Consider factors such as the accuracy of the transcription, the length of the message, and the user's preferences. Set the showTranscription field to true if the transcription should be shown, and false otherwise.

Audio: {{media url=audioDataUri}}
`,
});

const transcribeAudioMessageFlow = ai.defineFlow(
  {
    name: 'transcribeAudioMessageFlow',
    inputSchema: TranscribeAudioMessageInputSchema,
    outputSchema: TranscribeAudioMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
