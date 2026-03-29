"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { WishoniaNarrator } from "@/lib/widget/components/WishoniaNarrator";
import type { Expression } from "@/lib/widget/types";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTTS } from "@/hooks/useTTS";
import { useVoiceMode } from "@/hooks/useVoiceMode";
import { ChatMessage } from "@/components/ChatMessage";

const WELCOME = "Hello. I have been running my planet for 4,237 years. I ended war in year 12. Your species is still arguing about it. Ask me anything.";

const HINTS = [
  "What is the 1% Treaty?",
  "How do Incentive Alignment Bonds work?",
  "What is Wishocracy?",
  "Why does the FDA take so long?",
];

function extractExpression(text: string): { expression: Expression; cleanText: string } {
  const match = text.match(/\[expression:(\w+)\]/);
  const expression = (match?.[1] ?? "happy") as Expression;
  const cleanText = text.replace(/\[expression:\w+\]/g, "").trim();
  return { expression, cleanText };
}

/** SVG send arrow icon */
function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/** SVG stop square icon */
function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

export default function ChatPage(): React.JSX.Element {
  const [input, setInput] = useState("");
  const [currentSpeech, setCurrentSpeech] = useState(WELCOME);
  const [expression, setExpression] = useState<Expression>("neutral");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);

  const chat = useStreamingChat();
  const tts = useTTS();

  // Use refs to break circular dependency between voiceMode ↔ voiceInput
  const voiceModeRef = useRef<{ isActive: boolean; handleVoiceResult: (t: string) => void }>({
    isActive: false, handleVoiceResult: () => {},
  });

  const voiceResultHandler = useCallback((transcript: string) => {
    if (voiceModeRef.current.isActive) {
      voiceModeRef.current.handleVoiceResult(transcript);
    } else {
      setInput(transcript);
    }
  }, []);

  const voiceInput = useVoiceInput(voiceResultHandler);

  const voiceMode = useVoiceMode({
    sendMessage: chat.sendMessage,
    startListening: voiceInput.startListening,
    stopListening: voiceInput.stopListening,
    playTTS: tts.play,
    stopTTS: tts.stop,
    isStreaming: chat.isStreaming,
  });

  // Keep ref in sync so the callback always sees current state
  useEffect(() => {
    voiceModeRef.current = { isActive: voiceMode.isActive, handleVoiceResult: voiceMode.handleVoiceResult };
  }, [voiceMode.isActive, voiceMode.handleVoiceResult]);

  useEffect(() => { chat.initChats(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  // Auto-scroll
  useEffect(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat.messages.length, chat.streamingText]);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    userScrolledUpRef.current = !atBottom;
    setShowScrollBtn(!atBottom);
  }, []);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    userScrolledUpRef.current = false;
    setShowScrollBtn(false);
  }

  // Update expression from completed messages
  useEffect(() => {
    if (!chat.isStreaming && chat.messages.length > 0) {
      const lastMsg = chat.messages[chat.messages.length - 1];
      if (lastMsg?.role === "wishonia") {
        const { expression: expr, cleanText } = extractExpression(lastMsg.text);
        setExpression(expr);
        setCurrentSpeech(cleanText);
      }
    }
  }, [chat.isStreaming, chat.messages]);

  useEffect(() => {
    if (chat.isStreaming) setExpression("thinking");
  }, [chat.isStreaming]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || chat.isStreaming) return;
    setInput("");
    userScrolledUpRef.current = false;
    if (!hasInteracted.current) { hasInteracted.current = true; setShowSpeechBubble(false); }
    const response = await chat.sendMessage(msg);
    if (response) {
      const { expression: expr, cleanText } = extractExpression(response);
      setExpression(expr);
      setCurrentSpeech(cleanText);
    }
  }

  function handleSelectChat(id: string) {
    chat.handleSelectChat(id);
    const selected = chat.chats.find((c) => c.id === id);
    const lastWishonia = [...(selected?.messages ?? [])].reverse().find((m) => m.role === "wishonia");
    if (lastWishonia) {
      const { expression: expr, cleanText } = extractExpression(lastWishonia.text);
      setExpression(expr);
      setCurrentSpeech(cleanText);
    }
    setSidebarOpen(false);
  }

  function handleNewChat() {
    chat.handleNewChat();
    setCurrentSpeech(WELCOME);
    setExpression("neutral");
    setSidebarOpen(false);
    setShowSpeechBubble(true);
    hasInteracted.current = false;
  }

  function handleMicClick() {
    if (voiceMode.isActive) {
      voiceMode.toggle(); // stop voice mode
    } else if (voiceInput.isListening) {
      voiceInput.stopListening();
    } else {
      voiceMode.toggle(); // start voice mode
      if (!hasInteracted.current) { hasInteracted.current = true; setShowSpeechBubble(false); }
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0d0d0d", color: "#ececec", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>

      {/* Hamburger toggle — ALWAYS visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hamburger-btn"
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 30,
          background: "rgba(20,10,30,0.8)", border: "1px solid rgba(54,226,248,0.2)",
          borderRadius: 6, color: "#C6CBF5", fontSize: 18, cursor: "pointer",
          padding: "5px 9px",
        }}
      >
        &#9776;
      </button>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 19 }}
        />
      )}

      {/* Sidebar — collapsed by default, slides in */}
      <div
        style={{
          width: sidebarOpen ? 260 : 0, background: "#111",
          borderRight: sidebarOpen ? "1px solid rgba(54,226,248,0.1)" : "none",
          display: "flex", flexDirection: "column", flexShrink: 0, zIndex: 20,
          overflow: "hidden", transition: "width 0.2s",
          position: "fixed", left: 0, top: 0, bottom: 0,
        }}
      >
        <div style={{ padding: 12, borderBottom: "1px solid rgba(54,226,248,0.1)", minWidth: 260 }}>
          <button
            onClick={handleNewChat}
            style={{
              width: "100%", padding: "10px 16px",
              background: "rgba(209,0,177,0.15)", border: "1px solid rgba(209,0,177,0.3)",
              borderRadius: 8, color: "#C6CBF5", cursor: "pointer",
              fontSize: 14, fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.05em",
            }}
          >
            + New Chat
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0", minWidth: 260 }}>
          {chat.chats.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectChat(c.id)}
              className="chat-list-item"
              style={{
                padding: "10px 16px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderLeft: c.id === chat.activeChatId ? "3px solid #d100b1" : "3px solid transparent",
                background: c.id === chat.activeChatId ? "rgba(209,0,177,0.08)" : "transparent",
                color: c.id === chat.activeChatId ? "#ececec" : "#999",
              }}
            >
              <span style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                {c.title}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); chat.handleDeleteChat(c.id); }}
                className="chat-delete-btn"
                style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: "0 4px", flexShrink: 0, opacity: 0 }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minWidth: 0 }}>
        {/* Background gradient */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center bottom, rgba(127,0,173,0.15) 0%, transparent 60%)" }} />

        {/* Header */}
        <header style={{
          padding: "10px 20px", background: "rgba(20,10,30,0.95)",
          borderBottom: "1px solid rgba(54,226,248,0.15)",
          display: "flex", justifyContent: "center", alignItems: "center",
          position: "relative", zIndex: 1, flexShrink: 0,
        }}>
          <h1 style={{
            fontSize: 13, fontWeight: 700, margin: 0,
            fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "linear-gradient(90deg, #C6CBF5, #d100b1)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            ARGUE WITH WISHONIA
          </h1>
          <div style={{ position: "absolute", right: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <button
              onClick={handleNewChat}
              title="New Chat"
              style={{
                background: "none", border: "none", color: "#C6CBF5",
                cursor: "pointer", fontSize: 16, opacity: 0.7, padding: 0,
              }}
            >
              +
            </button>
            <a href="/embed" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>Embed &rarr;</a>
          </div>
        </header>

        {/* Chat area (messages + floating character) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflowY: "auto", padding: "24px 16px" }}
          >
            {/* Welcome + hint buttons */}
            {chat.messages.length === 0 && (
              <div style={{ color: "#888", padding: "60px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 24px" }}>
                  {WELCOME}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {HINTS.map((hint) => (
                    <button
                      key={hint}
                      onClick={() => handleSend(hint)}
                      style={{
                        background: "rgba(20,10,40,0.6)", color: "#C6CBF5",
                        border: "1px solid rgba(54,226,248,0.2)", borderRadius: 8,
                        padding: "8px 14px", fontSize: 14, cursor: "pointer",
                      }}
                      className="hint-btn"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chat.messages.map((msg, i) => {
              // Show persisted visuals for completed messages, or pending for the latest
              const isLastWishonia = msg.role === "wishonia" && i === chat.messages.length - 1;
              const visuals = chat.getVisualsForMessage(i) ?? (isLastWishonia ? chat.pendingVisuals : null);
              return (
                <ChatMessage
                  key={i}
                  role={msg.role}
                  text={msg.text}
                  visuals={visuals}
                  onPlayTTS={tts.play}
                  isTTSPlaying={tts.isPlaying}
                />
              );
            })}

            {/* Streaming message */}
            {chat.isStreaming && chat.streamingText && (
              <ChatMessage role="wishonia" text={chat.streamingText} isStreaming />
            )}

            {/* Thinking indicator */}
            {chat.isStreaming && !chat.streamingText && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
                <div className="thinking-indicator" style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: "rgba(209,0,177,0.07)", border: "1px solid rgba(209,0,177,0.15)",
                  color: "#888", fontSize: 14, display: "flex", alignItems: "center", gap: 10,
                }}>
                  {/* Brain animation */}
                  <div className="brain-icon">
                    <div className="brain-ring ring1" />
                    <div className="brain-ring ring2" />
                    <div className="brain-ring ring3" />
                  </div>
                  <span>thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Scroll-to-bottom button */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              style={{
                position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)",
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(20,10,30,0.9)", color: "#C6CBF5",
                border: "1px solid rgba(54,226,248,0.2)",
                cursor: "pointer", zIndex: 10, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              ↓
            </button>
          )}

          {/* Listening indicator — red pulsing ring */}
          {voiceInput.isListening && (
            <div className="listening-ring" style={{
              position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)",
              zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "3px solid #d9534f",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "listenPulse 1.5s ease-in-out infinite",
              }}>
                <span style={{ fontSize: 20 }}>🎤</span>
              </div>
              <span style={{ fontSize: 12, color: "#d9534f", fontWeight: 600 }}>Listening...</span>
            </div>
          )}

          {/* Floating character — bottom right, above input */}
          <div style={{
            position: "absolute", right: 20, bottom: 8, zIndex: 4,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}
            className="character-float"
          >
            {/* Speech bubble */}
            {showSpeechBubble && (
              <div className="speech-bubble" style={{
                background: "rgba(30,30,40,0.92)", color: "#C6CBF5",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
                padding: "8px 14px", fontSize: 14, whiteSpace: "nowrap",
                marginBottom: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                position: "relative",
              }}>
                click me to argue by voice
                <div style={{
                  position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
                  borderTop: "7px solid rgba(30,30,40,0.92)",
                }} />
              </div>
            )}
            <div onClick={handleMicClick} style={{ cursor: "pointer" }}>
              <WishoniaNarrator
                tokenEndpoint="/api/gemini-live-token"
                text={currentSpeech}
                expression={expression}
                bodyPose={chat.isStreaming ? "thinking" : "presenting"}
                size={140}
                position="custom"
                style={{ position: "relative" }}
                muted={!voiceMode.isActive}
              />
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div style={{
          padding: "12px 20px",
          background: "rgba(20,10,30,0.95)",
          borderTop: "1px solid rgba(54,226,248,0.15)",
          position: "relative", zIndex: 25, flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Text input — rounded pill */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={voiceInput.isListening ? "Listening..." : "Ask Wishonia anything..."}
              disabled={chat.isStreaming}
              className="chat-input"
              style={{
                flex: 1, padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12, color: "#ececec", fontSize: 15, outline: "none",
                minHeight: 38,
              }}
            />

            {/* Voice button — circular, between input and send */}
            {voiceInput.isSupported && (
              <button
                onClick={handleMicClick}
                title={voiceMode.isActive ? "Stop voice mode" : "Voice input"}
                style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: 16, border: "none",
                  background: voiceMode.isActive ? "#28a745" : "rgba(255,255,255,0.06)",
                  color: voiceMode.isActive ? "#fff" : "#C6CBF5",
                  boxShadow: voiceMode.isActive ? "0 0 0 3px rgba(40,167,69,0.3)" : "none",
                }}
                className={voiceMode.isActive ? "voice-active" : ""}
              >
                🎤
              </button>
            )}

            {/* Send/Stop button — circular */}
            <button
              onClick={() => chat.isStreaming ? chat.stopStreaming() : handleSend()}
              disabled={!chat.isStreaming && !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: (!chat.isStreaming && !input.trim()) ? "not-allowed" : "pointer",
                border: "none",
                background: chat.isStreaming ? "rgba(255,255,255,0.06)" : "#d100b1",
                color: chat.isStreaming ? "#C6CBF5" : "#fff",
                opacity: (!chat.isStreaming && !input.trim()) ? 0.5 : 1,
              }}
            >
              {chat.isStreaming ? <StopIcon /> : <SendIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        /* Hint buttons hover */
        .hint-btn:hover {
          border-color: #d100b1 !important;
          background: rgba(209,0,177,0.08) !important;
        }

        /* Hamburger hover */
        .hamburger-btn:hover {
          background: rgba(209,0,177,0.2) !important;
          border-color: rgba(209,0,177,0.4) !important;
        }

        /* Chat list item hover */
        .chat-list-item:hover { background: rgba(255,255,255,0.04) !important; color: #ccc !important; }
        .chat-list-item:hover .chat-delete-btn { opacity: 1 !important; }
        .chat-list-item:hover .chat-delete-btn:hover { color: #ff4444 !important; }

        /* Input focus */
        .chat-input:focus {
          border-color: rgba(209,0,177,0.5) !important;
          box-shadow: 0 0 0 2px rgba(209,0,177,0.15) !important;
        }
        .chat-input::placeholder { color: #666; }

        /* Voice pulse */
        .voice-active { animation: voicePulse 1.5s ease-in-out infinite; }
        @keyframes voicePulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(40,167,69,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(40,167,69,0.1); }
        }

        /* Listening indicator pulse */
        @keyframes listenPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(217,83,79,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(217,83,79,0.1); }
        }

        /* Speech bubble bob */
        .speech-bubble { animation: bubbleBob 2s ease-in-out infinite; }
        @keyframes bubbleBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* Brain thinking animation */
        .brain-icon {
          width: 20px; height: 20px; position: relative;
        }
        .brain-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid transparent;
        }
        .ring1 { border-top-color: #d100b1; animation: brainSpin 1.2s linear infinite; }
        .ring2 { border-right-color: #36E2F8; animation: brainSpin 1.8s linear infinite reverse; inset: 2px; }
        .ring3 { border-bottom-color: #C6CBF5; animation: brainSpin 0.9s linear infinite; inset: 4px; }
        @keyframes brainSpin { to { transform: rotate(360deg); } }

        /* Slide-in for messages */
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* Markdown styles */
        .chat-markdown p { margin: 0 0 8px 0; }
        .chat-markdown p:last-child { margin-bottom: 0; }
        .chat-markdown strong { color: #ececec; }
        .chat-markdown a { color: #36E2F8; text-decoration: underline; }
        .chat-markdown a:hover { color: #d100b1; }
        .chat-markdown .chat-codeblock {
          background: rgba(255,255,255,0.06); padding: 8px 10px; margin: 8px 0;
          overflow-x: auto; font-size: 12px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          border-radius: 6px; color: #ccc;
        }
        .chat-markdown .chat-inline-code {
          background: rgba(255,255,255,0.08); padding: 1px 4px; border-radius: 3px;
          font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px; color: #ddd;
        }
        .chat-markdown .chat-h3 { font-size: 15px; font-weight: 700; color: #36E2F8; margin: 12px 0 6px; }
        .chat-markdown .chat-h4 { font-size: 14px; font-weight: 700; color: #C6CBF5; margin: 10px 0 4px; }
        .chat-markdown .chat-blockquote {
          border-left: 3px solid #d100b1; padding: 4px 10px;
          color: #999; margin: 8px 0; font-style: italic;
        }
        .chat-markdown .chat-list { margin: 6px 0; padding-left: 20px; }
        .chat-markdown .chat-list li { margin: 2px 0; }
        .chat-markdown .chat-latex-pending { font-family: 'SFMono-Regular', monospace; font-size: 13px; color: #d100b1; }
        .chat-markdown .chat-latex-display { display: block; text-align: center; margin: 8px 0; }

        /* Mobile: hide floating character on small screens */
        @media (max-width: 800px) {
          .character-float { display: none !important; }
        }
      `}</style>
    </div>
  );
}
