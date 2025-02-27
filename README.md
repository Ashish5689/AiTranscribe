# Voice Recording and Transcription Dashboard

A modern, sleek dashboard that records user's voice and transcribes it to proper English text using the Groq API, displaying results in real-time.

## Features

- **Recording Interface**: Circular microphone button with animated wave visualization during recording
- **Transcription Display**: Clean text area showing transcribed content with options to copy, edit, or download
- **Session History**: Sidebar showing previous recording sessions with timestamps
- **Status Indicators**: Visual feedback for recording, processing, and completion states
- **Security**: API key handling through environment variables

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- ShadCN UI components
- Groq API for audio transcription

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Groq API key:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

```bash
npm run build
```

## Usage

1. Click the microphone button to start recording
2. Speak clearly into your microphone
3. Click the stop button (square icon) when finished
4. The system will process your audio and display the transcription
5. Use the buttons above the transcription to copy, download, or edit the text
6. Previous recordings are saved in the session history sidebar

## Project Structure

- `src/components/Dashboard/` - Main dashboard components
  - `DashboardLayout.tsx` - Overall layout and state management
  - `RecordingInterface.tsx` - Microphone button and waveform visualization
  - `SessionHistory.tsx` - Sidebar with previous recordings
  - `TranscriptionDisplay.tsx` - Display and editing of transcribed text
- `src/lib/` - Utility functions and services
  - `audioRecorder.ts` - Audio recording and visualization logic
  - `groq.ts` - Integration with Groq API for transcription
  - `sessionStorage.ts` - Local storage management for sessions
- `src/types/` - TypeScript type definitions

## License

MIT
