import React, { useState, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useChat } from "../context/ChatContext";
import { useNotification } from "../context/NotificationContext";
import SpeechToText from "../components/speechToText";
import FCFSVisualizer from "../components/visualizers/FCFSVisualizer";
import RoundRobinVisualizer from "../components/visualizers/RoundRobinVisualizer";
import AVLVisualizer from "../components/visualizers/AVLVisualizer";

import "../styles/MainContent.css";

const IMAGE_SERVER = "http://localhost:4000/";

const MainContent: React.FC = () => {
  const { activeThread, addMessage } = useChat();
  const { showNotification } = useNotification();

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualizer, setActiveVisualizer] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") return;

    const today = new Date().toISOString().split("T")[0];

    const events = JSON.parse(localStorage.getItem("calendar_events") || "[]");
    const todayEvent = events.find((e: any) => e.date === today);

    if (todayEvent) {
      showNotification(todayEvent.topic, "info");
    }
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !activeThread || isLoading) return;

    const uText = inputText.trim().toLowerCase();

    addMessage({
      role: "user",
      content: uText,
    });

    setInputText("");
    setIsLoading(true);
    setActiveVisualizer(null);

    try {
      const numericId = parseInt(activeThread.id.replace("thread_", ""), 10);

      const payload = {
        message: uText,
        thread_id: isNaN(numericId) ? 0 : numericId,
      };

      const [chatResult, searchResult] = await Promise.allSettled([
        axios.post("/chat", payload),
        axios.post("/search-images", { query: uText, top_k: 2 }),
      ]);

      let aiText = "Received empty response";
      let imagePaths: string[] = [];

      if (chatResult.status === "fulfilled" && chatResult.value.data) {
        const data = chatResult.value.data;

        aiText =
          typeof data === "string"
            ? data
            : data.response ||
              data.message ||
              data.answer ||
              data.result ||
              data.content ||
              JSON.stringify(data, null, 2);
      } else {
        aiText = "Chat server error.";
      }

      if (searchResult.status === "fulfilled" && searchResult.value.data) {
        try {
          const searchData =
            typeof searchResult.value.data === "string"
              ? JSON.parse(searchResult.value.data)
              : searchResult.value.data;

          if (searchData?.results) {
            imagePaths = searchData.results
              .filter((r: any) => r.image_url)
              .map((r: any) =>
                r.image_url.startsWith("http")
                  ? r.image_url
                  : `${IMAGE_SERVER}${r.image_url}`
              );
          }
        } catch (err) {
          console.error("Image parsing error:", err);
        }
      }

      addMessage({
        role: "ai",
        content: aiText,
        images: imagePaths.length > 0 ? imagePaths : undefined,
      });

      if (uText.includes("fcfs")) {
        setActiveVisualizer("fcfs");
      } else if (uText.includes("round robin") || uText.includes("rr")) {
        setActiveVisualizer("rr");
      } else if (uText.includes("avl")) {
        setActiveVisualizer("avl");
      } else {
        setActiveVisualizer(null);
      }

    } catch (error) {
      addMessage({
        role: "ai",
        content: "Sorry, I could not reach the server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const quickPrompts = [
  "Explain AVL Tree",
  "What is FCFS Scheduling?",
  "Teach me OOP Concepts",
  "Explain Operating System",
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
  };
  return (
    <div className="main-content">
      <div className="answer-card">
        {activeThread?.messages?.length ? (
          activeThread.messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.role}`}>
              <div className={`message-bubble ${msg.role}`}>

                {msg.images && (
                  <div className="image-container">
                    {msg.images.map((img, i) => (
                      <img key={i} src={img} alt="study" className="chat-image" />
                    ))}
                  </div>
                )}

                {msg.role === "user" ? (
                  <span>{msg.content}</span>
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="welcome-state">
  <h2>👋 Welcome to StudyAntra</h2>

  <p>
    Learn concepts, solve doubts, and visualize algorithms
    with AI assistance.
  </p>

    <div className="quick-prompts">
      {quickPrompts.map((prompt) => (
        <button
          key={prompt}
          className="prompt-card"
          onClick={() => handleQuickPrompt(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  </div>
        )}

        {isLoading && (
          <div className="message-wrapper ai">
            <div className="loading-bubble">Thinking...</div>
          </div>
        )}

        {activeVisualizer && !isLoading && (
          <div className="visualizer-wrapper">
            {activeVisualizer === "fcfs" && <FCFSVisualizer />}
            {activeVisualizer === "rr" && <RoundRobinVisualizer />}
            {activeVisualizer === "avl" && <AVLVisualizer />}
          </div>
        )}
      </div>

      <div className="input-container">
  <div className="input-wrapper">
    <input
      type="text"
      placeholder="Ask anything about DSA, OOP, OS..."
      className="input-field"
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
    />

    <SpeechToText setInputText={setInputText} />

      <button
          className="send-btn"
          onClick={handleSend}
          disabled={
            isLoading ||
            !inputText.trim()
          }
        >
        <SendHorizontal size={18} strokeWidth={2} />
        </button>
    </div>
  </div>
</div>
  );
};

export default MainContent;