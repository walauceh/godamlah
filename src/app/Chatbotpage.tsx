"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";
import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Chatbotpage.css";
import React from "react";
import ReactModal from "react-modal";
import openai, { OpenAI } from "openai";
import { encryptCID, decryptCID } from "../utils/encryption";
import { storeMetadata, getMetadata, grantAccess, revokeAccess } from "../utils/contract";
import { useNavigation } from '@/components/NavigationContext';
import { NavigationProvider } from '@/components/NavigationContext';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Content components for each section
const InboxContent = () => {
  const inboxData = [
    {
      sender: "William Smith",
      subject: "Meeting Tomorrow",
      preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we...",
      time: "about 1 year ago",
      tags: ["meeting", "work", "important"]
    },
    {
      sender: "Alice Smith",
      subject: "Re: Project Update",
      preview: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I...",
      time: "about 1 year ago",
      tags: ["work", "important"]
    },
    {
      sender: "Bob Johnson",
      subject: "Weekend Plans",
      preview: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're...",
      time: "over 1 year ago",
      tags: ["personal"]
    },
    {
      sender: "Emily Davis",
      online: true,
      subject: "Re: Question about Budget",
      preview: "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources. I've reviewed the...",
      time: "almost 2 years ago",
      tags: ["work", "budget"]
    },
    {
      sender: "Michael Wilson",
      online: true,
      subject: "Important Announcement",
      preview: "I have an important announcement to make during our team meeting. It pertains to a strategic shift in our upcoming product launc...",
      time: "almost 2 years ago",
      tags: ["work", "announcement"]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {inboxData.map((email, index) => (
        <div key={index} className="p-4 border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{email.sender}</span>
            
            </div>
            <span className="text-sm text-gray-500">{email.time}</span>
          </div>
          <h3 className="font-medium text-white mb-2">{email.subject}</h3>
          <p className="text-sm text-gray-400 mb-3">{email.preview}</p>
          <div className="flex gap-2">
            {email.tags.map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className={`px-3 py-1 rounded-full text-sm ${tag === 'work' ? 'text-white' : 'text-gray-300'}`}
                style={{ backgroundColor: tag === 'work' ? 'hsl(225, 50%, 25%)' : '#1f2937' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SentContent = () => (
  <div className="p-4">
    <h2 className="text-xl font-bold text-white mb-4">Sent Messages</h2>
    <div className="text-gray-300">Your sent messages will appear here...</div>
  </div>
);

const ScheduleContent = () => (
  <div className="p-4">
    <h2 className="text-xl font-bold text-white mb-4">Schedule</h2>
    <div className="text-gray-300">Your calendar and scheduled events will appear here...</div>
  </div>
);

const ArchiveContent = () => (
  <div className="p-4">
    <h2 className="text-xl font-bold text-white mb-4">Archive</h2>
    <div className="text-gray-300">Your archived messages will appear here...</div>
  </div>
);

const SocialContent = () => (
  <div className="p-4">
    <h2 className="text-xl font-bold text-white mb-4">Social</h2>
    <div className="text-gray-300">Your social messages will appear here...</div>
  </div>
);

export const ContentSection = () => {
  const { currentSection } = useNavigation();

  const renderContent = () => {
    switch (currentSection) {
      case 'inbox':
        return <InboxContent />;
      case 'sent':
        return <SentContent />;
      case 'schedule':
        return <ScheduleContent />;
      case 'archive':
        return <ArchiveContent />;
      case 'social':
        return <SocialContent />;
      default:
        return <InboxContent />;
    }
  };

  return (
    <div 
      className="flex flex-col h-screen text-gray-300"
      style={{ backgroundColor: 'hsl(252, 100.00%, 9.60%)' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">
            {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
          </h1>
          <div className="flex gap-2">
            <button className="px-4 py-1 rounded-full bg-gray-900 hover:bg-gray-800 text-sm">
              All mail
            </button>
            <button className="px-4 py-1 rounded-full bg-gray-900 hover:bg-gray-800 text-sm">
              Unread
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-gray-900 rounded-lg px-4 py-2 pl-10 text-gray-300 placeholder-gray-500"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
};



export default function ChatBotPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [selectedSection, setSelectedSection] = useState("Inbox");
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPurpose, setModalPurpose] = useState<"grant" | "revoke" | "retrieve" | null>(null);
  const [blockId, setBlockId] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);



  const handleSend = async () => {
    if (!input.trim()) {
      setError("Input cannot be empty");
      return;
    }
  
    setError(null); 
    setIsTyping(true);
  
    try {
      setMessages((prev) => [...prev, `User: ${input}`]);
  
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });
  
      if (!res.ok) {
        throw new Error(`API request failed with status: ${res.status}`);
      }
  
      try {
        const data = await res.json(); 
  
        if (!data || !data.text) {
          getBotResponse("No response received from chatbot."); 
          return; 
        }
  
        getBotResponse(data.text); 
  
      } catch (jsonErr) {
        console.error("Error parsing JSON response:", jsonErr);
        setError("Invalid response from chatbot.");
        return; 
      }
  
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while communicating with the chatbot."); 
    } finally {
      setIsTyping(false);
      setInput(""); 
    }
  };
  

  const getBotResponse = (response: string) => {
    setMessages((prev) => [...prev, `Bot: ${response}`]);
  };
  
  

  const openModal = (purpose: "grant" | "revoke" | "retrieve") => {
    setModalPurpose(purpose);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setBlockId(null);
    setUserAddress("");
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      handleSend(); // Trigger message send
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
      const cid = data.cid; // CID from the file upload response
      const secretKey = process.env.NEXT_PUBLIC_RANDOM_UUID;

      if (!secretKey) {
        throw new Error('Secret key not found');
      }

      const encryptedCID = encryptCID(cid, secretKey);

      console.log('Encrypted CID:', encryptedCID);

      // Save encrypted CID to blockchain
      const blockId = Date.now(); // Use a unique blockId (e.g., timestamp)
      await storeMetadata(blockId, encryptedCID);

      console.log('Encrypted CID stored on blockchain with blockId:', blockId);
      console.log('File uploaded successfully');

      toast.success(
        <div>
          File uploaded successfully!{" "}
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            Open File
          </a>
        </div>
      );

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error("File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };


  const handleRetrieveMetadata = async (blockId: number) => {
    try {
      const encryptedCID = await getMetadata(blockId);
      console.log('Encrypted CID from blockchain:', encryptedCID);
  
      const decryptedCID = decryptCID(encryptedCID, "your-secret-key");
      console.log('Decrypted CID:', decryptedCID);
  
      const fileUrl = `https://w3s.link/ipfs/${decryptedCID}`;
      console.log('File URL:', fileUrl);
    } catch (error) {
      console.error('Error retrieving metadata:', error);
      setError(error instanceof Error ? error.message : 'Access denied or invalid block ID');
    }
  };
  
  const handleGrantAccess = async (blockId: number, userAddress: string) => {
    try {
      await grantAccess(blockId, userAddress);
      console.log(`Access granted to ${userAddress} for blockId ${blockId}`);
    } catch (error) {
      console.error('Error granting access:', error);
    }
  };
  
  const handleRevokeAccess = async (blockId: number, userAddress: string) => {
    try {
      await revokeAccess(blockId, userAddress);
      console.log(`Access revoked for ${userAddress} for blockId ${blockId}`);
    } catch (error) {
      console.error('Error revoking access:', error);
    }
  };  

  const [gradientAngle, setGradientAngle] = useState(50);
  const [showLogin, setShowLogin] = useState(false);
  // Add HTMLParagraphElement type to the ref
  const titleRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!titleRef.current) return;
      
      // Get the title element's bounds
      const titleBounds = titleRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the title element
      const x = e.clientX - titleBounds.left;
      const elementWidth = titleBounds.width;
      
      // Only update if mouse is within or near the title
      if (Math.abs(e.clientY - titleBounds.top) < 100 && 
          x >= -50 && x <= elementWidth + 50) {
        const newAngle = (x / elementWidth) * 360;
        
        const animate = () => {
          setGradientAngle(prev => {
            const diff = newAngle - prev;
            if (Math.abs(diff) < 1) return newAngle;
            return prev + diff * 0.1;
          });
        };
        
        requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const titleStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}deg, #6a11cb, #2575fc)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    transition: 'background-image 0.1s ease-out'
  };

  
  return (
    <div className="chat-app bg-[#00001c]">
      <NavigationProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-[#00001c]">
          <PageHeader />
          <div className="content bg-[#00001c]">
            {/* Main content container */}
            <div className="flex w-full gap-4 px-4 pb-4 bg-[#00001c] h-[calc(100vh-4rem)]">
              {/* Content Section */}
              <div className="w-1/3 bg-[#00001c] h-full">
                <ContentSection/>
              </div>
              
              {/* Chat Container */}
              <div className="w-2/3 bg-[#00001c] h-full">
                <div className="chat-container h-full">
                  {/* Conditional header */}
                  {messages.length === 0 && (
                    <div className="chat-header-center">
                    <p ref={titleRef} style={titleStyle}>
                      What can I help with?
                    </p>
                  </div>
                  )}
                  <div className="messages">
                      {messages.length === 0 ? (
                        <div className="empty-messages">
                          {/* <p>No messages yet. Start the conversation!</p> */}
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div key={idx} className={`message ${msg.startsWith("Bot:") ? "bot" : "user"}`}>
                            {msg}
                          </div>
                        ))
                      )}
                      {isTyping && (
                        <div className="message bot typing-bubble">
                          <div className="typing-indicator">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </div>
                        </div>
                      )}
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

                  {/* Action Buttons Below Message Input */}
                  <div className="buttons-container flex gap-4 justify-center mt-4">
                    {/* Choose File Button */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="file-upload"
                        className="action-button flex items-center gap-2 text-white text-sm cursor-pointer"
                        title="Choose Files"
                      >
                        <i className="fas fa-upload text-2xl"></i>
                        <span>Choose Files</span>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </div>

                    {/* Upload Files Button */}
                    <div className="flex items-center gap-2">
                      <button
                        className="action-button flex items-center gap-2 text-white text-sm"
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        title="Upload Files"
                      >
                        <i className="fas fa-cloud-upload-alt text-2xl"></i>
                        <span>Upload Files</span>
                      </button>
                    </div>

                    {/* Access Files Button */}
                    <div className="flex items-center gap-2">
                      <button
                        className="action-button flex items-center gap-2 text-white text-sm"
                        onClick={() => openModal("retrieve")}
                        title="Access Files"
                      >
                        <i className="fas fa-folder-open text-2xl"></i>
                        <span>Access Files</span>
                      </button>
                    </div>

                    {/* Share Files Button */}
                    <div className="flex items-center gap-2">
                      <button
                        className="action-button flex items-center gap-2 text-white text-sm"
                        onClick={() => openModal("grant")}
                        title="Share Files"
                      >
                        <i className="fas fa-share-alt text-2xl"></i>
                        {/* <span>Share</span> */}
                      </button>
                    </div>

                    {/* Revoke Access Button */}
                    <div className="flex items-center gap-2">
                      <button
                        className="action-button flex items-center gap-2 text-white text-sm"
                        onClick={() => openModal("revoke")}
                        title="Remove Access"
                      >
                        <i className="fas fa-times-circle text-2xl"></i>
                        {/* <span>Remove Access</span> */}
                      </button>
                    </div>

                    {/* Voice Input Button */}
                    <div className="flex items-center gap-2">
                      <button
                        className={`action-button flex items-center gap-2 text-white text-xl ${isListening ? "animate-pulse" : ""}`}
                        onClick={handleVoiceInput}
                        title={isListening ? "Listening..." : "Voice Input"}
                      >
                        <i className="fas fa-microphone"></i>
                        {/* <span className="text-sm">Voice Input</span> */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
      </NavigationProvider>
  
      {/* Modal */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Input Details"
        ariaHideApp={false}
        className="custom-modal"
      >
        <h2>{modalPurpose === "retrieve" ? "Retrieve Metadata" : `${modalPurpose === "grant" ? "Grant" : "Revoke"} Access`}</h2>
        <div>
          <label>
            Block ID:
            <input
              type="number"
              value={blockId || ""}
              onChange={(e) => setBlockId(parseInt(e.target.value))}
              required
            />
          </label>
          {modalPurpose !== "retrieve" && (
            <label>
              User Address:
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                required
              />
            </label>
          )}
          <div className="modal-buttons">
            <button onClick={closeModal}>Cancel</button>
            <button
              onClick={async () => {
                if (modalPurpose === "retrieve" && blockId !== null) {
                  await handleRetrieveMetadata(blockId);
                } else if (modalPurpose === "grant" && blockId !== null && userAddress) {
                  await handleGrantAccess(blockId, userAddress);
                } else if (modalPurpose === "revoke" && blockId !== null && userAddress) {
                  await handleRevokeAccess(blockId, userAddress);
                }
                closeModal();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </ReactModal>
  
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
}