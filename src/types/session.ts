export interface Session {
  id: string;
  title: string;
  timestamp: string;
  duration: string;
  transcription: string;
}

export type RecordingStatus =
  | "idle"
  | "recording"
  | "processing"
  | "completed"
  | "error";
