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
    <div className="h-full w-[300px] border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col shadow-md">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
        <h2 className="text-xl font-semibold">Session History</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {sessions.length} recording{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedSessionId === session.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" : "hover:bg-slate-50 dark:hover:bg-slate-700"}`}
              onClick={() => onSessionSelect(session.id)}
              onMouseEnter={() => setHoveredSessionId(session.id)}
              onMouseLeave={() => setHoveredSessionId(null)}
            >
              <CardContent className="p-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium truncate max-w-[180px]">
                      {session.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{session.timestamp}</span>
                    </div>
                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
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
                            className="h-7 w-7 absolute top-2 right-2"
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
        </div>
      </ScrollArea>
    </div>
  );
};

export default SessionHistory;
