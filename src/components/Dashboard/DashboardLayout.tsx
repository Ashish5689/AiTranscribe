import React, { useState, useEffect } from "react";
import SessionHistory from "./SessionHistory";
import RecordingInterface from "./RecordingInterface";
import TranscriptionDisplay from "./TranscriptionDisplay";
import { Session, RecordingStatus } from "@/types/session";
import {
  getSessions,
  saveSession,
  deleteSession,
  getSession,
  formatDuration,
} from "@/lib/sessionStorage";

interface DashboardLayoutProps {
  initialSessionId?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  initialSessionId,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [recordingStatus, setRecordingStatus] =
    useState<RecordingStatus>("idle");
  const [currentTranscription, setCurrentTranscription] = useState<string>("");
  const [currentTimestamp, setCurrentTimestamp] = useState<string>("");
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null,
  );

  // Load sessions from storage on component mount
  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);

    // Select the first session if available, or the initialSessionId if provided
    if (
      initialSessionId &&
      loadedSessions.some((s) => s.id === initialSessionId)
    ) {
      setSelectedSessionId(initialSessionId);
      const session = getSession(initialSessionId);
      if (session) {
        setCurrentTranscription(session.transcription);
        setCurrentTimestamp(session.timestamp);
      }
    } else if (loadedSessions.length > 0) {
      setSelectedSessionId(loadedSessions[0].id);
      setCurrentTranscription(loadedSessions[0].transcription);
      setCurrentTimestamp(loadedSessions[0].timestamp);
    }
  }, [initialSessionId]);

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    const session = getSession(sessionId);
    if (session) {
      setCurrentTranscription(session.transcription);
      setCurrentTimestamp(session.timestamp);
    }
  };

  const handleSessionDelete = (sessionId: string) => {
    deleteSession(sessionId);
    const updatedSessions = getSessions();
    setSessions(updatedSessions);

    // If the deleted session was selected, select another one
    if (sessionId === selectedSessionId) {
      if (updatedSessions.length > 0) {
        setSelectedSessionId(updatedSessions[0].id);
        setCurrentTranscription(updatedSessions[0].transcription);
        setCurrentTimestamp(updatedSessions[0].timestamp);
      } else {
        setSelectedSessionId("");
        setCurrentTranscription("");
        setCurrentTimestamp("");
      }
    }
  };

  const handleRecordingStatusChange = (status: RecordingStatus) => {
    setRecordingStatus(status);

    if (status === "recording") {
      setRecordingStartTime(Date.now());
    }
  };

  const handleRecordingComplete = (audioBlob: Blob, transcript: string) => {
    const now = new Date();
    const timestamp = now.toLocaleString();

    // Calculate duration
    let duration = "0:00";
    if (recordingStartTime) {
      const durationInSeconds = (Date.now() - recordingStartTime) / 1000;
      duration = formatDuration(durationInSeconds);
    }

    // Create new session
    const newSession: Session = {
      id: Date.now().toString(),
      title: `Recording ${timestamp}`,
      timestamp,
      duration,
      transcription: transcript,
    };

    // Save session and update state
    saveSession(newSession);
    setSessions(getSessions());
    setSelectedSessionId(newSession.id);
    setCurrentTranscription(transcript);
    setCurrentTimestamp(timestamp);
    setRecordingStatus("completed");
    setRecordingStartTime(null);

    // Force update the TranscriptionDisplay component
    setTimeout(() => {
      setCurrentTranscription(transcript);
    }, 100);
  };

  return (
    <div className="flex h-full w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Session History Sidebar */}
      <SessionHistory
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSessionSelect={handleSessionSelect}
        onSessionDelete={handleSessionDelete}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center mb-6 space-x-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            AI Powered Voice Transcription Dashboard
          </h1>
        </div>

        {/* Recording Interface */}
        <div className="mb-6">
          <RecordingInterface
            recordingStatus={recordingStatus}
            onRecordingComplete={handleRecordingComplete}
          />
        </div>

        {/* Transcription Display */}
        <div className="flex-1 overflow-hidden">
          <TranscriptionDisplay
            transcription={currentTranscription}
            isProcessing={recordingStatus === "processing"}
            timestamp={currentTimestamp}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
