import React, { useEffect, useState, useRef } from "react";
import { HiSparkles } from "react-icons/hi2";
import { Send, Mic, MicOff, VolumeX, Volume2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import { speakText } from './LanguagePopUp';

const TextToTextChat = () => {
  const { i18n } = useTranslation();
  const [sessionId, setSessionId] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en-US");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const timeoutRef = useRef(null);
  const [textToSpeechResponse, setTextToSpeechResponse] = useState(null);

  useEffect(() => {
    const socket = io("https://api.homeforhumanity.xrvizion.com", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      // transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to the server");
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from the server", reason);
      setIsConnected(false);
      setConnectionError(`Disconnected: ${reason}`);
    });

    socket.on("chatresponse", (data) => {
      console.log("Received chat response:", data);
      setSessionId(data.sessionId);
      setChatMessages((prevMessages) => {
        if (prevMessages.length > 0 &&
            prevMessages[prevMessages.length - 1].from === "bot" &&
            prevMessages[prevMessages.length - 1].content === data.completedText) {
          return prevMessages;
        }
        return [...prevMessages, { from: "bot", content: data.completedText }];
      });
      if (!isMuted) {
        if (data.ttsResponse && data.ttsResponse.audioContent) {
          setTextToSpeechResponse(data.ttsResponse.audioContent);
        } else {
          speakText(data.completedText, currentLanguage);
        }
      }
    });

    socket.on("serverError", (error) => {
      console.error("Server error:", error);
      setChatMessages((prevMessages) => [...prevMessages, { from: "bot", content: "Sorry, there was an error processing your request." }]);
    });

    socket.on("audio_to_text", (data) => {
      console.log("Received audio to text:", data);
      setInputMsg(data.text);
      handleSendMessage(data.text);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentLanguage, isMuted]);

  useEffect(() => {
    if (textToSpeechResponse) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioElement = new Audio();
      audioElement.src = URL.createObjectURL(new Blob([textToSpeechResponse], { type: 'audio/mp3' }));
      audioElement.play();
    }
  }, [textToSpeechResponse]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.pause();
    }
  };

  const startChatSession = () => {
    setIsChatOpen(true);
    const newSessionId = 0;
    setSessionId(newSessionId);
    if (isConnected) {
      socketRef.current.emit("startTextInput", currentLanguage, newSessionId, "", true);
    } else {
      setChatMessages([{ from: "bot", content: "Sorry, there's a connection issue. Please try again later." }]);
    }
  };

  const endChatSession = () => {
    setIsChatOpen(false);
    if (isConnected) {
      socketRef.current.emit("endStream");
    }
    window.speechSynthesis.cancel();
  };

  const handleInputChange = (event) => {
    setInputMsg(event.target.value);
  };

  const handleSendMessage = (message = inputMsg) => {
    if (message.trim() === "") return;
    if (!isConnected) {
      setChatMessages((prevMessages) => [...prevMessages, { from: "bot", content: "Sorry, there's a connection issue. Please try again later." }]);
      return;
    }

    setChatMessages((prevMessages) => [...prevMessages, { from: "user", content: message }]);
    socketRef.current.emit("startTextInput", currentLanguage, sessionId, message, "", false);
    setInputMsg("");
  };

  const startRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    if (!isConnected) {
      alert("Cannot start recording due to connection issues. Please try again later.");
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);

      if (!processorRef.current) {
        await audioContextRef.current.audioWorklet.addModule(
          "https://xrv-xrc.s3.ap-south-1.amazonaws.com/Butati/Resources/recorderWorkletProcessor.js"
        );

        processorRef.current = new AudioWorkletNode(
          audioContextRef.current,
          "recorder.worklet"
        );

        processorRef.current.port.onmessage = (event) => {
          const audioData = event.data;
          socketRef.current.emit("send_audio_data", { audio: audioData });
        };
      }

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      setIsRecording(true);
      socketRef.current.emit("startStream", currentLanguage, sessionId, "", sessionId === 0);

      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 6000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert("Microphone access is necessary for the application to function. Please enable microphone access in your browser settings.");
      } else {
        alert("An error occurred while accessing the microphone. Please try again later.");
      }
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      clearTimeout(timeoutRef.current);
      setIsRecording(false);
      socketRef.current.emit("endStream");

      if (processorRef.current) {
        processorRef.current.disconnect();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {!isChatOpen ? (
        <button onClick={startChatSession} className="fixed bottom-4 right-4 bg-gray-300 text-black p-4 rounded-full shadow-lg z-50">
          <HiSparkles size={24} />
        </button>
      ) : (
        <div className="fixed w-full bottom-0 left-0 sm:w-96 h-[500px] max-h-[80vh] flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg z-50">
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">AI Chat</h2>
            <button onClick={endChatSession} className="text-white">
              Close
            </button>
          </div>
          {connectionError && (
            <div className="bg-red-500 text-white p-2 text-sm">
              {connectionError}
            </div>
          )}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.from === "user" ? "text-right" : "text-left"}`}>
                <span className={`inline-block p-2 rounded-lg ${message.from === "user" ? "bg-gray-950 text-white" : "bg-white text-gray-800"}`}>
                  {message.content}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 border-t border-gray-300">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMsg}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-black text-white p-2 rounded-r-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
                disabled={!isConnected}
              >
                <Send size={20} />
              </button>
              <button
                onClick={startRecording}
                className="ml-2 bg-black text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={!isConnected}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                onClick={toggleMute}
                className="ml-2 bg-black text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
      <footer className="fixed bottom-4 left-4 z-50 flex space-x-2">
     
      </footer>
    </div>
  );
};

export default TextToTextChat;
