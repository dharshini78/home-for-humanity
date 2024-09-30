import React from 'react';

const TextToSpeech = ({ shouldPlayResponse, textToSpeak, playAudio, language, revokeMicrophoneAccess, setAudioSrc, setIsPlaying, textToSpeechResponse }) => {

  const synthesizeSpeech = async () => {
    try {
      const audioBlob = new Blob([textToSpeechResponse], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      await revokeMicrophoneAccess();
      setAudioSrc(audioUrl);
      playAudio(audioUrl);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
    }
  };

  React.useEffect(() => {
    if (shouldPlayResponse.current) {
      synthesizeSpeech(textToSpeak);
      shouldPlayResponse.current = false;
    }
  }, [shouldPlayResponse.current]);

  return null;
};

export default TextToSpeech;
