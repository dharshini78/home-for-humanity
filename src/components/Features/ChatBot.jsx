import React, { useState, useEffect, useRef } from 'react';
import { HiSparkles, HiMicrophone, HiX, HiArrowUp, HiArrowDown, HiExpand, HiCompress } from 'react-icons/hi2';
import axios from 'axios';
import io from 'socket.io-client';
import LanguagePopUp from './LanguagePopUp'; // Import the LanguagePopUp component

const Chatbot = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [connection, setConnection] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const [language, setLanguage] = useState('en');
  const [showLanguagePopUp, setShowLanguagePopUp] = useState(false); // State for language popup
  const [isFullscreen, setIsFullscreen] = useState(false);
  const shouldPlayResponse = useRef(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const socket = io.connect('https://api.homeforhumanity.xrvizion.com');
    setConnection(socket);

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    socket.on('startStream', async (langCode, sessionId, location, newSession, newLocation) => {
      console.log('Start Stream Event', { langCode, sessionId, location, newSession, newLocation });
      // Handle startStream event
      console.log('is it repeating');
    });

    socket.on('endStream', () => {
      console.log('End Stream Event');
      setIsListening(false);
    });

    socket.on('send_audio_data', async (audioData) => {
      console.log('Received Audio Data Event', audioData);
      // Convert audioData to a playable format and set it as the audio source
      const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
      shouldPlayResponse.current = true;
    });

    socket.on('startTextInput', async (langCode, sessionId, text, location, newSession, newLocation) => {
      console.log('Start Text Input Event', { langCode, sessionId, text, location, newSession, newLocation });
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input || !connection) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Emit the text input event to the server
    connection.emit('startTextInput', language, 0, input, 'web', true);

    setInput('');
  };

  const handleListen = () => {
    if (isListening) {
      connection.emit('endStream');
    } else {
      connection.emit('startStream', language, 0, 'web', true);
    }
    setIsListening(!isListening);
  };

  const playAudio = (url) => {
    audioRef.current.src = url;
    audioRef.current.play();
  };

  useEffect(() => {
    if (shouldPlayResponse.current && audioSrc) {
      playAudio(audioSrc);
      shouldPlayResponse.current = false;
    }
  }, [audioSrc]);

  const revokeMicrophoneAccess = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed ${isFullscreen ? 'inset-0' : 'bottom-4 right-4'} w-96 h-96 bg-gray-800 border border-gray-700 shadow-lg p-4 z-50 flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Chatbot</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <HiX size={24} />
        </button>
        <button onClick={() => setShowLanguagePopUp(true)} className="text-gray-500 hover:text-gray-700">
          {language}
        </button>
        <button onClick={toggleFullscreen} className="text-gray-500 hover:text-gray-700">
          {isFullscreen ? <HiCompress size={24} /> : <HiExpand size={24} />}
        </button>
      </div>
      {showLanguagePopUp && (
        <LanguagePopUp onClose={() => setShowLanguagePopUp(false)} onSelectLanguage={setLanguage} />
      )}
      <div className="flex-grow overflow-y-auto mb-4 bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <strong className={`${msg.role === 'user' ? 'text-blue-500' : 'text-green-500'}`}>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here"
          className="flex-grow p-2 border border-gray-700 rounded-l-md bg-gray-900 text-white"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          <HiArrowUp size={24} />
        </button>
        <button
          onClick={handleListen}
          className={`ml-2 p-2 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md`}
        >
          <HiMicrophone size={24} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
