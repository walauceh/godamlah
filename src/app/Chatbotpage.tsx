"use client";

import { JSX, useEffect, useState } from "react";
import "./Chatbotpage.css";
import React from "react";
import { GoogleGenerativeAI } from '@google/generative-ai';
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
    { name: "Inbox", icon: <FaInbox />, count: 2 },
    { name: "Drafts", icon: <FaEnvelopeOpenText /> },
    { name: "Sent", icon: <FaRegPaperPlane /> },
    { name: "Junk", icon: <FaTrashAlt />},
    { name: "Archive", icon: <FaFolderOpen /> },
    { name: "Social", icon: <FaUserFriends />, count: 3 },
  ];

  return (
    <div className="main-container">
      <div className={`sidebar ${isAccountMenuOpen ? "open" : ""}`}>
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
          <div className="user-profile" onClick={toggleAccountMenu}>
            <div className="account-info">
              <p className="username">John Doe</p>
              <p className="email">johndoe@example.com</p>
            </div>
            <FaChevronDown className={`chevron ${isAccountMenuOpen ? "open" : ""}`} />
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

      <div className="content">
        {/* Content Section */}
      </div>
    </div>
  );
};

interface SectionProps {
  section: string;
}

const ContentSection: React.FC<SectionProps> = ({ section }) => {
  const inboxData = [
    {
      sender: "William Smith",
      subject: "Meeting Tomorrow",
      versionHistory: [
        { date: "16 days ago", version: "Completed", user: "Benson" },
        { date: "Jun 7, 11:57 AM", version: "Ready for dev", user: "Benson" },
        { date: "Jun 3, 12:10 PM", version: "Updated font properties", user: "Oscar" },
        { date: "20 days ago", version: "Ready for dev", user: "Oscar" },
      ]
    },
    {
      sender: "Alice Smith",
      subject: "Re: Project Update",
      versionHistory: [
        { date: "15 days ago", version: "Reviewed and confirmed", user: "Alice" },
        { date: "Jun 5, 9:30 AM", version: "Initial Draft", user: "Alice" },
      ]
    },
  ];

  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverContent, setPopoverContent] = useState<JSX.Element | string>('');
  const [popoverPosition, setPopoverPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });

  const handleEmailClick = (event: React.MouseEvent<HTMLDivElement>, versionHistory: Array<{ date: string, version: string, user: string }>) => {
    setPopoverPosition({ top: 0, left: 0 }); // Set to zero since it's no longer position-relative to the element clicked

    // Create version history content
    const versionHistoryContent = (
      <div className="version-history-popover">
        <div className="popover-header">
          <span>Version history</span>
          <button className="share-button">Share</button>
        </div>
        <div className="version-timeline">
          {versionHistory.map((entry, index) => (
            <div key={index} className="version-item">
              <div className="version-status">
                <span>{entry.version}</span>
                <span className="version-user">- {entry.user}</span>
              </div>
              <div className="version-date">{entry.date}</div>
            </div>
          ))}
        </div>
        <div className="show-older">
          <button>Show older</button>
        </div>
        {/* Close button moved inside the popover */}
        <button className="close-popover" onClick={handleClosePopover}>Close</button>
      </div>
    );

    setPopoverContent(versionHistoryContent);
    setPopoverVisible(true);
  };

  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  const sections: Record<string, JSX.Element | string> = {
    Inbox: (
      <div className="inbox-section">
        <div className="inbox-header">
          <h2 className="inbox-title">Inbox</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search inbox..." className="search-input" />
          </div>
        </div>

        <div className="inbox-content">
          {inboxData.map((email, index) => (
            <div key={index} className="email-item" onClick={(e) => handleEmailClick(e, email.versionHistory)}>
              <div className="email-header">
                <div className="sender">{email.sender}</div>
                <div className="subject">{email.subject}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Popover */}
        {popoverVisible && (
          <div className="popover">
            <div className="popover-content">
              {popoverContent}
            </div>
          </div>
        )}
      </div>
    ),
    Drafts: "Displaying Draft Items...",
    Sent: "Displaying Sent Items...",
    Junk: "Displaying Junk Items...",
    Archive: "Displaying Archive Items...",
    Social: "Displaying Social Items...",
  };

  return (
    <div className="content-section">
      {sections[section] || <p>Select a section to view content</p>}
    </div>
  );
};

export default function ChatBotPage() {
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [selectedSection, setSelectedSection] = useState("Inbox");
  const [isTyping, setIsTyping] = useState(false);
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const ai = new GoogleGenerativeAI("AIzaSyBQ0DmKwRiXdOG9nfzMzcNbhSV0l99_7ik");
    setGenAI(ai);
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { sender: "user" as const, text: input };
      setMessages((prev) => [...prev, userMessage]);

      setIsTyping(true);

      try {
        const botMessage = {
          sender: "bot" as const,
          text: await getBotResponse(input),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error getting response:", error);
        setMessages((prev) => [...prev, { sender: "bot", text: "Something went wrong. Please try again." }]);
      } finally {
        setIsTyping(false);
        setInput("");
      }
    }
  };

  const getBotResponse = async (message: string): Promise<string> => {
    if (!genAI) return "Loading...";

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(message);
      const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      return response || "I'm sorry, I don't understand.";
    } catch (error) {
      console.error("Error generating response:", error);
      return "Something went wrong. Please try again.";
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
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
                <p>Here's how you can use this chatbot:</p>
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
            <button className="action-button" onClick={handleVoiceInput}>
              {isListening ? "Listening..." : "🎙️ Voice Input"}
            </button>
          </div>

          <div className="input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message I-Send"
              className="Textarea"
            />
            <button onClick={handleSend} className="send-button">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
