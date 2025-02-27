import { Session } from "../types/session";

const STORAGE_KEY = "voice-transcription-sessions";

export function getSessions(): Session[] {
  const storedSessions = localStorage.getItem(STORAGE_KEY);
  return storedSessions ? JSON.parse(storedSessions) : [];
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  sessions.unshift(session); // Add new session at the beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function deleteSession(sessionId: string): void {
  const sessions = getSessions();
  const updatedSessions = sessions.filter(
    (session) => session.id !== sessionId,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
}

export function getSession(sessionId: string): Session | undefined {
  const sessions = getSessions();
  return sessions.find((session) => session.id === sessionId);
}

export function formatDuration(durationInSeconds: number): string {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
