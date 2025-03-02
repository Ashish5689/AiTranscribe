# AiTranscribe 🎙️ → 📝

<div align="center">

![AiTranscribe Logo](https://img.shields.io/badge/AiTranscribe-Voice%20to%20Text-blue?style=for-the-badge&logo=react)

**[Live Demo](https://aitranscribe.netlify.app/) |

A modern, sleek dashboard that records your voice and transcribes it to proper English text using the Groq API, displaying results in real-time.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-blue.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## ✨ Features

- **🎤 Recording Interface**: Circular microphone button with animated wave visualization during recording
- **📝 Transcription Display**: Clean text area showing transcribed content with options to copy, edit, or download
- **📚 Session History**: Sidebar showing previous recording sessions with timestamps
- **🚦 Status Indicators**: Visual feedback for recording, processing, and completion states
- **🔒 Security**: API key handling through environment variables

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **API**: Groq API for audio transcription
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/AiTranscribe.git
   cd AiTranscribe
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Groq API key
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

## 📋 Usage

1. Visit the [live demo](https://aitranscribe.netlify.app/) or run locally
2. Click the microphone button to start recording
3. Speak clearly into your microphone
4. Click the stop button (square icon) when finished
5. The system will process your audio and display the transcription
6. Use the buttons above the transcription to copy, download, or edit the text
7. Previous recordings are saved in the session history sidebar

## 📁 Project Structure

```
src/
├── components/
│   └── Dashboard/
│       ├── DashboardLayout.tsx    # Overall layout and state management
│       ├── RecordingInterface.tsx # Microphone button and waveform visualization
│       ├── SessionHistory.tsx     # Sidebar with previous recordings
│       └── TranscriptionDisplay.tsx # Display and editing of transcribed text
├── lib/
│   ├── audioRecorder.ts           # Audio recording and visualization logic
│   ├── groq.ts                    # Integration with Groq API for transcription
│   └── sessionStorage.ts          # Local storage management for sessions
└── types/                         # TypeScript type definitions
```

## 📸 Screenshots

https://imgur.com/a/uNyd8qw

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>
    <a href="https://aitranscribe.netlify.app/">Visit AiTranscribe</a> •
    <a href="https://github.com/yourusername/AiTranscribe">GitHub</a>
  </p>
  <p>Made with ❤️ by Your Name</p>
</div>
