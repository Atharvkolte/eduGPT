import React, { createContext, useContext, useState, useEffect } from "react";
import type { ChatThread, Message } from "../types/chat";

interface ChatContextType {
  threads: ChatThread[];
  activeThreadId: string | null;
  threadCounter: number;
  createNewChat: () => void;
  addMessage: (message: Message) => void;
  deleteThread: (id: string) => void;
  renameThread: (id: string, newTitle: string) => void;
  setActiveThreadId: (id: string) => void;
  activeThread: ChatThread | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};

export const ChatProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem("chat_threads");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    const savedId = localStorage.getItem("chat_active_thread_id");
    return savedId ? savedId : null;
  });

  const [threadCounter, setThreadCounter] = useState<number>(() => {
    const counter = localStorage.getItem("chat_thread_counter");
    return counter ? parseInt(counter, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("chat_threads", JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    if (activeThreadId) {
      localStorage.setItem(
        "chat_active_thread_id",
        activeThreadId
      );
    } else {
      localStorage.removeItem("chat_active_thread_id");
    }
  }, [activeThreadId]);

  useEffect(() => {
    localStorage.setItem(
      "chat_thread_counter",
      threadCounter.toString()
    );
  }, [threadCounter]);

  useEffect(() => {
    if (threads.length === 0) {
      const newId = `thread_${threadCounter}`;

      const newThread: ChatThread = {
        id: newId,
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
      };

      setThreads([newThread]);
      setActiveThreadId(newId);
    }
  }, [threads.length, threadCounter]);

  const activeThread = threads.find(
    (t) => t.id === activeThreadId
  );

  const generateTitle = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes("avl")) return "🌳 AVL Tree";
    if (lower.includes("fcfs"))
      return "⚙️ FCFS Scheduling";
    if (lower.includes("round robin"))
      return "🔄 Round Robin";
    if (lower.includes("operating system"))
      return "💻 Operating Systems";
    if (lower.includes("os"))
      return "💻 Operating Systems";
    if (lower.includes("oops"))
      return "🧩 OOP Concepts";
    if (lower.includes("oop"))
      return "🧩 OOP Concepts";
    if (lower.includes("dsa"))
      return "📚 DSA Learning";

    return (
      text.slice(0, 25) +
      (text.length > 25 ? "..." : "")
    );
  };

  const createNewChat = () => {
    if (
      activeThread &&
      activeThread.messages.length === 0
    ) {
      return;
    }

    const nextCounter = threadCounter + 1;

    const newId = `thread_${nextCounter}`;

    const newThread: ChatThread = {
      id: newId,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };

    setThreads((prev) => [newThread, ...prev]);

    setActiveThreadId(newId);
    setThreadCounter(nextCounter);
  };

  const addMessage = (message: Message) => {
    if (!activeThreadId) return;

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeThreadId) {
          const isFirstUserMessage =
            thread.messages.length === 0 &&
            message.role === "user";

          return {
            ...thread,
            messages: [...thread.messages, message],

            title: isFirstUserMessage
              ? generateTitle(message.content)
              : thread.title,
          };
        }

        return thread;
      })
    );
  };

  const deleteThread = (id: string) => {
    setThreads((prev) => {
      const filtered = prev.filter(
        (t) => t.id !== id
      );

      if (activeThreadId === id) {
        setActiveThreadId(
          filtered.length > 0
            ? filtered[0].id
            : null
        );
      }

      return filtered;
    });
  };

  const renameThread = (
    id: string,
    newTitle: string
  ) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              title: newTitle,
            }
          : thread
      )
    );
  };

  const value = {
    threads,
    activeThreadId,
    threadCounter,
    activeThread,
    createNewChat,
    addMessage,
    deleteThread,
    renameThread,
    setActiveThreadId,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};