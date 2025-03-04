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

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-[#f1f3f4] to-[#e8eaed] dark:from-slate-800 dark:to-slate-900 shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-[#4285f4]/10 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-[#4285f4]">Session History</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {sessions.length} recording{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedSessionId === session.id 
                  ? "border-[#4285f4] bg-white dark:bg-slate-700 shadow-md scale-[1.02] transform" 
                  : "hover:bg-white dark:hover:bg-slate-700 bg-[#f8f9fa] dark:bg-slate-800 hover:scale-[1.01] transform"
              }`}
              onClick={() => onSessionSelect(session.id)}
              onMouseEnter={() => setHoveredSessionId(session.id)}
              onMouseLeave={() => setHoveredSessionId(null)}
            >
              <CardContent className="p-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium truncate max-w-[180px] text-gray-800 dark:text-gray-200">
                      {session.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{session.timestamp}</span>
                    </div>
                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#4285f4] mr-1.5"></span>
                      Duration: {session.duration}
                    </div>
                  </div>

                  {(hoveredSessionId === session.id ||
                    selectedSessionId === session.id) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 absolute top-2 right-2 opacity-80 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSessionDelete(session.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete session</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {sessions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="mb-3 opacity-50">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="40" 
                  height="40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </div>
              <p className="font-medium">No recordings yet</p>
              <p className="text-xs mt-1">Start recording to create sessions</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SessionHistory;
