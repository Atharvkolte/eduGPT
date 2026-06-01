import React, { useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

interface Props {
  setInputText: React.Dispatch<React.SetStateAction<string>>;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend?: () => void;
}

const SpeechToText: React.FC<Props> = ({
  setInputText,
}) => {
  const recognitionRef =
    useRef<SpeechRecognition | null>(null);

  const [isListening, setIsListening] =
    useState(false);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition: SpeechRecognition =
      new SpeechRecognitionClass();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      setInputText(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    recognitionRef.current = recognition;

    setIsListening(true);
  };

  return (
    <button
      type="button"
      className={`mic-btn ${
        isListening ? "active" : ""
      }`}
      onClick={toggleListening}
      title={
        isListening
          ? "Stop Listening"
          : "Start Voice Input"
      }
    >
      {isListening ? (
        <MicOff size={18} />
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
};

export default SpeechToText;