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
      time: "about 1 year ago",
      content: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we...",
      labels: ["meeting", "work", "important"],
    },
    {
      sender: "Alice Smith",
      subject: "Re: Project Update",
      time: "about 1 year ago",
      content: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I...",
      labels: ["work", "important"],
    },
  ];

  // State to handle popover visibility and position
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [popoverContent, setPopoverContent] = useState<string>('');
  const [popoverPosition, setPopoverPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });

  const handleEmailClick = (event: React.MouseEvent<HTMLDivElement>, emailContent: string) => {
    const { clientX: left, clientY: top } = event;
    setPopoverPosition({ top, left });
    setPopoverContent(emailContent);
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
            <div key={index} className="email-item" onClick={(e) => handleEmailClick(e, email.content)}>
              <div className="email-header">
                <div className="sender">{email.sender}</div>
                <div className="time">{email.time}</div>
              </div>
              <div className="subject">{email.subject}</div>
              <div className="content">{email.content}</div>
              <div className="labels">
                {email.labels.map((label, idx) => (
                  <span key={idx} className="label">{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Popover */}
        {popoverVisible && (
          <div className="popover" style={{ top: popoverPosition.top + 10, left: popoverPosition.left + 10 }}>
            <div className="popover-content">
              <p>{popoverContent}</p>
              <button onClick={handleClosePopover}>Close</button>
            </div>
          </div>
        )}
      </div>
    ),
    Drafts: "Displaying Draft Items...",
    Sent: "Displaying Sent Items...",
    Junk: "Displaying Junk Items...",
    Archive: "Displaying Archive Items...",
    Social: (
      <div className="social-content">
        <div className="social-content">
          <div className="friend-card">
            <div className="avatar">O</div>
            <div className="details">
              <div className="name">Olivia Martin</div>
              <div className="email">m@example.com</div>
            </div>
            <div className="role">
              <select defaultValue="Can edit">
                <option value="Can edit">Can edit</option>
                <option value="Can view">Can view</option>
              </select>
            </div>
          </div>
          <div className="friend-card">
            <div className="avatar">I</div>
            <div className="details">
              <div className="name">Isabella Nguyen</div>
              <div className="email">b@example.com</div>
            </div>
            <div className="role">
              <select defaultValue="Can view">
                <option value="Can edit">Can edit</option>
                <option value="Can view">Can view</option>
              </select>
            </div>
          </div>
          <div className="friend-card">
            <div className="avatar">S</div>
            <div className="details">
              <div className="name">Sofia Davis</div>
              <div className="email">p@example.com</div>
            </div>
            <div className="role">
              <select defaultValue="Can view">
                <option value="Can edit">Can edit</option>
                <option value="Can view">Can view</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    ),
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const geminiAPI = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!geminiAPI) {
    throw new Error("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.");
  }

  useEffect(() => {
    const ai = new GoogleGenerativeAI(geminiAPI);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadedFileUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file.');
      }

      const data = await response.json();
      setUploadedFileUrl(data.url);
      console.log('File uploaded successfully:', data.url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsUploading(false);
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
          <input type="file" onChange={handleFileChange} disabled={isUploading}/>

            {/* Display Upload Progress */}
            {isUploading && <p>Uploading your file, please wait...</p>}

            {/* Display File URL */}
            {uploadedFileUrl && (
              <div style={{ marginTop: '20px' }}>
                <p>File uploaded successfully:</p>
                <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">
                  {uploadedFileUrl}
                </a>
              </div>
            )}

            {/* Display Error Message */}
            {error && (
              <div style={{ marginTop: '20px', color: 'red' }}>
                <p>Error: {error}</p>
              </div>
            )}
          </div>

          <div className="buttons-container">
            <button className="action-button" onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </button>
            <button className="action-button">Share Files</button>
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