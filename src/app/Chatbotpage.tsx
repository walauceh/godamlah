"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/page-header";

import { JSX, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Chatbotpage.css";
import React from "react";
import ReactModal from "react-modal";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { encryptCID, decryptCID } from "../utils/encryption";
import { storeMetadata, getMetadata, grantAccess, revokeAccess } from "../utils/contract";
// import {
//   FaInbox,
//   FaRegPaperPlane,
//   FaFolderOpen,
//   FaTrashAlt,
//   FaEnvelopeOpenText,
//   FaUserFriends,
//   FaCog,
//   FaSignOutAlt,
//   FaUser,
//   FaChevronDown,
//   FaStar,
// } from "react-icons/fa";

// const Sidebar: React.FC<{ onSelect: (section: string) => void }> = ({ onSelect }) => {
//   const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

//   const toggleAccountMenu = () => {
//     setIsAccountMenuOpen((prev) => !prev);
//   };

//   const sections = [
//     { name: "Inbox", icon: <FaInbox />, count: 2 },
//     { name: "Drafts", icon: <FaEnvelopeOpenText /> },
//     { name: "Sent", icon: <FaRegPaperPlane /> },
//     { name: "Junk", icon: <FaTrashAlt />},
//     { name: "Archive", icon: <FaFolderOpen /> },
//     { name: "Social", icon: <FaUserFriends />, count: 3 },
//   ];

//   return (
//     <div className="main-container">
//       <div className={`sidebar ${isAccountMenuOpen ? "open" : ""}`}>
//         <div className="sidebar-header">
//           <h1 className="app-title">I-Send</h1>
//         </div>

//         <nav className="sidebar-nav">
//           <ul>
//             {sections.map((section) => (
//               <li
//                 key={section.name}
//                 className="sidebar-item"
//                 onClick={() => onSelect(section.name)}
//               >
//                 <a href="#" className="sidebar-link">
//                   <div className="icon">{section.icon}</div>
//                   <span>{section.name}</span>
//                   {section.count !== undefined && (
//                     <span className="count">{section.count}</span>
//                   )}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* User Account Section */}
//         <div className="sidebar-account">
//           <div className="user-profile" onClick={toggleAccountMenu}>
//             <div className="account-info">
//               <p className="username">John Doe</p>
//               <p className="email">johndoe@example.com</p>
//             </div>
//             <FaChevronDown className={`chevron ${isAccountMenuOpen ? "open" : ""}`} />
//           </div>
//           {isAccountMenuOpen && (
//             <div className="account-dropdown">
//               <div className="account-header">
//                 <div className="avatar-large">JD</div>
//                 <div>
//                   <p className="username">John Doe</p>
//                   <p className="email">johndoe@example.com</p>
//                 </div>
//               </div>
//               <ul className="account-options">
//                 <li>
//                   <i className="fa-solid fa-star icon"></i> Upgrade to Pro
//                 </li>
//                 <li>
//                   <i className="fa-solid fa-user icon"></i> Profile
//                 </li>
//                 <li>
//                   <i className="fa-solid fa-gear icon"></i> Settings
//                 </li>
//                 <li>
//                   <i className="fa-solid fa-sign-out-alt icon"></i> Log out
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="content">
//         {/* Content Section */}
//       </div>
//     </div>
//   );
// };

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPurpose, setModalPurpose] = useState<"grant" | "revoke" | "retrieve" | null>(null);
  const [blockId, setBlockId] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const geminiAPI = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!geminiAPI) {
    throw new Error("Gemini API key not found. Please set the GEMINI_API_KEY environment variable.");
  }

  useEffect(() => {
    const ai = new GoogleGenerativeAI(geminiAPI);
    setGenAI(ai);
  }, []);

  const openModal = (purpose: "grant" | "revoke" | "retrieve") => {
    setModalPurpose(purpose);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setBlockId(null);
    setUserAddress("");
  };

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

      setUploadedFileUrl(data.url);
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
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full bg-[#00001c]">
          <PageHeader />
          <div className="content bg-[#00001c]">
            {/* Main content container */}
            <div className="flex w-full gap-4 px-4 pb-4 bg-[#00001c] h-[calc(100vh-4rem)]">
              {/* Content Section */}
              <div className="w-1/3 bg-[#00001c] h-full">
                <ContentSection section={selectedSection} />
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
                        {/* You can leave this empty or customize it further */}
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