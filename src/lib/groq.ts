import axios from "axios";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Create a FormData object to properly send the audio file
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    formData.append("model", "whisper-large-v3");

    // Call Groq API for transcription
    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error("Failed to transcribe audio");
  }
}
