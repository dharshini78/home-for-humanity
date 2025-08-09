import { HiSparkles } from "react-icons/hi2";
import { Send, Mic, MicOff, VolumeX, Volume2 } from "lucide-react";
// import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import { useState, useRef, useEffect } from "react";
// import { speakText } from "./LanguagePopUp";
import { debounce } from "lodash"; // Make sure to import debounce

const TextToTextChat = () => {
  // const { i18n } = useTranslation();
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
  const lastAudioTimeRef = useRef(null);
  const audioElementRef = useRef(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    console.log("Chat messages updated:", chatMessages);
  }, [chatMessages]);

  const [textToSpeechResponse, setTextToSpeechResponse] = useState(null);

  const debouncedPlayAudio = useRef(
    debounce((audioContent) => {
      if (audioElementRef.current) {
        // If already playing, don't create a new instance
        return;
      }

      const audioElement = new Audio();
      audioElement.src = URL.createObjectURL(
        new Blob([audioContent], { type: "audio/mp3" })
      );

      audioElement.onended = () => {
        isPlayingRef.current = false;
        audioElement.src = "";
        audioElement.load();
        audioElementRef.current = null;
      };

      audioElementRef.current = audioElement;
      isPlayingRef.current = true;
      audioElement.play().catch((error) => {
        console.error("Audio playback failed:", error);
        isPlayingRef.current = false;
      });
    }, 100)
  ).current;

const toggleMute = () => {
  setIsMuted((prevIsMuted) => {
    const newIsMuted = !prevIsMuted;

    if (audioElementRef.current) {
      // Always stop and clear current audio when toggling
      audioElementRef.current.pause();
      audioElementRef.current.src = "";
      audioElementRef.current.load();
      audioElementRef.current = null;
      isPlayingRef.current = false;
    }

    // Clear the old textToSpeechResponse when muting/unmuting
    // This prevents old audio from playing when unmuting
    setTextToSpeechResponse(null);

    return newIsMuted;
  });
};

  useEffect(() => {
    const socket = io("https://api.diyhomes.ai", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to the server");
      setIsConnected(true);
      setConnectionError(null);

      if (chatMessages.length === 0) {
        console.log("Setting initial bot message");
        setChatMessages([
          { from: "bot", content: "Hey there! How can I assist you today?" },
        ]);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from the server", reason);
      setIsConnected(false);
      setConnectionError(`Disconnected: ${reason}`);
    });

    socket.on("chatresponse", (data) => {
      console.log("Received chat response:", data);
      setSessionId(data.sessionId);

      // Check if the message is already in the chatMessages array
      const isDuplicate = chatMessages.some(
        (message) =>
          message.from === "bot" && message.content === data.completedText
      );

      if (!isDuplicate) {
        console.log("Adding new bot message to chatMessages");
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { from: "bot", content: data.completedText },
        ]);
      } else {
        console.log("Duplicate message detected, not adding to chatMessages");
      }

      if (data.ttsResponse && data.ttsResponse.audioContent) {
        console.log("Setting text-to-speech response");
        setTextToSpeechResponse(data.ttsResponse.audioContent);
      }
    });

    socket.on("serverError", (error) => {
      console.error("Server error:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { from: "bot", content: "" },
      ]);
    });

    socket.on("audio_to_text", (data) => {
      console.log("Received audio to text:", data);

      // Ensure the text is not empty and is a valid string
      if (
        data.text &&
        typeof data.text === "string" &&
        data.text.trim() !== ""
      ) {
        // Directly update chat messages with the transcribed text
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { from: "user", content: data.text.trim() },
        ]);

        // Emit the message to the server
        //  socketRef.current.emit("startTextInput", currentLanguage, sessionId, data.text.trim(), "", false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentLanguage, isMuted]);

  useEffect(() => {
    if (textToSpeechResponse && !isMuted) {
      debouncedPlayAudio(textToSpeechResponse);
    }

    return () => {
      if (audioElementRef.current) {
        const audio = audioElementRef.current;
        audio.pause();
        audio.src = "";
        audio.load();
        audioElementRef.current = null;
      }
      debouncedPlayAudio.cancel();
    };
  }, [textToSpeechResponse, isMuted]);

  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        const audio = audioElementRef.current;
        audio.pause();
        audio.src = "";
        audio.load();
      }
      debouncedPlayAudio.cancel();
    };
  }, []);

  const speakText = (text, language) => {
    // First, cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Set the current speech text
    setCurrentSpeechText(text);

    // Create and speak the new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  const startChatSession = () => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) {
      chatBox.style.transition = "transform 0.5s ease-out";
      chatBox.style.transform = "translateY(0)";
      setTimeout(() => {
        setIsChatOpen(true);
      }, 500); // Match the duration with the transition time
    } else {
      setIsChatOpen(true);
    }
    const newSessionId = 0;
    setSessionId(newSessionId);
    if (isConnected) {
      socketRef.current.emit(
        "startTextInput",
        currentLanguage,
        newSessionId,
        "",
        true
      );
    } else {
      console.log("Sorry, there's a connection issue. Please try again later.");
    }
  };

  const endChatSession = () => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) {
      chatBox.style.transition = "transform 0.5s ease-out";
      chatBox.style.transform = "translateY(100%)";
      setTimeout(() => {
        setIsChatOpen(false);
      }, 500); // Match the duration with the transition time
    } else {
      setIsChatOpen(false);
    }
    if (isConnected) {
      socketRef.current.emit("endStream");
    }
    window.speechSynthesis.cancel();
  };

  const handleInputChange = (event) => {
    setInputMsg(event.target.value);
  };

  const handleSendMessage = (message = inputMsg, from = "user") => {
    if (message.trim() === "") return;
    if (!isConnected) {
      console.log("Connection issue, cannot send message");
      return;
    }

    console.log("Sending message to server:", message);
    setChatMessages((prevMessages) => {
      const newMessages = [...prevMessages, { from, content: message }];
      console.log("Updated chatMessages:", newMessages);
      return newMessages;
    });
    socketRef.current.emit(
      "startTextInput",
      currentLanguage,
      sessionId,
      message,
      "",
      false
    );
    setInputMsg("");
  };

// Add this at the top with your other refs




// Add this at the top with your other refs
const recognitionRef = useRef(null);
const [currentTranscript, setCurrentTranscript] = useState('');

const startRecording = async () => {
  if (isRecording) {
    stopRecording();
    return;
  }
  
  try {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      console.error("Speech recognition not supported");
      return;
    }
    
    console.log("Starting speech recognition...");
    
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started");
      setIsRecording(true);
    };
    
    recognitionRef.current.onresult = (event) => {
      console.log("Speech recognition result:", event);
      
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        console.log(`Result ${i}: "${transcript}" (final: ${event.results[i].isFinal})`);
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      console.log("Interim:", interimTranscript);
      console.log("Final:", finalTranscript);
      
      // Show streaming text (interim results)
      if (interimTranscript) {
        console.log("Setting currentTranscript to:", interimTranscript);
        setCurrentTranscript(interimTranscript);
      }
      
      // When speech is finalized, add to chat and clear streaming text
      if (finalTranscript) {
        console.log("Adding final transcript to chat:", finalTranscript);
        setCurrentTranscript(''); // Clear the streaming text
        
        // Add the final transcribed text to chat
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { from: "user", content: finalTranscript.trim() },
        ]);
        
        // Send to server for bot response
        socketRef.current.emit("startTextInput", currentLanguage, sessionId, finalTranscript.trim(), "", false);
      }
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert(`Speech recognition error: ${event.error}`);
    };
    
    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended");
      setIsRecording(false);
    };
    
    // Request microphone permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
    } catch (permError) {
      console.error("Microphone permission denied:", permError);
      alert("Please allow microphone access for speech recognition");
      return;
    }
    
    recognitionRef.current.start();
    console.log("Speech recognition start called");
    
  } catch (error) {
    console.error("Error starting speech recognition:", error);
    alert("An error occurred while starting speech recognition: " + error.message);
  }
};

const stopRecording = () => {
  console.log("Stopping speech recognition");
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
  setCurrentTranscript(''); // Clear streaming text when stopping
  setIsRecording(false);
};

// Add this to check the current state
console.log("Current transcript state:", currentTranscript);
console.log("Is recording:", isRecording);

return (
  <div className="flex flex-col h-screen">
    {!isChatOpen ? (
      <button
        onClick={startChatSession}
        className=" fixed bottom-4 right-4 bg-gray-300 text-black p-4 rounded-full shadow-lg z-50"
      >
        <HiSparkles size={24} />
      </button>
    ) : (
      <div className="chat-box fixed bottom-0 left-[25%] h-[300px] max-h-[80vh] w-[800px] flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg z-50 responsive-chat-box">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">AI Chat</h2>
          <button onClick={endChatSession} className="text-white">
            Close
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {chatMessages
            .filter((message) => message.content.trim() !== "") // Filter out empty messages
            .map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.from === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.from === "user"
                      ? "bg-gray-950 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
          
          {/* Streaming text display */}
          {currentTranscript && (
            <div className="mb-4 text-right">
              <span className="inline-block p-2 rounded-lg bg-gray-700 text-white streaming-text">
                {currentTranscript}
                <span className="cursor">|</span>
              </span>
            </div>
          )}
        </div>

        <div className="bg-white p-4 border-t border-gray-300">
          <div className="flex items-center">
            <input
              type="text"
              value={inputMsg}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
              className="ml-2 bg-black text-white p-2 rounded-md focus:outline-none focus:ring-2"
              disabled={!isConnected}
            >
              {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
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
    <footer className="fixed bottom-4 left-4 z-50 flex space-x-2"></footer>
    <style jsx>{`
      .responsive-chat-box {
        width: 800px;
        left: 25%;
      }

      @media (max-width: 768px) {
        .responsive-chat-box {
          width: 100%;
          left: 0;
          right: 0;
          margin: 0 auto;
        }
      }

      .streaming-text {
        opacity: 0.8;
        font-style: italic;
        position: relative;
      }
      
      .cursor {
        animation: blink 1s infinite;
        margin-left: 2px;
      }
      
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `}</style>
  </div>
);
};

export default TextToTextChat;
