# AiTranscribe 🎙️ → 📝

<div align="center">

![AiTranscribe Logo](https://img.shields.io/badge/AiTranscribe-Voice%20to%20Text-blue?style=for-the-badge&logo=react)

### 🚀 Transform Your Voice into Text Instantly!

🔊 **Speak Freely.** 📝 **See the Magic.** 🚀 **Boost Productivity.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-green?style=for-the-badge)](https://aitranscribe.netlify.app/)  

A modern, sleek, and intuitive **voice-to-text transcription tool** powered by the **Groq API**—all in real time!

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-blue.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Key Features

🚀 **Instant Transcription** – Record and convert your speech into structured text effortlessly.  
🎙️ **Intuitive Recording Interface** – A beautiful microphone button with real-time wave animations.  
📄 **Real-Time Display** – See your words appear as you speak, with editing and download options.  
🕒 **Session History** – Never lose your past transcriptions—view them anytime!  
⚡ **Fast & Secure** – Your data stays private, and processing is ultra-fast with Groq AI.  

---

## 🛠️ Tech Stack

🚀 **Frontend**: React with TypeScript  
⚡ **Build Tool**: Vite  
🎨 **Styling**: Tailwind CSS  
🖼️ **UI Components**: ShadCN UI  
🔊 **API**: Groq API for transcription  
🌍 **Deployment**: Netlify  

---

## 🚀 Get Started in Minutes!

### 📌 Prerequisites

✅ Install **Node.js (v16 or higher)**  
✅ Use **npm or yarn** as a package manager  
✅ Get your **Groq API Key**  

### 🛠️ Installation & Setup

1️⃣ Clone the Repository:
```bash
 git clone https://github.com/Ashish5689/AiTranscribe.git
 cd AiTranscribe
```

2️⃣ Install Dependencies:
```bash
npm install
```

3️⃣ Set Up Environment Variables:
Create a `.env` file in the root directory and add your API key:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4️⃣ Start the Development Server:
```bash
npm run dev
```
🌍 **Your app is now live at** `http://localhost:5173` 🎉

---

## 📋 How to Use AiTranscribe

1️⃣ **Visit the [Live Demo](https://aitranscribe.netlify.app/) or run locally.**  
2️⃣ **Click the Microphone Button** to start recording.  
3️⃣ **Speak Clearly** and watch your words appear in real time.  
4️⃣ **Click the Stop Button** when finished.  
5️⃣ **Copy, Edit, or Download** your transcribed text.  
6️⃣ **Access Previous Recordings** in the session history.  

---

## 📂 Project Structure

```
src/
├── components/
│   └── Dashboard/
│       ├── DashboardLayout.tsx    # Layout and state management
│       ├── RecordingInterface.tsx # Mic button & wave visualization
│       ├── SessionHistory.tsx     # Sidebar with previous recordings
│       └── TranscriptionDisplay.tsx # Text display & editing
├── lib/
│   ├── audioRecorder.ts           # Audio recording logic
│   ├── groq.ts                    # Groq API integration
│   └── sessionStorage.ts          # Session storage handling
└── types/                         # TypeScript type definitions
```

---

## 📸 Screenshots

🌟 **Experience the sleek and modern interface:**  
[View Screenshots](https://imgur.com/a/uNyd8qw)

---

## 💡 Why Use AiTranscribe?

✅ **Productivity Boost** – Take notes hands-free!  
✅ **Content Creation** – Generate ideas without typing.  
✅ **Accessibility** – Aids those with typing difficulties.  
✅ **Effortless Documentation** – Transcribe meetings, lectures, and interviews seamlessly.  

---

## 🤝 Contribute & Improve AiTranscribe!

💡 Found a bug? Have an idea? Help make AiTranscribe even better!  
🔗 [Submit a Pull Request](https://github.com/Ashish5689/AiTranscribe.git) or [Report an Issue](https://github.com/yourusername/AiTranscribe/issues)

---

## 📄 License

📜 This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>
    🌍 <a href="https://aitranscribe.netlify.app/">Visit AiTranscribe</a> •
    📂 <a href="https://github.com/Ashish5689/AiTranscribe.git">GitHub Repo</a>
  </p>
  <p>🚀 Made with ❤️ by <strong>Ashish Jha</strong></p>
</div>
