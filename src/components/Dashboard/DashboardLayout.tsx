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
import { Menu, X } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>("");
  const [showCopyFeedback, setShowCopyFeedback] = useState<boolean>(false);
  const [currentTimestamp, setCurrentTimestamp] = useState<string>("");
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
      setEditedText(session.transcription);
      setCurrentTimestamp(session.timestamp);
      setIsEditing(false);
    }
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
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
    setEditedText(transcript);
    setCurrentTimestamp(timestamp);
    setRecordingStatus("completed");
    setRecordingStartTime(null);
    setIsEditing(false);

    // Force update the TranscriptionDisplay component
    setTimeout(() => {
      setCurrentTranscription(transcript);
      setEditedText(transcript);
    }, 100);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-full w-full bg-[#f8f9fa] dark:bg-slate-900 relative">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#4285f4] text-white p-2 rounded-full shadow-lg"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Session History Sidebar - Mobile Friendly */}
      <div
        className={`fixed md:relative z-40 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? "left-0" : "-left-full md:left-0"
        } md:w-[300px] w-[85%] max-w-[300px]`}
      >
        <SessionHistory
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          onSessionSelect={handleSessionSelect}
          onSessionDelete={handleSessionDelete}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden md:ml-0 ml-0">
        <div className="flex items-center mb-4 md:mb-6 space-x-2 mt-10 md:mt-0 justify-center md:justify-start">
          <div className="bg-[#4285f4] p-2 rounded-lg">
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
          <h1 className="text-xl md:text-2xl font-bold text-[#4285f4] dark:text-[#4285f4] truncate">
            AI Voice Transcription
          </h1>
        </div>

        {/* Main Content Area with Recording Interface and Transcription */}
        <div className="flex flex-col space-y-4 md:space-y-6 h-full">
          {/* Recording Interface */}
          <div className="flex-none">
            <RecordingInterface
              recordingStatus={recordingStatus}
              onRecordingComplete={handleRecordingComplete}
            />
          </div>

          {/* Transcription Display */}
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Transcription
              </h2>
              <div className="flex flex-wrap space-x-2 items-center">
                <button
                  onClick={() => {
                    if (currentTranscription) {
                      navigator.clipboard.writeText(
                        isEditing ? editedText : currentTranscription,
                      );
                      setShowCopyFeedback(true);
                      setTimeout(() => setShowCopyFeedback(false), 2000);
                    }
                  }}
                  disabled={
                    (!currentTranscription && !editedText) ||
                    recordingStatus === "processing"
                  }
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 relative"
                  title="Copy to clipboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (currentTranscription || editedText) {
                      const element = document.createElement("a");
                      const file = new Blob(
                        [isEditing ? editedText : currentTranscription],
                        {
                          type: "text/plain",
                        },
                      );
                      element.href = URL.createObjectURL(file);
                      element.download = `transcription-${new Date().toISOString().slice(0, 10)}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }
                  }}
                  disabled={
                    (!currentTranscription && !editedText) ||
                    recordingStatus === "processing"
                  }
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                  title="Download as text file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (isEditing) {
                      // Save the edited text
                      setCurrentTranscription(editedText);

                      // Update the session in storage
                      if (selectedSessionId) {
                        const session = getSession(selectedSessionId);
                        if (session) {
                          const updatedSession = {
                            ...session,
                            transcription: editedText,
                          };
                          deleteSession(selectedSessionId);
                          saveSession(updatedSession);
                          setSessions(getSessions());
                        }
                      }
                    } else {
                      // Start editing - editedText already has the current transcription
                      setEditedText(currentTranscription);
                    }
                    setIsEditing(!isEditing);
                  }}
                  disabled={
                    !currentTranscription || recordingStatus === "processing"
                  }
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                  title={isEditing ? "Save changes" : "Edit transcription"}
                >
                  {isEditing ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  )}
                </button>
                <div className="text-xs text-gray-500 flex items-center ml-2 relative">
                  {currentTimestamp}
                  {showCopyFeedback && (
                    <div className="absolute -top-8 -left-10 bg-black text-white text-xs py-1 px-2 rounded shadow-md animate-fade-in-out">
                      Copied!
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 md:p-4 h-full overflow-auto border border-gray-200 dark:border-gray-700">
              {recordingStatus === "processing" ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-pulse flex space-x-2 justify-center mb-4">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <p className="text-gray-500">
                      Processing your recording...
                    </p>
                  </div>
                </div>
              ) : isEditing ? (
                <textarea
                  className="w-full h-full p-0 border-0 focus:ring-0 focus:outline-none resize-none bg-transparent text-gray-800 dark:text-gray-200 leading-relaxed"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  placeholder="Your transcription will appear here"
                />
              ) : (
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                  {currentTranscription ||
                    "No transcription available yet. Record something to get started."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
