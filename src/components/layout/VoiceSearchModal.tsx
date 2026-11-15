"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Settings2, 
  Check, 
  Key, 
  ExternalLink 
} from "lucide-react";
import { 
  translateWithFreeAI, 
  transcribeAudioWithGemini, 
  getSavedGeminiKey, 
  setSavedGeminiKey,
  AITranslationResult 
} from "@/lib/utils/aiSearchAssistant";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (finalQuery: string, originalQuery: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translationResult, setTranslationResult] = useState<AITranslationResult | null>(null);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0);

  // Gemini API key state & settings drawer
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [isKeyConfigOpen, setIsKeyConfigOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState("");
  const [keySavedToast, setKeySavedToast] = useState(false);

  // MediaRecorder & Web Speech references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load saved key on mount
  useEffect(() => {
    const key = getSavedGeminiKey();
    setGeminiKey(key);
    setTempKeyInput(key);
  }, []);

  // Cleanup audio tracks and contexts
  const cleanupAudio = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setAudioVolume(0);
  }, []);

  // Start Voice Recording with Audio Visualizer
  const startRecording = useCallback(async () => {
    setErrorMessage(null);
    setTranscript("");
    setTranslationResult(null);
    audioChunksRef.current = [];

    if (typeof window === "undefined") return;

    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // 2. Setup Audio Visualizer volume meter
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          if (!streamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setAudioVolume(Math.min(100, Math.round((average / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      } catch {
        // Visualizer fallback
      }

      // 3. Initialize MediaRecorder for AI transcription
      let mediaRecorder: MediaRecorder | null = null;
      try {
        const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg", "audio/mp4"];
        const supportedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || "";
        mediaRecorder = supportedMime ? new MediaRecorder(stream, { mimeType: supportedMime }) : new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start(250); // Record chunks every 250ms
      } catch (recErr) {
        console.warn("MediaRecorder fallback:", recErr);
      }

      // 4. Also start browser SpeechRecognition for real-time live preview
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = navigator.language || "en-US";

          recognition.onresult = (event: any) => {
            let live = "";
            for (let i = 0; i < event.results.length; ++i) {
              live += event.results[i][0].transcript + " ";
            }
            if (live.trim()) {
              setTranscript(live.trim());
            }
          };

          recognition.onerror = (e: any) => {
            console.warn("Speech recognition interim notice:", e.error);
          };

          recognition.start();
        } catch {
          // Fallback to MediaRecorder AI processing
        }
      }

      setIsRecording(true);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser URL bar.");
      } else {
        setErrorMessage("Could not connect to microphone. Please check your browser audio settings.");
      }
      cleanupAudio();
    }
  }, [cleanupAudio]);

  // Stop Recording & Process with AI
  const stopRecordingAndProcess = useCallback(async () => {
    setIsRecording(false);
    setIsProcessingAI(true);

    // Stop live recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    // Stop visualizer
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Stop MediaRecorder and grab audio blob
    const mediaRecorder = mediaRecorderRef.current;
    let recordedBlob: Blob | null = null;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      await new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => resolve();
        mediaRecorder.stop();
      });
      recordedBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorder.mimeType || "audio/webm",
      });
    }

    // Stop microphone tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    const currentTranscript = transcript.trim();
    const currentGeminiKey = getSavedGeminiKey();

    try {
      // PATH A: If Gemini API key is available and audio blob exists, use Google Gemini AI directly on the audio
      if (currentGeminiKey && recordedBlob && recordedBlob.size > 1000) {
        const aiAudioResult = await transcribeAudioWithGemini(recordedBlob, currentGeminiKey);
        if (aiAudioResult.success && aiAudioResult.englishQuery) {
          setTranscript(aiAudioResult.transcript || currentTranscript);
          setTranslationResult({
            original: aiAudioResult.transcript || currentTranscript,
            translated: aiAudioResult.englishQuery,
            detectedLanguage: aiAudioResult.detectedLanguage,
            source: "gemini_ai",
            matchedCategories: aiAudioResult.category ? [aiAudioResult.category] : [],
          });
          setIsProcessingAI(false);

          // Auto-trigger search after 1.2s preview
          setTimeout(() => {
            onSearch(aiAudioResult.englishQuery, aiAudioResult.transcript || currentTranscript);
            onClose();
          }, 1200);
          return;
        }
      }

      // PATH B: Process through Free Online AI Translation & Semantic Pipeline
      if (currentTranscript) {
        const transResult = await translateWithFreeAI(currentTranscript);
        setTranslationResult(transResult);
        setIsProcessingAI(false);

        // Auto-trigger search after 1.2s preview
        setTimeout(() => {
          onSearch(transResult.translated || currentTranscript, currentTranscript);
          onClose();
        }, 1200);
      } else {
        setIsProcessingAI(false);
        setErrorMessage("No voice was detected. Please tap the microphone and speak clearly.");
      }
    } catch (err: any) {
      console.error("AI voice processing failed:", err);
      setIsProcessingAI(false);
      setErrorMessage("Could not process voice search. Tap to try again.");
    }
  }, [transcript, onSearch, onClose]);

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      cleanupAudio();
      setTranscript("");
      setTranslationResult(null);
      setErrorMessage(null);
      setIsKeyConfigOpen(false);
    }
    return () => {
      cleanupAudio();
    };
  }, [isOpen, startRecording, cleanupAudio]);

  const handleSaveGeminiKey = () => {
    setSavedGeminiKey(tempKeyInput);
    setGeminiKey(tempKeyInput.trim());
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setIsKeyConfigOpen(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 text-green-800 rounded-lg">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                AI Voice Search
                <span className="text-[10px] bg-green-100 text-green-800 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  {geminiKey ? "Gemini AI" : "Free AI"}
                </span>
              </h3>
              <p className="text-[11px] text-gray-500">
                Speaks &amp; understands Luganda, Swahili, Runyankore, Acholi, and English
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsKeyConfigOpen(!isKeyConfigOpen)}
              className="p-1.5 text-gray-500 hover:text-green-700 hover:bg-gray-100 rounded-lg transition"
              title="Configure Free AI Model Key"
            >
              <Settings2 size={17} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key Drawer */}
        {isKeyConfigOpen && (
          <div className="p-4 bg-emerald-50/90 border-b border-emerald-100 text-xs">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Key size={14} className="text-emerald-700" />
                <span>Google Gemini AI Voice Model (Free)</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-0.5"
              >
                Get Free Key <ExternalLink size={11} />
              </a>
            </div>
            <p className="text-gray-600 text-[11px] mb-2 leading-relaxed">
              Google provides a 100% free Gemini API key with no credit card required. Adding it gives you direct audio listening for authentic Ugandan dialects.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Paste your free Gemini API key (AIza...)"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-green-700"
              />
              <button
                onClick={handleSaveGeminiKey}
                className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-lg font-bold text-xs flex items-center gap-1"
              >
                {keySavedToast ? <Check size={14} /> : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Interactive Voice Recording Area */}
        <div className="p-6 flex flex-col items-center justify-center text-center min-h-[240px]">
          {/* Animated Waveform & Mic Button */}
          <div className="relative mb-5 flex flex-col items-center">
            {/* Dynamic Soundwave Rings */}
            {isRecording && (
              <div
                className="absolute -inset-4 rounded-full bg-green-500/20 transition-transform duration-100"
                style={{ transform: `scale(${1 + audioVolume / 100})` }}
              />
            )}

            <button
              onClick={isRecording ? stopRecordingAndProcess : startRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700 text-white scale-105 ring-4 ring-red-200"
                  : isProcessingAI
                  ? "bg-amber-600 text-white animate-pulse"
                  : "bg-green-700 hover:bg-green-800 text-white hover:scale-105 ring-4 ring-green-100"
              }`}
            >
              {isRecording ? (
                <>
                  <Mic size={36} className="animate-pulse" />
                  <span className="text-[10px] font-black tracking-tight uppercase mt-1">Tap Done</span>
                </>
              ) : isProcessingAI ? (
                <>
                  <Sparkles size={32} className="animate-spin" />
                  <span className="text-[10px] font-bold mt-1">AI Thinking...</span>
                </>
              ) : (
                <>
                  <MicOff size={32} />
                  <span className="text-[10px] font-bold mt-1">Tap to Speak</span>
                </>
              )}
            </button>

            {/* Audio Waveform Bars that react to user's voice */}
            {isRecording && (
              <div className="flex items-center gap-1 mt-3 h-5">
                {[0.4, 0.8, 1.2, 0.9, 0.6, 1.1, 0.7].map((factor, idx) => (
                  <span
                    key={idx}
                    className="w-1 bg-green-600 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, Math.min(20, audioVolume * factor))}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Status Label */}
          <div className="mb-3">
            {isRecording ? (
              <p className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
                Listening... Speak naturally in your local language
              </p>
            ) : isProcessingAI ? (
              <p className="text-sm font-bold text-amber-800 flex items-center justify-center gap-1.5">
                <Sparkles size={16} className="text-amber-600 animate-spin" />
                AI Translating your speech to English marketplace search...
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500">
                {transcript ? "Speech captured! Tap Search or speak again." : "Tap the microphone to speak what you want to buy"}
              </p>
            )}
          </div>

          {/* Live Transcript Box */}
          {transcript ? (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-2 text-left shadow-2xs">
              <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                You Said:
              </div>
              <p className="text-sm font-bold text-gray-900 break-words leading-relaxed">
                &ldquo;{transcript}&rdquo;
              </p>

              {/* Translation Preview Box */}
              {translationResult && (
                <div className="mt-2.5 pt-2 border-t border-gray-200 flex items-start gap-2 bg-green-50/80 p-2.5 rounded-lg text-xs text-green-950">
                  <Sparkles size={15} className="text-green-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-green-900">
                      Translated to English ({translationResult.detectedLanguage || "Local"}):
                    </span>
                    <p className="font-black text-sm text-green-950 mt-0.5">
                      &ldquo;{translationResult.translated}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400 space-y-1 my-1">
              <p className="font-medium text-gray-500">You can speak in any local language:</p>
              <p className="italic text-gray-600">
                &ldquo;Njagala engatto z&apos;abasajja&rdquo; • &ldquo;Emmwanyi ya Mbale&rdquo; • &ldquo;Mikeeka&rdquo; • &ldquo;Viatu vya watoto&rdquo;
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-3 my-2 text-xs text-red-800 flex items-start gap-2 text-left">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <button
                  onClick={startRecording}
                  className="mt-1 text-xs font-bold text-red-700 underline hover:text-red-900"
                >
                  Tap here to try again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>

          {isRecording ? (
            <button
              onClick={stopRecordingAndProcess}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Finish Speaking</span>
              <ArrowRight size={14} />
            </button>
          ) : transcript ? (
            <button
              onClick={() => {
                const target = translationResult?.translated || transcript;
                onSearch(target, transcript);
                onClose();
              }}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Search Products</span>
              <ArrowRight size={14} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
