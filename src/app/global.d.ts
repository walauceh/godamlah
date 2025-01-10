interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    ethereum?: {
        isMetaMask?: boolean;
        request: (args: { method: string; params?: var[] }) => Promise<T>;
      };
}
interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
    interpretError: string;
}
