# Changelog

## Checkpoint 1: Disable Audio Transcription Feature (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents the disabling of the audio transcription feature. The goal was to keep the UI elements for audio recording functional but prevent any backend processing or AI calls for transcription.

- **Frontend (`src/app/page.tsx`):**
    - The `handleSendAudio` function was modified. Instead of processing the audio, creating a message, and calling the backend for transcription, it now:
        1. Checks for online status.
        2. Shows a toast notification: "Feature Disabled - Sending and transcribing audio messages is currently disabled."
        3. Does NOT add an audio message to the chat.
        4. Does NOT attempt to convert the audio blob to a data URI.
        5. Does NOT call the `getAudioTranscription` backend action.
    - This change affects the `handleSendAudio` function (lines 73-82 in `src/app/page.tsx` as of this checkpoint).

- **Backend (`src/app/actions.ts`):**
    - The `getAudioTranscription` server action was modified to ensure it no longer attempts to transcribe audio. It now:
        1. Logs a message to the console: "getAudioTranscription called, but feature is disabled."
        2. Immediately returns a static object:
           `{ transcription: 'Audio transcription feature is currently disabled.', showTranscription: true }`
    - This change affects the `getAudioTranscription` function (lines 6-12 in `src/app/actions.ts` as of this checkpoint).

This ensures that while the user can still interact with audio recording UI, no actual transcription occurs, and the system clearly communicates the feature's disabled state.

## Checkpoint 2: Remove AI Avatar from Messages (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents the removal of the AI (robot) avatar from messages sent by the AI.

- **Frontend (`src/components/chat/message-item.tsx`):**
    - The conditional rendering for the AI avatar (using `UserIcon` with `Bot` as a placeholder) was removed.
    - Specifically, the `{!isUser && ...}` block containing the `Avatar` component for the AI was deleted.
    - The main `Card`'s `className` was adjusted to remove `ml-10` when `!isUser` to ensure proper alignment without the avatar. (Lines 19-25 in `src/components/chat/message-item.tsx` as of this checkpoint were affected by the avatar removal logic). The specific line for `ml-10` removal was part of the `cn` on the `Card` component.

## Checkpoint 3: Enhance Message Shadow (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents the enhancement of the drop shadow for chat messages to make them appear more "suspended."

- **Frontend (`src/components/chat/message-item.tsx`):**
    - The `Card` component within `MessageItem` had its shadow class changed from `shadow-md` to `shadow-lg`.
    - This change is on line 20 (part of the `cn` utility function call for the `Card` component's class names) in `src/components/chat/message-item.tsx` as of this checkpoint.

## Checkpoint 4: Remove User Avatar from Messages (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents the removal of the user avatar from messages sent by the user.

- **Frontend (`src/components/chat/message-item.tsx`):**
    - The conditional rendering for the user avatar (using `UserIcon`) was removed.
    - Specifically, the `{isUser && ...}` block containing the `Avatar` component for the user was deleted.
    - The main `Card`'s `className` was adjusted to remove `mr-10` when `isUser` to ensure proper alignment without the avatar. (Previously lines 26-32, after AI avatar removal, this block was around lines 20-26 in `src/components/chat/message-item.tsx` as of this checkpoint were affected by the avatar removal logic). The specific line for `mr-10` removal was part of the `cn` on the `Card` component.

## Checkpoint 5: Dark Theme Color Refinement (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents the refinement of the dark theme colors in `globals.css` to be cleaner, more homogeneous, and darker.

- **Styling (`src/app/globals.css`):**
    - The HSL values for various CSS custom properties under the `.dark` selector were adjusted.
        - `--background` changed from `222.2 84% 4.9%` to `174 10% 15%`
        - `--foreground` changed from `210 40% 98%` to `174 5% 90%`
        - `--card` changed from `222.2 84% 4.9%` to `174 10% 20%`
        - `--card-foreground` changed from `210 40% 98%` to `174 5% 90%`
        - `--popover` changed from `222.2 84% 4.9%` to `174 10% 20%`
        - `--popover-foreground` changed from `210 40% 98%` to `174 5% 90%`
        - `--primary` kept `174 71% 46%`
        - `--primary-foreground` changed from `210 40% 98%` to `174 10% 10%`
        - `--secondary` changed from `217.2 32.6% 17.5%` to `174 10% 25%`
        - `--secondary-foreground` changed from `210 40% 98%` to `174 5% 80%`
        - `--muted` changed from `217.2 32.6% 17.5%` to `174 10% 22%`
        - `--muted-foreground` changed from `215 20.2% 65.1%` to `174 5% 60%`
        - `--accent` changed from `217.2 32.6% 17.5%` to `174 65% 50%` (making it teal-based)
        - `--accent-foreground` changed from `210 40% 98%` to `174 10% 10%`
        - `--destructive` changed from `0 62.8% 30.6%` to `0 70% 45%`
        - `--border` changed from `217.2 32.6% 17.5%` to `174 8% 28%`
        - `--input` changed from `217.2 32.6% 17.5%` to `174 8% 22%`
        - `--ring` kept `174 71% 46%`
    - These changes affect lines 39-67 in `src/app/globals.css`.

## Checkpoint 6: Footer UI Redesign (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents a redesign of the footer UI elements, including increasing their size, making some buttons circular, and adjusting the layout for prominence of the call button.

- **Audio Recorder Component (`src/components/chat/audio-recorder.tsx`):**
    - The microphone `Button` size was changed to `h-12 w-12` (lines 56, 62).
    - The `Mic` and `StopCircle` icons size increased to `h-6 w-6` (lines 57, 63).
- **Footer Layout (`src/components/layout/footer.tsx`):**
    - Changed main form to `flex items-end` and removed global `gap`. (line 25)
    - `AudioRecorder` container div: added `mr-2 sm:mr-3`. (line 26)
    - `Input` field: `min-h-[48px]` (was `min-h-[40px]`), `mr-2 sm:mr-3`. (line 33)
    - Send `Button`: `h-12 w-12`, `rounded-md`. (line 39)
    - Send `Button` icon (`Send`): `h-6 w-6`. (line 45)
    - Call button wrapper `div`: added `flex-grow flex items-center justify-end pl-2 sm:pl-3`. (line 48)
    - Call `Button`: `h-12 w-12`, `rounded-full`, `variant` logic updated to use `primary` when inactive. (lines 50, 51)
    - Call `Button` icons (`Phone`, `PhoneOff`): `h-6 w-6`. (lines 55, 57)

## Checkpoint 7: Footer Icon and Send Button Shape Update (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents changing the Send button in the footer to be circular and updating its icon to `ArrowUp`.

- **Footer Layout (`src/components/layout/footer.tsx`):**
    - Send `Button`: Changed from `rounded-md` to `rounded-full`. (line 40, class changed in `cn`)
    - Send `Button` icon: Replaced `Send` icon with `ArrowUp` icon from `lucide-react`. The `Loader2` icon for the sending state was retained. (lines 4, 46 - import and usage)

## Checkpoint 8: Microphone Button Active State Ring (YYYY-MM-DD HH:MM)

**Description:**
This checkpoint documents adding a white ring around the microphone button when it is active (recording).

- **Audio Recorder Component (`src/components/chat/audio-recorder.tsx`):**
    - Conditionally applied `ring-2 ring-white ring-offset-2 ring-offset-background` classes to the microphone `Button` when `isRecording` is `true`.
    - This change affects the `Button` component's `className` prop (lines 58-61).

## Checkpoint 9: Textarea for Multi-line Input & Enter Key Behavior (YYYY-MM-DD HH:MM)

**Description:**
Changed the message input from a single-line `Input` to a `Textarea` to allow multi-line messages. Pressing "Enter" now creates a new line instead of sending the message. Sending is done via the send button.

- **Footer Layout (`src/components/layout/footer.tsx`):**
    - Replaced `Input` component with `Textarea` for message input. (lines 5, 31-38)
    - `Textarea` styled with `h-12 min-h-[48px] resize-none`.
    - Send `Button` `type` changed from `"submit"` to `"button"`. (line 40)
    - Added `onClick={handleSendText}` to the Send `Button`. (line 41)
    - Removed `onSubmit={handleSendText}` from the `<form>` element. (line 25 was `<form className="flex items-end w-full" onSubmit={handleSendText}>`)
    - Modified `handleSendText` function to no longer expect a `React.FormEvent`. (line 19)

## Checkpoint 10: Markdown Message Rendering (YYYY-MM-DD HH:MM)

**Description:**
Implemented Markdown rendering for chat messages, allowing users to send and view formatted text (e.g., bold, italics, lists, code blocks).

- **Package Updates (`package.json`):**
    - Added `react-markdown` (version `^9.0.1`) to dependencies. (line 42)
- **Message Item Component (`src/components/chat/message-item.tsx`):**
    - Imported `ReactMarkdown` from `react-markdown`. (line 4)
    - Replaced the direct rendering of `message.text` in a `<p>` tag with the `<ReactMarkdown>` component. (lines 24-26)
    - Wrapped `ReactMarkdown` in a `div` with Tailwind Typography classes (`prose prose-sm dark:prose-invert max-w-none`) for basic styling of Markdown elements.
    - Removed `whitespace-pre-wrap` and `break-words` classes as `react-markdown` handles text formatting.

This allows users to use Markdown syntax in their messages, which will be rendered as formatted HTML in the chat interface.

## Checkpoint 11: Code Block Background in Dark Mode (YYYY-MM-DD HH:MM)

**Description:**
Adjusted the background of code blocks within chat messages in dark mode to be totally black for improved readability and contrast.

- **Styling (`src/app/globals.css`):**
    - Modified the custom style targeting `pre` elements within `.dark .prose-invert`.
    - Set `background-color` to `hsl(0, 0%, 0%)` (totally black).
    - This change affects lines 82-84 in `src/app/globals.css` as of this checkpoint.
