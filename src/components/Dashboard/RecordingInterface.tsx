import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AudioRecorder } from "@/lib/audioRecorder";
import { transcribeAudio } from "@/lib/groq";
import { RecordingStatus } from "@/types/session";

interface RecordingInterfaceProps {
  onRecordingComplete?: (audioBlob: Blob, transcript: string) => void;
  recordingStatus?: RecordingStatus;
}

const RecordingInterface = ({
  onRecordingComplete = () => {},
  recordingStatus = "idle",
}: RecordingInterfaceProps) => {
  const [status, setStatus] = useState<RecordingStatus>(recordingStatus);
  const [waveformData, setWaveformData] = useState<number[]>(Array(50).fill(5));
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<string>("0:00");
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);

  // Update waveform visualization with more interactive wave pattern
  const updateWaveform = () => {
    const analyser = recorderRef.current.getAnalyser();
    if (analyser && status === "recording") {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // Create a more dynamic wave pattern based on actual audio input
      const waveform = Array.from(dataArray).map((value) => {
        // Scale the value and add a small minimum height
        return Math.max(3, value / 1.5);
      });

      setWaveformData(waveform.slice(0, 50));
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }
  };

  // Format the elapsed seconds into a readable duration string
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setStatus("recording");
      setElapsedSeconds(0);
      setRecordingDuration("0:00");
      setRecordingStartTime(Date.now());

      // Start audio recording
      await recorderRef.current.startRecording();

      // Start visualization
      updateWaveform();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setStatus("error");
    }
  };

  // Stop recording and process audio
  const stopRecording = async () => {
    if (status === "recording") {
      try {
        setStatus("processing");

        // Cancel animation frame for waveform
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        // Stop recording and get audio blob
        const audioBlob = await recorderRef.current.stopRecording();

        // Transcribe audio using Groq API
        const transcript = await transcribeAudio(audioBlob);

        // Call completion handler with results
        onRecordingComplete(audioBlob, transcript);
        setStatus("completed");
      } catch (error) {
        console.error("Error processing recording:", error);
        setStatus("error");
      }
    }
  };

  // Effect to handle the timer updates
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (status === "recording") {
      // Start the timer immediately
      setElapsedSeconds(0);
      
      // Update the timer every second
      intervalId = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const newValue = prev + 1;
          setRecordingDuration(formatDuration(newValue));
          return newValue;
        });
      }, 1000);
    }
    
    // Cleanup function to clear interval when recording stops
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [status]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      recorderRef.current.stopRecording().catch(console.error);
    };
  }, []);

  // Update status based on props
  useEffect(() => {
    setStatus(recordingStatus);
  }, [recordingStatus]);

  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          {/* Prominent Timer Display - Only visible when recording */}
          {status === "recording" && (
            <div className="flex items-center justify-center">
              <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full shadow-md flex items-center space-x-2 border border-red-100 dark:border-red-800">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-xl font-bold text-red-500">{recordingDuration}</span>
              </div>
            </div>
          )}

          {/* Waveform Visualizer */}
          <div className={`h-24 w-full rounded-lg flex items-center justify-center relative overflow-hidden ${
            status === "recording" 
              ? "bg-gradient-to-r from-red-50 to-indigo-50 dark:from-red-900/10 dark:to-indigo-900/10 border border-red-100 dark:border-red-900/20" 
              : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
          }`}>
            {status === "recording" && (
              <div className="absolute top-2 left-3 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-md shadow-sm z-10">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-red-700 dark:text-red-300">RECORDING</span>
                </div>
              </div>
            )}
            
            <div
              className={`w-full h-full flex items-center justify-center ${
                status === "idle" ? "opacity-50" : "opacity-100"
              }`}
            >
              {/* Animated waveform visualization */}
              <div className="flex items-center h-full space-x-[2px] px-2">
                {waveformData.map((height, index) => (
                  <div
                    key={index}
                    className={`w-1.5 rounded-full transition-all duration-100 ease-in-out ${
                      status === "recording"
                        ? "bg-gradient-to-t from-blue-400 to-indigo-500 animate-pulse"
                        : status === "processing"
                        ? "bg-gradient-to-t from-yellow-400 to-orange-500"
                        : "bg-gradient-to-t from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600"
                    }`}
                    style={{
                      height: `${Math.max(4, height)}px`,
                      transform: `scaleY(${status === "recording" ? 1 : 0.5})`,
                      opacity: status === "idle" ? 0.5 : 1,
                      transition: "all 100ms ease-in-out",
                      animationDelay: `${index * 20}ms`,
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Processing overlay */}
            {status === "processing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                  <p className="text-sm text-white font-medium">Processing...</p>
                </div>
              </div>
            )}
          </div>

          {/* Recording controls and status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Record/Stop button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={status === "recording" ? stopRecording : startRecording}
                      disabled={status === "processing"}
                      className={`rounded-full w-12 h-12 p-0 ${
                        status === "recording"
                          ? "bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg"
                      } transition-all duration-300`}
                    >
                      {status === "recording" ? (
                        <Square className="h-5 w-5 text-white" />
                      ) : (
                        <Mic className="h-5 w-5 text-white animate-pulse" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {status === "recording"
                        ? "Stop Recording"
                        : "Start Recording"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Status */}
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    status === "recording"
                      ? "text-red-500"
                      : status === "processing"
                      ? "text-yellow-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {status === "recording"
                    ? "Recording in progress..."
                    : status === "processing"
                    ? "Processing..."
                    : "Ready to record"}
                </span>
              </div>
            </div>

            {/* Info message */}
            <div className="text-xs text-gray-500 dark:text-gray-400 italic hidden md:block">
              {status === "idle" && "Click the microphone button to start recording"}
              {status === "recording" && "Click the stop button when you're finished"}
              {status === "processing" && "Converting your speech to text..."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingInterface;
