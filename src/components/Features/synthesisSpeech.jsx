import axios from 'axios';

const synthesizeSpeech = async (text, languageCode) => {
  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=YOUR_API_KEY`,
      {
        input: { text },
        voice: { languageCode, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      }
    );

    const audioContent = response.data.audioContent;
    const audioBlob = new Blob([Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return null;
  }
};

export default synthesizeSpeech;
