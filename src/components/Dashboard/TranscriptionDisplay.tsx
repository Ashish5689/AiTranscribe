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
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  // Update editedText when transcription prop changes
  React.useEffect(() => {
    setEditedText(transcription);
  }, [transcription]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedText);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
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
    <Card className="w-full h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
      <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
              {isProcessing ? "Processing..." : "Transcription"}
            </span>
            {timestamp && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">
                {timestamp}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center space-x-1">
            {isEditing ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                        onClick={handleSave}
                      >
                        <Save size={16} />
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
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                        onClick={handleCancel}
                      >
                        <X size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancel editing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={handleEdit}
                        disabled={isProcessing || !transcription}
                      >
                        <Edit size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit transcription</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        onClick={handleCopyToClipboard}
                        disabled={isProcessing || !transcription}
                      >
                        <Copy size={16} />
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
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        onClick={handleDownload}
                        disabled={isProcessing || !transcription}
                      >
                        <Download size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download as text file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        {isProcessing ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
                <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-blue-300 border-l-transparent animate-spin animation-delay-300"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Converting your speech into text...<br />This may take a moment.
              </p>
            </div>
          </div>
        ) : isEditing ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="border-0 shadow-none resize-none h-full rounded-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4 bg-white dark:bg-slate-800 dark:text-gray-200"
            placeholder="Your transcription will appear here..."
          />
        ) : (
          <div className="p-4 h-full overflow-auto whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {transcription || "No transcription available. Record something to see it here."}
          </div>
        )}
      </CardContent>
      
      {/* Feedback for Copy operation */}
      {showCopyFeedback && (
        <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-md shadow-md text-sm font-medium animate-fade-in-out">
          Copied to clipboard!
        </div>
      )}
    </Card>
  );
};

export default TranscriptionDisplay;
