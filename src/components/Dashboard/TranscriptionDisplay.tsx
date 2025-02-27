import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Download, Edit, Save, X } from "lucide-react";

interface TranscriptionDisplayProps {
  transcription?: string;
  isProcessing?: boolean;
  timestamp?: string;
}

const TranscriptionDisplay = ({
  transcription = "This is a sample transcription. When you record your voice, the transcribed text will appear here. You can edit, copy, or download the transcription using the buttons above.",
  isProcessing = false,
  timestamp = new Date().toLocaleString(),
}: TranscriptionDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcription);

  // Update editedText when transcription prop changes
  React.useEffect(() => {
    setEditedText(transcription);
  }, [transcription]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedText);
    // In a real implementation, you would show a toast notification here
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcription-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real implementation, you would save the edited text to your backend here
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(transcription);
  };

  return (
    <Card className="w-full h-full bg-white dark:bg-slate-800 overflow-hidden flex flex-col shadow-lg border-0 rounded-xl">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Transcription</CardTitle>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyToClipboard}
                    disabled={isProcessing || !transcription}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                    disabled={isProcessing || !transcription}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as text file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isEditing ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSave}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save changes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel editing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleEdit}
                      disabled={isProcessing || !transcription}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit transcription</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        {timestamp && (
          <p className="text-xs text-gray-500 mt-1">Recorded: {timestamp}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-auto">
        {isProcessing ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-pulse flex space-x-2 justify-center mb-4">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-gray-500">Processing your recording...</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {isEditing ? (
              <Textarea
                className="w-full h-full min-h-[400px] p-5 text-base resize-none focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-900/50 rounded-lg shadow-inner border-slate-200 dark:border-slate-700"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Your transcription will appear here"
              />
            ) : (
              <div className="w-full h-full overflow-auto p-5 text-base whitespace-pre-wrap bg-slate-50 dark:bg-slate-900/50 rounded-lg my-2 shadow-inner">
                {editedText ||
                  "No transcription available yet. Record something to get started."}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptionDisplay;
