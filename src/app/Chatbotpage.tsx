"use client";

import { useState } from "react";
import "./Chatbotpage.css";
import React from "react";
import {
  FaInbox,
  FaRegPaperPlane,
  FaFolderOpen,
  FaTrashAlt,
  FaEnvelopeOpenText,
  FaUserFriends,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaChevronDown,
  FaStar,
} from "react-icons/fa";

const Sidebar: React.FC<{ onSelect: (section: string) => void }> = ({ onSelect }) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen((prev) => !prev);
  };

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
        <h1 className="app-title">I-Send</h1>
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

      {/* User Account Section */}
      <div className="sidebar-account">
        <div
          className="user-profile" onClick={toggleAccountMenu}>
          <div className="avatar">JD</div>
          <div className="account-info">
            <p className="username">John Doe</p>
            <p className="email">johndoe@example.com</p>
          </div>
          <FaChevronDown
            className={`chevron ${isAccountMenuOpen ? "open" : ""}`} />
        </div>
        {isAccountMenuOpen && (
          <div className="account-dropdown">
          <div className="account-header">
            <div className="avatar-large">JD</div>
            <div>
              <p className="username">John Doe</p>
              <p className="email">johndoe@example.com</p>
            </div>
          </div>
          <ul className="account-options">
            <li>
              <i className="fa-solid fa-star icon"></i> Upgrade to Pro
            </li>
            <li>
              <i className="fa-solid fa-user icon"></i> Profile
            </li>
            <li>
              <i className="fa-solid fa-gear icon"></i> Settings
            </li>
            <li>
              <i className="fa-solid fa-sign-out-alt icon"></i> Log out
            </li>
          </ul>
        </div>
        
        )}
      </div>
    </div>
  );
};

const ContentSection: React.FC<{ section: string }> = ({ section }) => {
  const sections: Record<string, { title: string; content: string }> = {
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
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: "user" as const, text: input };
      setMessages((prev) => [...prev, userMessage]);

      setIsTyping(true);

      setTimeout(() => {
        const botMessage = {
          sender: "bot" as const,
          text: getBotResponse(input),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 2000);

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
      <Sidebar onSelect={(section) => setSelectedSection(section)} />

      <div className="inbox-and-chat-container">
        <ContentSection section={selectedSection} />

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
            {isTyping && (
              <div className="message bot typing-bubble">
                <div className="typing-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
          </div>
          <div className="buttons-container">
            <button className="action-button">Add Metadata</button>
            <button className="action-button">Grant Access</button>
            <button className="action-button">Check Access</button>
          </div>
          <div className="input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message I-Send"
              className="Textarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
