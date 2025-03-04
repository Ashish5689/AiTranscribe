import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Clock, Trash2 } from "lucide-react";
import { Session } from "@/types/session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface SessionHistoryProps {
  sessions?: Session[];
  onSessionSelect?: (sessionId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
  selectedSessionId?: string;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions = [
    {
      id: "1",
      title: "Meeting notes",
      timestamp: "2023-06-15 10:30 AM",
      duration: "5:32",
      transcription: "This is a sample transcription for meeting notes.",
    },
    {
      id: "2",
      title: "Project brainstorm",
      timestamp: "2023-06-14 2:15 PM",
      duration: "8:47",
      transcription: "This is a sample transcription for project brainstorm.",
    },
    {
      id: "3",
      title: "Interview with candidate",
      timestamp: "2023-06-13 11:00 AM",
      duration: "15:20",
      transcription:
        "This is a sample transcription for interview with candidate.",
    },
    {
      id: "4",
      title: "Weekly standup",
      timestamp: "2023-06-12 9:00 AM",
      duration: "12:05",
      transcription: "This is a sample transcription for weekly standup.",
    },
    {
      id: "5",
      title: "Client presentation",
      timestamp: "2023-06-10 3:30 PM",
      duration: "18:22",
      transcription: "This is a sample transcription for client presentation.",
    },
  ],
  onSessionSelect = () => {},
  onSessionDelete = () => {},
  selectedSessionId = "1",
}) => {
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      onSessionDelete(sessionToDelete);
      setSessionToDelete(null);
    }
  };

  return (
    <Card className="w-full h-full border-none rounded-none flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 shadow-none overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow-sm">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
          Recording History
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {sessions.length > 0
            ? `${sessions.length} saved recording${sessions.length !== 1 ? "s" : ""}`
            : "No recordings yet"}
        </p>
      </div>

      {sessions.length > 0 ? (
        <ScrollArea className="flex-grow">
          <div className="p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`mb-2 transition-all duration-200 transform hover:translate-x-1 ${
                  selectedSessionId === session.id
                    ? "scale-[1.02]"
                    : "scale-100"
                }`}
              >
                <Card
                  className={`cursor-pointer border overflow-hidden transition-all duration-200 ${
                    selectedSessionId === session.id
                      ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-700/50 shadow-md hover:shadow-lg"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:shadow-md"
                  }`}
                  onClick={() => onSessionSelect(session.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-gray-900 dark:text-gray-100">
                          {session.title || "Untitled Recording"}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
                          {session.duration && (
                            <div className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center">
                              <Clock size={10} className="mr-1" />
                              {session.duration}
                            </div>
                          )}
                        </div>
                        {session.transcription && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 overflow-hidden">
                            {session.transcription}
                          </div>
                        )}
                      </div>

                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="group ml-1 h-6 w-6 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 -mr-1 transition-all duration-200 relative"
                              onClick={(e) => handleDeleteClick(session.id, e)}
                            >
                              <span className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"></span>
                              <Trash2 size={14} className="relative z-10" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" align="center" className="z-[100]">
                            <p>Delete recording</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 dark:text-gray-500"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </div>
          <p className="font-medium">No recordings yet</p>
          <p className="text-xs mt-1">Your saved recordings will appear here</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={sessionToDelete !== null} onOpenChange={(isOpen) => !isOpen && setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recording</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recording? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SessionHistory;
