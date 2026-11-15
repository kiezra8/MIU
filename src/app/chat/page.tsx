"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Video,
  Paperclip,
  Smile,
  Mic,
  Send,
  CheckCheck,
  Play,
  Pause,
  Trash2,
  Shield,
  ShoppingBag,
  PhoneCall
} from "lucide-react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

interface Message {
  id: string;
  sender: "user" | "support";
  text?: string;
  voiceNote?: {
    duration: number; // in seconds
    audioWaveform: number[];
  };
  timestamp: string;
  isRead: boolean;
  orderInfo?: boolean;
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome-1",
      sender: "support",
      text: "👋 Jambo! Welcome to MIU (Made In Uganda) Live Order & Support Desk. We are here 24/7 to help you with purchases, MTN/Airtel MoMo escrow, and nationwide deliveries across Uganda.",
      timestamp: "10:00 AM",
      isRead: true,
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isRecording]);

  // Handle incoming order from cart
  useEffect(() => {
    if (orderParam) {
      try {
        const decoded = decodeURIComponent(orderParam);
        const orderMessageId = `order-${Date.now()}`;
        
        // Add user's order message
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const newMsg: Message = {
          id: orderMessageId,
          sender: "user",
          text: decoded,
          timestamp: timeStr,
          isRead: true,
          orderInfo: true,
        };

        setMessages((prev) => {
          if (prev.some((m) => m.text === decoded)) return prev;
          return [...prev, newMsg];
        });

        // Trigger automatic support confirmation
        setTimeout(() => {
          const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          setMessages((prev) => [
            ...prev,
            {
              id: `support-reply-${Date.now()}`,
              sender: "support",
              text: "✅ Order Received! Thank you for supporting Ugandan artisans & producers. 🇺🇬\n\nTo complete your order dispatch, please reply here with your:\n1. Delivery address (e.g. Kampala, Nakasero / Jinja / Mbarara)\n2. Recipient Name & Phone number for MTN / Airtel Mobile Money verification.",
              timestamp: replyTime,
              isRead: true,
            },
          ]);
        }, 1200);
      } catch (err) {
        console.error("Failed to parse order param:", err);
      }
    }
  }, [orderParam]);

  // Handle text submit
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      timestamp: timeStr,
      isRead: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    const sentText = inputText.trim();
    setInputText("");

    // Automated smart assistant response
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      let reply = "Thank you for reaching out! An MIU Uganda customer support representative has reviewed your message. We are processing your request immediately.";
      
      const lower = sentText.toLowerCase();
      if (lower.includes("delivery") || lower.includes("where")) {
        reply = "🚚 Nationwide Delivery: Orders in Kampala & Wakiso arrive within 24-48 hours. Orders to other districts (Jinja, Mbarara, Gulu, Mbale) arrive in 2-3 business days.";
      } else if (lower.includes("momo") || lower.includes("mtn") || lower.includes("airtel") || lower.includes("pay")) {
        reply = "💳 Payment is 100% secure via Escrow! You can pay using MTN Mobile Money (*165#) or Airtel Money (*185#). Funds are held safely until you receive and inspect your items.";
      } else if (lower.includes("price") || lower.includes("discount")) {
        reply = "🏷️ All prices on MIU are quoted in Ugandan Shillings (UGX). Use coupon code MIU2026 for a special promotional discount on your cart items!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `support-${Date.now()}`,
          sender: "support",
          text: reply,
          timestamp: replyTime,
          isRead: true,
        },
      ]);
    }, 1200);
  };

  // Voice Note Recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setRecordingSeconds(0);
  };

  const sendVoiceNote = () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

    const duration = Math.max(recordingSeconds, 2);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Generate random waveform heights
    const waveform = Array.from({ length: 22 }, () => Math.floor(Math.random() * 24) + 6);

    const voiceMsg: Message = {
      id: `voice-${Date.now()}`,
      sender: "user",
      voiceNote: {
        duration,
        audioWaveform: waveform,
      },
      timestamp: timeStr,
      isRead: true,
    };

    setMessages((prev) => [...prev, voiceMsg]);
    setRecordingSeconds(0);

    // Support acknowledges voice note
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          id: `support-vn-${Date.now()}`,
          sender: "support",
          text: "🎙️ Voice note received and reviewed by the MIU team! We will confirm your order details shortly.",
          timestamp: replyTime,
          isRead: true,
        },
      ]);
    }, 1500);
  };

  // Playback simulated voice note audio
  const togglePlayVoice = (id: string, duration: number) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    } else {
      setPlayingVoiceId(id);
      
      // Beep sound with Web Audio API for tactile feedback
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch {
        // audio context fallback
      }

      playbackTimerRef.current = setTimeout(() => {
        setPlayingVoiceId(null);
      }, duration * 1000);
    }
  };

  // WhatsApp Simulated Call
  const handleStartCall = () => {
    setShowCallModal(true);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleEndCall = () => {
    setShowCallModal(false);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallDuration(0);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#0b141a] sm:bg-gray-100 flex flex-col justify-between">
      {/* Container */}
      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col bg-[#efeae2] shadow-2xl relative overflow-hidden pb-16 sm:pb-20">
        
        {/* ── WhatsApp Green Top Header (#075E54) ── */}
        <header className="sticky top-0 z-30 bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-1 hover:bg-black/15 rounded-full transition text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Profile Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/30 flex-shrink-0">
              <Image
                src="https://i.pinimg.com/736x/c1/cc/02/c1cc02f175e369f50d77444ffef96df7.jpg"
                alt="MIU Orders Desk"
                fill
                className="object-cover"
              />
            </div>

            {/* Contact Title & Status */}
            <div className="cursor-pointer" onClick={() => router.push("/")}>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm sm:text-base leading-tight">
                  MIU Support & Orders
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span>online</span>
                <span>•</span>
                <span>Official Ugandan Desk 🇺🇬</span>
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 text-white">
            <button
              onClick={handleStartCall}
              className="p-1.5 hover:bg-black/15 rounded-full transition"
              title="Voice Call"
            >
              <Phone size={19} />
            </button>
            <button
              onClick={handleStartCall}
              className="p-1.5 hover:bg-black/15 rounded-full transition hidden xs:block"
              title="Video Call"
            >
              <Video size={20} />
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="p-1.5 hover:bg-black/15 rounded-full transition"
              title="Cart"
            >
              <ShoppingBag size={19} />
            </button>
          </div>
        </header>

        {/* ── Chat Messages Stream Area with WhatsApp Wallpaper Pattern ── */}
        <div
          className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 min-h-[60vh] max-h-[75vh]"
          style={{
            backgroundColor: "#efeae2",
            backgroundImage: `radial-gradient(#d1d7db 0.75px, transparent 0.75px)`,
            backgroundSize: "20px 20px",
          }}
        >
          {/* WhatsApp Security Pill */}
          <div className="flex justify-center my-2">
            <div className="bg-[#ffeecd] text-[#54656f] text-[11px] px-3 py-1.5 rounded-lg shadow-2xs max-w-xs text-center flex items-center gap-1.5 leading-snug border border-[#f5d99b]">
              <Shield size={14} className="text-[#075e54] shrink-0" />
              <span>
                Messages and orders are end-to-end encrypted with MIU verified escrow.
              </span>
            </div>
          </div>

          {/* Date separator */}
          <div className="flex justify-center my-2">
            <span className="bg-[#ffffff]/80 text-[#54656f] text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs uppercase tracking-wider backdrop-blur-xs">
              TODAY
            </span>
          </div>

          {/* Message List */}
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-2.5 sm:p-3 shadow-2xs text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-xs"
                      : "bg-[#ffffff] text-[#111b21] rounded-tl-xs"
                  }`}
                >
                  {/* Sender label for support */}
                  {!isUser && (
                    <div className="flex items-center gap-1 text-[11px] font-black text-[#008069] mb-1">
                      <span>MIU Agent • Kampala HQ</span>
                    </div>
                  )}

                  {/* Text content with whitespace preserve for order format */}
                  {msg.text && (
                    <div className="whitespace-pre-line font-normal break-words text-[13px] sm:text-sm">
                      {msg.text}
                    </div>
                  )}

                  {/* Voice Note Bubble */}
                  {msg.voiceNote && (
                    <div className="flex items-center gap-2.5 py-1 min-w-[210px] sm:min-w-[240px]">
                      {/* Play/Pause round button */}
                      <button
                        onClick={() => togglePlayVoice(msg.id, msg.voiceNote!.duration)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-xs shrink-0 ${
                          playingVoiceId === msg.id
                            ? "bg-[#075E54] text-white"
                            : "bg-[#00a884] text-white hover:bg-[#075E54]"
                        }`}
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause size={17} />
                        ) : (
                          <Play size={17} className="ml-0.5" />
                        )}
                      </button>

                      {/* Waveform graphic */}
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {msg.voiceNote.audioWaveform.map((height, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              playingVoiceId === msg.id
                                ? "bg-[#00a884] animate-pulse"
                                : "bg-[#8696a0]"
                            }`}
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>

                      {/* Mic icon & duration */}
                      <div className="flex flex-col items-end shrink-0">
                        <Mic size={14} className="text-[#00a884] mb-0.5" />
                        <span className="text-[10px] text-[#667781] font-mono">
                          {formatTimer(msg.voiceNote.duration)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Double Blue Ticks */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#667781] float-right">
                    <span>{msg.timestamp}</span>
                    {isUser && (
                      <CheckCheck size={14} className="text-[#53bdeb] stroke-[2.5]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* ── WhatsApp Bottom Input Bar ── */}
        <div className="sticky bottom-0 z-30 bg-[#f0f2f5] p-2 border-t border-gray-200">
          {/* Voice recording active mode */}
          {isRecording ? (
            <div className="flex items-center justify-between bg-white rounded-full px-4 py-2.5 shadow-sm border border-red-200 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                <span className="text-xs font-bold text-red-600">Recording Audio...</span>
                <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                  {formatTimer(recordingSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={cancelRecording}
                  className="p-1.5 text-gray-500 hover:text-red-600 transition"
                  title="Discard Voice Note"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={sendVoiceNote}
                  className="p-2 bg-[#00a884] hover:bg-[#075E54] text-white rounded-full transition shadow-xs"
                  title="Send Voice Note"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Normal typing mode */
            <form onSubmit={handleSendText} className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex-1 flex items-center bg-white rounded-full px-3 py-1.5 border border-gray-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setInputText((prev) => prev + " 🇺🇬 ")}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Add Flag"
                >
                  <Smile size={20} />
                </button>

                <input
                  type="text"
                  placeholder="Type a message or order details..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-gray-900 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + " [Confirmed Delivery Address: Kampala, Uganda] ");
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Attach address"
                >
                  <Paperclip size={18} />
                </button>
              </div>

              {/* Dynamic Mic or Send Button */}
              {inputText.trim().length > 0 ? (
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#075E54] text-white flex items-center justify-center transition shadow-sm shrink-0 active:scale-95"
                  title="Send Message"
                >
                  <Send size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#075E54] text-white flex items-center justify-center transition shadow-sm shrink-0 active:scale-95 group"
                  title="Hold/Tap to record voice note"
                >
                  <Mic size={19} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
            </form>
          )}

          {/* Quick reply shortcuts */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 px-1 text-[11px]">
            <button
              onClick={() => setInputText("How do I pay with MTN Mobile Money?")}
              className="bg-white border border-gray-300 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:border-[#00a884] transition"
            >
              💳 MTN MoMo
            </button>
            <button
              onClick={() => setInputText("How does Airtel Money escrow work?")}
              className="bg-white border border-gray-300 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:border-[#00a884] transition"
            >
              🔴 Airtel Money
            </button>
            <button
              onClick={() => setInputText("How long does delivery take to my district?")}
              className="bg-white border border-gray-300 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:border-[#00a884] transition"
            >
              🚚 Delivery Time
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="bg-white border border-green-600 text-green-700 font-bold px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-green-50 transition"
            >
              🛒 View Cart
            </button>
          </div>
        </div>

      </div>

      {/* ── WhatsApp Voice Call Modal Simulation ── */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-[#075E54]/95 flex flex-col items-center justify-between py-12 px-6 text-white backdrop-blur-sm animate-in fade-in">
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-emerald-300">
              WhatsApp Audio Call • MIU Escrow
            </span>
            <h3 className="text-2xl font-black mt-2">MIU Customer Support</h3>
            <p className="text-emerald-100 text-sm mt-1">
              Connected • {formatTimer(callDuration)}
            </p>
          </div>

          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl animate-pulse">
            <Image
              src="https://i.pinimg.com/736x/c1/cc/02/c1cc02f175e369f50d77444ffef96df7.jpg"
              alt="MIU Rep"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-center gap-6">
            <p className="text-xs text-emerald-100 text-center max-w-xs">
              Call in progress. Our Kampala operations agent is assisting you with your order.
            </p>

            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition active:scale-95"
              title="End Call"
            >
              <PhoneCall size={28} className="rotate-135" />
            </button>
          </div>
        </div>
      )}

      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#efeae2] flex items-center justify-center text-xs text-gray-500">Connecting to MIU Chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
