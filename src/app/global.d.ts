interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    ethereum?: {
        isMetaMask?: boolean;
        request: (args: { method: string; params?: any[] }) => Promise<any>;
      };
}
interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
    interpretError: string;
}
