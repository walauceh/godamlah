"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import "./Chatbotpage.css";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: "user" as const, text: input };
      setMessages((prev) => [...prev, userMessage]);

      const botMessage = {
        sender: "bot" as const,
        text: getBotResponse(input),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
      }, 500);

      setInput("");
    }
  };

  const getBotResponse = (message: string): string => {
    const responses: Record<string, string> = {
      hello: "Hi there! How can I assist you?",
      help: "Sure, I'm here to help! What do you need?",
      bye: "Goodbye! Have a great day!",
    };
    return responses[message.toLowerCase()] || "I'm sorry, I don't understand.";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent a new line in the textarea
      handleSend();
    }
  };

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <h2>I-Send 1.0</h2>
        <ul>
          <li>New chat</li>
          <li>Previous Chats</li>
          <li>View Plans</li>
        </ul>
      </aside>
      <main className="chat-container">
        <header className="chat-header">What can I help with?</header>
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Handle Enter key
            placeholder="Message I-Send"
          />
        </div>  
      </main>
    </div>
  );
}
