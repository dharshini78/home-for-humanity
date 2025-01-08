import React, { useEffect, useState, useRef } from "react";
import { HiSparkles } from "react-icons/hi2";
import { Send, Mic, MicOff, VolumeX, Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import { speakText } from "./LanguagePopUp";
import { debounce } from "lodash"; // Make sure to import debounce

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
        if (newIsMuted || audioElementRef.current.paused) {
          // If muting or audio was paused, stop completely
          audioElementRef.current.pause();
          audioElementRef.current.src = "";
          audioElementRef.current.load();
          audioElementRef.current = null;
          isPlayingRef.current = false;
        } else {
          // If unmuting and audio was playing, just pause
          audioElementRef.current.pause();
          isPlayingRef.current = false;
        }
      } else if (!newIsMuted && textToSpeechResponse) {
        // Start new audio only if unmuting and no audio exists
        debouncedPlayAudio(textToSpeechResponse);
      }

      return newIsMuted;
    });
  };

  useEffect(() => {
    const socket = io("https://api.homeforhumanity.xrvizion.com", {
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

  const startRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    if (!isConnected) {
      alert(
        "Cannot start recording due to connection issues. Please try again later."
      );
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const source = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );

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

          // Update the last audio time
          lastAudioTimeRef.current = Date.now();
        };
      }

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      setIsRecording(true);
      socketRef.current.emit(
        "startStream",
        currentLanguage,
        sessionId,
        "",
        sessionId === 0
      );

      // Set the initial last audio time
      lastAudioTimeRef.current = Date.now();

      // Check for silence every second
      const checkSilence = () => {
        const now = Date.now();
        if (now - lastAudioTimeRef.current > 5000) {
          stopRecording();
        } else {
          timeoutRef.current = setTimeout(checkSilence, 1000);
        }
      };

      timeoutRef.current = setTimeout(checkSilence, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        alert(
          "Microphone access is necessary for the application to function. Please enable microphone access in your browser settings."
        );
      } else {
        alert(
          "An error occurred while accessing the microphone. Please try again later."
        );
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
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      console.log("Recording stopped");
    }
  };

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
      `}</style>
    </div>
  );
};

export default TextToTextChat;
