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
import { encryptCID, decryptCID } from "../utils/encryption";
import { storeMetadata, getMetadata, grantAccess, revokeAccess } from "../utils/contract";
import { useNavigation } from '@/components/NavigationContext';
import { NavigationProvider } from '@/components/NavigationContext';
import { introduceChatbot } from '@/utils/chatbot-utils';
import { Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle, } from "@radix-ui/react-dialog";


  interface TimelineEvent {
    date: string;
    title: string;
    description: string;
    type: 'APP-IDEAS' | 'BLOG' | 'TWITTER' | 'MEDIUM';
    link?: string;
  }
  
  interface Email {
    sender: string;
    subject: string;
    preview: string;
    time: string;
    tags: string[];
    timeline?: TimelineEvent[];
  }
  
  const TimelineItem = ({ event, isLeft }: { event: TimelineEvent; isLeft: boolean }) => {
    const getTypeStyles = (type: TimelineEvent['type']) => {
      const styles = {
        'APP-IDEAS': 'bg-yellow-500',
        'BLOG': 'bg-rose-500',
        'TWITTER': 'bg-blue-500',
        'MEDIUM': 'bg-emerald-600',
      };
      return styles[type] || 'bg-gray-500';
    };
  
    return (
      <div className={`flex items-start mb-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="flex-1 max-w-sm">
          <div className="bg-white rounded-lg shadow-md p-4">
            <span className="text-sm text-gray-500 block mb-2">{event.date}</span>
            <h4 className="font-semibold text-lg text-gray-800 mb-1">{event.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
            {event.link && (
              <a href={event.link} className="text-sm text-blue-600 hover:underline">
                Check it out →
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center mx-4">
          <div className={`w-8 h-8 rounded-full ${getTypeStyles(event.type)} flex items-center justify-center`}>
            <span className="text-white text-xs">{event.type.charAt(0)}</span>
          </div>
          <div className="w-px h-24 bg-gray-300"></div>
        </div>
      </div>
    );
  };
  
  
  const InboxContent = () => {
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
    const inboxData: Email[] = [
      {
        sender: "William Smith",
        subject: "Meeting Tomorrow",
        preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we...",
        time: "about 1 year ago",
        tags: ["meeting", "work", "important"],
        timeline: [
          {
            date: "Jan 15, 2024",
            title: "Initial Draft",
            description: "Created first version of the project proposal",
            type: "APP-IDEAS"
          },
          {
            date: "Jan 20, 2024",
            title: "Team Review",
            description: "Gathered feedback from the development team",
            type: "MEDIUM"
          },
          {
            date: "Jan 25, 2024",
            title: "Final Updates",
            description: "Incorporated all feedback and finalized the proposal",
            type: "BLOG",
            link: "https://example.com/proposal"
          }
        ]
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
        subject: "Re: Question about Budget",
        preview: "I have a question about the budget for the upcoming project. It seems like there's a discrepancy in the allocation of resources. I've reviewed the...",
        time: "almost 2 years ago",
        tags: ["work", "budget"]
      },
      {
        sender: "Michael Wilson",
        subject: "Important Announcement",
        preview: "I have an important announcement to make during our team meeting. It pertains to a strategic shift in our upcoming product launc...",
        time: "almost 2 years ago",
        tags: ["work", "announcement"]
      }
    ];
  
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          {inboxData.map((email, index) => (
            <div
              key={index}
              className="p-4 border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer"
              onClick={() => setSelectedEmail(email)}
            >
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
                    className={`px-3 py-1 rounded-full text-sm ${
                      tag === 'work' ? 'text-white' : 'text-gray-300'
                    }`}
                    style={{ backgroundColor: tag === 'work' ? 'hsl(225, 50%, 25%)' : '#1f2937' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
  
        {selectedEmail && (
        <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-lg z-50">
            <div className="p-6">
              <DialogTitle className="text-xl font-semibold mb-4">Version History</DialogTitle>
              <div className="bg-gray-50 rounded-md space-y-8 p-4">
                {selectedEmail?.timeline?.map((event, index) => (
                  <TimelineItem key={index} event={event} isLeft={index % 2 === 0} />
                ))}
                {(!selectedEmail?.timeline || selectedEmail.timeline.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No version history available</p>
                )}
              </div>
      </div>
    </DialogContent>
  </Dialog>
)}
      </>
    );
  };
  
const SentContent = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  const inboxData: Email[] = [
    {
      sender: "Miley Johnson",
      subject: "Meeting Tomorrow",
      preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we...",
      time: "about 1 year ago",
      tags: ["meeting", "work", "important"],
      timeline: [
        {
          date: "Jan 15, 2024",
          title: "Initial Draft",
          description: "Created first version of the project proposal",
          type: "APP-IDEAS"
        },
        {
          date: "Jan 20, 2024",
          title: "Team Review",
          description: "Gathered feedback from the development team",
          type: "MEDIUM"
        },
        {
          date: "Jan 25, 2024",
          title: "Final Updates",
          description: "Incorporated all feedback and finalized the proposal",
          type: "BLOG",
          link: "https://example.com/proposal"
        }
      ]
    },
    {
      sender: "Alice Cyrus",
      subject: "Re: Offer Letter Request",
      preview: "Thank you for the offer letter update. Thank you for replying...",
      time: "about 1 month ago",
      tags: ["work", "important"]
    },
    {
      sender: "Ariana Doe",
      subject: "Weekend Funs",
      preview: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're...",
      time: "over 1 year ago",
      tags: ["personal"]
    },
    
  ];

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {inboxData.map((email, index) => (
          <div
            key={index}
            className="p-4 border-b border-gray-800 hover:bg-gray-900/50 cursor-pointer"
            onClick={() => setSelectedEmail(email)}
          >
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
                  className={`px-3 py-1 rounded-full text-sm ${
                    tag === 'work' ? 'text-white' : 'text-gray-300'
                  }`}
                  style={{ backgroundColor: tag === 'work' ? 'hsl(225, 50%, 25%)' : '#1f2937' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedEmail && (
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-lg z-50">
          <div className="p-6">
            <DialogTitle className="text-xl font-semibold mb-4">Version History</DialogTitle>
            <div className="bg-gray-50 rounded-md space-y-8 p-4">
              {selectedEmail?.timeline?.map((event, index) => (
                <TimelineItem key={index} event={event} isLeft={index % 2 === 0} />
              ))}
              {(!selectedEmail?.timeline || selectedEmail.timeline.length === 0) && (
                <p className="text-gray-500 text-center py-4">No version history available</p>
              )}
            </div>
    </div>
  </DialogContent>
</Dialog>
)}
    </>
  );
};

const ScheduleContent = () => {
  const inboxData = [
    {
      sender: "William Smith",
      subject: "Meeting Tomorrow",
      preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we...",
      time: "about 1 year ago",
      tags: ["meeting", "work", "important"]
    },
    {
      sender: "Bob Johnson",
      subject: "Weekend Plans",
      preview: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're...",
      time: "over 1 year ago",
      tags: ["personal"]
    },
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

const ArchiveContent = () => {
  const inboxData = [
    {
      sender: "Bob Johnson",
      subject: "Weekend Plans",
      preview: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're...",
      time: "over 1 year ago",
      tags: ["personal"]
    },
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

interface Connection {
  name: string;
  title: string;
  image: string;
  connectedTime: string;
  isOnline: boolean;
}

const SocialContent = () => {
  const connections: Connection[] = [
    {
      name: "Senuka Karunaratne",
      title: "--",
      image: "/api/placeholder/48/48",
      connectedTime: "Connected 1 day ago",
      isOnline: true
    },
    {
      name: "Tracy Lee",
      title: "Engineering & IT Recruitment Consultant | Recruitment Consultant @ Hunters International | Talent Detective | Opportunity Matchmaker | Career Alchemist",
      image: "/api/placeholder/48/48",
      connectedTime: "Connected 3 days ago",
      isOnline: true
    },
    {
      name: "Keevan Brayden Louis",
      title: "2nd Year Digital Business Student @ APU | Verified Tutor at Superprof ID | PPI Malaysia",
      image: "/api/placeholder/48/48",
      connectedTime: "Connected 1 week ago",
      isOnline: true
    },
    {
      name: "Yaashwin Sarawanan",
      title: "Founder @ The Mind Xpert Enterprise | Abacus & Mental Arithmetic",
      image: "/api/placeholder/48/48",
      connectedTime: "Connected 1 week ago",
      isOnline: true
    },
    {
      name: "Mostafa Ahmed",
      title: "Final Year Software Engineering Student at Asia Pacific University of Technology and Innovation (APU / APIIT)",
      image: "/api/placeholder/48/48",
      connectedTime: "Connected 1 week ago",
      isOnline: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto rounded-lg" style={{ backgroundColor: 'hsl(252, 100.00%, 9.60%)' }}>
      <div className="divide-y divide-gray-700">
        {connections.map((connection, index) => (
          <div key={index} className="p-4 flex items-start justify-between hover:bg-gray-700/50">
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={connection.image}
                  alt={connection.name}
                  className="w-12 h-12 rounded-full"
                />
                {connection.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[hsl(252, 100.00%, 9.60%)]" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{connection.name}</h3>
                <p className="text-gray-300 text-sm line-clamp-2">{connection.title}</p>
                <p className="text-gray-400 text-sm mt-1">{connection.connectedTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1 border border-gray-600 rounded-full text-gray-300 hover:bg-gray-700/50 font-medium">
                Message
              </button>
              <button className="p-2 hover:bg-gray-700/50 rounded-full">
                <span className="block w-1 h-1 bg-gray-400 rounded-full mb-1"></span>
                <span className="block w-1 h-1 bg-gray-400 rounded-full mb-1"></span>
                <span className="block w-1 h-1 bg-gray-400 rounded-full"></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


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
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [input, setInput] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPurpose, setModalPurpose] = useState<"grant" | "revoke" | "retrieve" | null>(null);
  const [blockId, setBlockId] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");


  const handleSend = async () => {
    if (!input.trim()) {
      setError("Input cannot be empty");
      return;
    }
  
    setError(null); 
    setIsTyping(true);
  
    // Always keep the user input in the messages as an object
    setMessages((prev) => [...prev, { sender: "User", message: input }]);
  
    // Check if the user input is a greeting or an introduction request
    if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi") || input.toLowerCase().includes("introduce yourself")) {
      const introMessage = introduceChatbot();  // Call the function to get the introduction message
      setMessages((prev) => [...prev, { sender: "I-Send", message: introMessage }]);  // Set the message as an object
      setIsTyping(false);
      setInput("");
      return;
    }
  
    try {
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
  
        // Keep the bot's response as an object
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
  
  // Function to handle bot responses
  const getBotResponse = (response: string) => {
    setMessages((prev) => [...prev, { sender: "I-Send", message: response }]);
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
  // const [showLogin, setShowLogin] = useState(false);
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
                        <div
                          key={idx}
                          className={`message ${msg.sender === "User" ? "user" : "bot"}`}
                        >
                          {msg.sender === "I-Send" ? (
                            <div className="message-content">
                              <pre>{msg.message}</pre>
                            </div>
                          ) : (
                            <p>{msg.message}</p>
                          )}
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
                    {/* Action buttons remain the same */}
                    {/* File Upload Container */}
<div className="flex items-center gap-2 relative">
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
  
  {/* Filename Display - Absolutely positioned below */}
  {file && (
    <span 
      className="absolute -bottom-6 left-0 text-xs text-gray-400 truncate max-w-[200px]" 
      title={file.name}
    >
      {file.name}
    </span>
  )}
</div>
  
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
  
                    <div className="flex items-center gap-2">
                      <button
                        className="action-button flex items-center gap-2 text-white text-sm"
                        onClick={() => openModal("grant")}
                        title="Share Files"
                      >
                        <i className="fas fa-share-alt text-2xl"></i>
                      </button>
                    </div>
  
                    <div className="flex items-center gap-2">
                      <button
                        className="action-button flex items-center gap-2 text-white text-sm"
                        onClick={() => openModal("revoke")}
                        title="Remove Access"
                      >
                        <i className="fas fa-times-circle text-2xl"></i>
                      </button>
                    </div>
  
                    <div className="flex items-center gap-2">
                      <button
                        className={`action-button flex items-center gap-2 text-white text-xl ${isListening ? "animate-pulse" : ""}`}
                        onClick={handleVoiceInput}
                        title={isListening ? "Listening..." : "Voice Input"}
                      >
                        <i className="fas fa-microphone"></i>
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
  
      {/* Updated Modal */}
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Input Details"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
          {/* Close button */}
          <button 
            onClick={closeModal}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
  
          <h2 className="text-2xl font-semibold text-white mb-6">
            {modalPurpose === "retrieve" ? "Retrieve Metadata" : `${modalPurpose === "grant" ? "Grant" : "Revoke"} Access`}
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Block ID:
                <input
                  type="number"
                  value={blockId || ""}
                  onChange={(e) => setBlockId(parseInt(e.target.value))}
                  required
                  className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
  
            {modalPurpose !== "retrieve" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  User Address:
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    required
                    className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            )}
  
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
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
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
  
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
}
