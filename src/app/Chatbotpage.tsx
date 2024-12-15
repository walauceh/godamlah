"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import "./Chatbotpage.css";
import React from 'react';
import { FaInbox, FaRegPaperPlane, FaFolderOpen, FaTrashAlt, FaEnvelopeOpenText, FaUserFriends } from 'react-icons/fa';


const Sidebar: React.FC<{ onSelect: (section: string) => void }> = ({ onSelect }) => {
  const sections = [
    { name: "Inbox", icon: <FaInbox />, count: 128 },
    { name: "Drafts", icon: <FaEnvelopeOpenText />, count: 9 },
    { name: "Sent", icon: <FaRegPaperPlane /> },
    { name: "Junk", icon: <FaTrashAlt />, count: 23 },
    { name: "Archive", icon: <FaFolderOpen /> },
    { name: "Social", icon: <FaUserFriends />, count: 972 },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">I-Send</h1> {/* Title added here */}
      </div>
      <div className="user-profile">
        <div className="avatar">AC</div>
        <h3>John Doe</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {sections.map((section) => (
            <li
              key={section.name}
              className="sidebar-item"
              onClick={() => onSelect(section.name)}
            >
              <a href="#" className="sidebar-link">
                <div className="icon">{section.icon}</div>
                <span>{section.name}</span>
                {section.count !== undefined && (
                  <span className="count">{section.count}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};



const ContentSection: React.FC<{ section: string }> = ({ section }) => {
  const sections: Record<
    string,
    { title: string; content: string }
  > = {
    Inbox: { title: "Inbox", content: "Displaying Inbox Items..." },
    Drafts: { title: "Drafts", content: "Displaying Draft Items..." },
    Sent: { title: "Sent", content: "Displaying Sent Items..." },
    Junk: { title: "Junk", content: "Displaying Junk Items..." },
    Archive: { title: "Archive", content: "Displaying Archive Items..." },
    Social: { title: "Social", content: "Displaying Social Items..." },
  };

  const currentSection = sections[section];

  return currentSection ? (
    <div className={`${section.toLowerCase()}-section`}>
      <h2>{currentSection.title}</h2>
      <div className={`${section.toLowerCase()}-list`}>
        <div>{currentSection.content}</div>
      </div>
    </div>
  ) : (
    <div className="default-section">
      <h2>Welcome</h2>
      <p>Please select a section from the sidebar.</p>
    </div>
  );
};


export default function ChatBotPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [selectedSection, setSelectedSection] = useState("Inbox");

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
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-app">
      {/* Sidebar */}
      <Sidebar onSelect={(section) => setSelectedSection(section)} />

      {/* Main content */}
      <div className="inbox-and-chat-container">
        {/* Content Section */}
        <ContentSection section={selectedSection} />
        
        {/* Chat Container */}
        <div className="chat-container">
          <header className="chat-header">What can I help with?</header>
          <div className="messages">
            {messages.length === 0 ? (
              <div className="instructions">
                <p>Welcome to I-Send!</p>
                <p>Here’s how you can use this chatbot:</p>
                <ul>
                  <li>Type <b>hello</b> to start the conversation.</li>
                  <li>Ask for <b>help</b> to get assistance.</li>
                  <li>Say <b>bye</b> to end the chat.</li>
                </ul>

                <p>Start typing in the text box below to begin!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))
            )}
          </div>

          {/* Buttons Section */}
          <div className="buttons-container">
            <button className="action-button">Add Metadata</button>
            <button className="action-button">Grant Access</button>
            <button className="action-button">Check Access</button>
          </div>

          <div className="input-container">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Handle Enter key
              placeholder="Message I-Send"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

