"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, X, Globe, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { translateLocalQuery, TranslationResult } from "@/lib/utils/localLanguageTranslator";

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
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"auto" | "sw" | "en">("auto");
  const recognitionRef = useRef<any>(null);

  // Available language choices for speech engine
  const languageOptions = [
    { id: "auto", label: "Auto (Luganda / Any Language)", code: "" },
    { id: "sw", label: "Swahili (Kiswahili)", code: "sw-KE" },
    { id: "en", label: "English / Ugandan English", code: "en-US" },
  ];

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setErrorMessage(null);
    setTranscript("");
    setTranslation(null);

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        "Voice speech recognition is not supported in this browser. Please try Google Chrome, Microsoft Edge, or Safari."
      );
      return;
    }

    // Step 1: Request microphone permission cleanly if needed
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop audio tracks immediately so SpeechRecognition can bind cleanly
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setErrorMessage(
            "Microphone access was denied. Please allow microphone permissions in your browser address bar to search with your voice."
          );
          setIsListening(false);
          return;
        }
      }
    }

    // Step 2: Initialize Speech Recognition with selected language code
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      const activeOption = languageOptions.find((l) => l.id === selectedLanguage);
      if (activeOption && activeOption.code) {
        recognition.lang = activeOption.code;
      } else {
        // Auto / broad language
        recognition.lang = navigator.language || "en-US";
      }

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interimText = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript;
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        const currentSpeech = finalText || interimText;
        setTranscript(currentSpeech);

        // Run local language translation
        if (currentSpeech.trim()) {
          const trans = translateLocalQuery(currentSpeech.trim());
          setTranslation(trans);
        }

        if (finalText.trim()) {
          setIsListening(false);
          const trans = translateLocalQuery(finalText.trim());
          setTranslation(trans);
          // Automatically trigger search after brief pause so user can see what was detected
          setTimeout(() => {
            const queryToSend = trans.isTranslated ? trans.translated : finalText.trim();
            onSearch(queryToSend, finalText.trim());
            onClose();
          }, 1200);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech error:", event.error);
        if (event.error === "no-speech") {
          setErrorMessage("No voice was detected. Please tap the microphone and speak again.");
        } else if (event.error === "not-allowed") {
          setErrorMessage(
            "Microphone access blocked. Please enable microphone permissions in your browser settings."
          );
        } else if (event.error === "language-not-supported") {
          // Fallback to broad English/auto
          try {
            recognition.lang = "en-US";
            recognition.start();
            return;
          } catch {
            setErrorMessage("Language pack not supported on this device. Switched to Auto.");
          }
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}. Please try again.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error("Speech startup failed:", err);
      setErrorMessage("Could not start microphone. Please check your browser audio settings.");
      setIsListening(false);
    }
  }, [selectedLanguage, onSearch, onClose]);

  // Start listening as soon as modal opens
  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
      setTranscript("");
      setTranslation(null);
      setErrorMessage(null);
    }
    return () => {
      stopListening();
    };
  }, [isOpen, startListening, stopListening]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 text-green-800 rounded-lg">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                Voice Search in Any Language
              </h3>
              <p className="text-[11px] text-gray-500">
                Speak in Luganda, Swahili, Runyankore, or English
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Language selector chips */}
        <div className="flex items-center justify-center gap-1.5 p-3 bg-gray-50 border-b border-gray-100 overflow-x-auto">
          {languageOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedLanguage(opt.id as any)}
              className={`text-xs px-3 py-1 rounded-full font-bold transition whitespace-nowrap ${
                selectedLanguage === opt.id
                  ? "bg-green-700 text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
          {/* Animated Microphone Icon */}
          <div className="relative mb-5">
            {isListening && (
              <>
                <span className="absolute -inset-3 rounded-full bg-red-400/30 animate-ping" />
                <span className="absolute -inset-6 rounded-full bg-red-400/15 animate-pulse" />
              </>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                isListening
                  ? "bg-red-600 text-white scale-105"
                  : "bg-green-700 hover:bg-green-800 text-white hover:scale-105"
              }`}
            >
              {isListening ? <Mic size={36} className="animate-pulse" /> : <MicOff size={32} />}
            </button>
          </div>

          {/* Status Label */}
          <div className="mb-4">
            {isListening ? (
              <p className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                Listening... Speak what you want to buy
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500">
                {transcript ? "Processing your voice search..." : "Tap the microphone to speak"}
              </p>
            )}
          </div>

          {/* Live Transcript Display */}
          {transcript ? (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-3 text-left">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                You Spoke:
              </div>
              <p className="text-sm font-semibold text-gray-900 break-words">
                &ldquo;{transcript}&rdquo;
              </p>

              {/* Automatic Translation Preview */}
              {translation && translation.isTranslated && (
                <div className="mt-3 pt-2.5 border-t border-gray-200 flex items-start gap-2 text-xs text-green-900 bg-green-50/70 p-2.5 rounded-lg">
                  <Sparkles size={15} className="text-green-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-green-800">
                      Translated to English ({translation.detectedLanguage || "Local"}):
                    </span>
                    <p className="font-extrabold text-sm text-green-950 mt-0.5">
                      &ldquo;{translation.translated}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400 space-y-1 mb-2">
              <p>Try saying in your language:</p>
              <p className="italic text-gray-600">
                &ldquo;Njagala engatto z&apos;abasajja&rdquo; • &ldquo;Emmwanyi ya Mbale&rdquo; • &ldquo;Mikeeka&rdquo;
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-xs text-red-800 flex items-start gap-2 text-left">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <button
                  onClick={startListening}
                  className="mt-1.5 text-xs font-bold text-red-700 underline hover:text-red-900"
                >
                  Tap here to try again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>

          {transcript && (
            <button
              onClick={() => {
                const target = translation?.isTranslated ? translation.translated : transcript;
                onSearch(target, transcript);
                onClose();
              }}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <span>Search Now</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
