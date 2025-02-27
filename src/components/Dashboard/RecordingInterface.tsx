import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
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
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null,
  );
  const [recordingDuration, setRecordingDuration] = useState<string>("0:00");

  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const animationFrameRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<number | null>(null);

  // Update waveform visualization
  const updateWaveform = () => {
    const analyser = recorderRef.current.getAnalyser();
    if (analyser && status === "recording") {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      // Convert the frequency data to waveform heights
      const waveform = Array.from(dataArray).map((value) =>
        Math.max(3, value / 4),
      );
      setWaveformData(waveform.slice(0, 50));

      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    }
  };

  // Update recording duration
  const updateDuration = () => {
    if (recordingStartTime && status === "recording") {
      const durationInSeconds = (Date.now() - recordingStartTime) / 1000;
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      setRecordingDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      setStatus("recording");
      setRecordingStartTime(Date.now());

      // Start audio recording
      await recorderRef.current.startRecording();

      // Start duration timer
      durationIntervalRef.current = window.setInterval(updateDuration, 1000);
      // Call updateDuration immediately to show initial time
      updateDuration();

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

        // Stop recording and get audio blob
        const audioBlob = await recorderRef.current.stopRecording();

        // Clear timers and animation
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update status when prop changes
  useEffect(() => {
    setStatus(recordingStatus);
  }, [recordingStatus]);

  return (
    <Card className="w-full h-[400px] flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 shadow-lg border-0 rounded-xl">
      <div className="flex flex-col items-center gap-8">
        {/* Recording button */}
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={status === "recording" ? "destructive" : "default"}
                  size="icon"
                  className={`h-32 w-32 rounded-full transition-all shadow-lg ${status === "recording" ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"}`}
                  onClick={
                    status === "recording" ? stopRecording : startRecording
                  }
                  disabled={status === "processing"}
                >
                  {status === "recording" ? (
                    <Square className="h-12 w-12" />
                  ) : status === "processing" ? (
                    <Loader2 className="h-12 w-12 animate-spin" />
                  ) : (
                    <Mic className="h-12 w-12" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {status === "recording"
                  ? "Stop Recording"
                  : status === "processing"
                    ? "Processing..."
                    : "Start Recording"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Recording duration */}
          {status === "recording" && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
              {recordingDuration}
            </div>
          )}
        </div>

        {/* Waveform visualization */}
        <div className="flex items-center justify-center h-16 w-full max-w-lg gap-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full">
          {waveformData.map((height, index) => (
            <div
              key={index}
              className={`w-1 rounded-full transition-all duration-150 ${status === "recording" ? "bg-gradient-to-b from-blue-400 to-indigo-600" : "bg-gray-300"}`}
              style={{
                height: `${status === "recording" ? height : 5}px`,
                opacity: status === "recording" ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        {/* Status text */}
        <div className="text-center">
          {status === "idle" && (
            <p className="text-gray-500">
              Click the microphone to start recording
            </p>
          )}
          {status === "recording" && (
            <p className="text-primary font-medium">Recording in progress...</p>
          )}
          {status === "processing" && (
            <p className="text-amber-500 font-medium">
              Transcribing your recording with Groq API...
            </p>
          )}
          {status === "completed" && (
            <p className="text-green-500 font-medium">
              Recording transcribed successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-500 font-medium">
              Error processing audio. Please try again.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RecordingInterface;
