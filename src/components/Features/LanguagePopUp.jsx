import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const speakText = (text, isMuted, language) => {
  if (isMuted) return;

  window.speechSynthesis.cancel(); // Cancel any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Define language codes with fallbacks
  const languageCodes = {
    'en': ['en-US', 'en-GB', 'en'],
    'fr': ['fr-FR', 'fr'],
    'zh': ['zh-CN', 'zh-TW', 'zh'],
    'es': ['es-ES', 'es-MX', 'es'],
    'de': ['de-DE', 'de'],
    'it': ['it-IT', 'it'],
    'ja': ['ja-JP', 'ja'],
    'ko': ['ko-KR', 'ko'],
    'nl': ['nl-NL', 'nl'],
    'pl': ['pl-PL', 'pl'],
    'pt': ['pt-BR', 'pt-PT', 'pt'],
    'ru': ['ru-RU', 'ru'],
    'hi': ['hi-IN', 'hi'],
    'ar': ['ar-SA', 'ar'],
    'bg': ['bg-BG', 'bg'],
    'ca': ['ca-ES', 'ca'],
    'cs': ['cs-CZ', 'cs'],
    'da': ['da-DK', 'da'],
    'el': ['el-GR', 'el'],
    'fi': ['fi-FI', 'fi'],
    'he': ['he-IL', 'he'],
    'hu': ['hu-HU', 'hu'],
    'id': ['id-ID', 'id'],
    'lt': ['lt-LT', 'lt'],
    'lv': ['lv-LV', 'lv'],
    'ms': ['ms-MY', 'ms'],
    'no': ['nb-NO', 'nn-NO', 'no'],
    'ro': ['ro-RO', 'ro'],
    'sk': ['sk-SK', 'sk'],
    'sv': ['sv-SE', 'sv'],
    'th': ['th-TH', 'th'],
    'tr': ['tr-TR', 'tr'],
    'uk': ['uk-UA', 'uk'],
    'vi': ['vi-VN', 'vi'],
    'af': ['af-ZA', 'af'],
    'am': ['am-ET', 'am'],
    'az': ['az-AZ', 'az'],
    'bn': ['bn-BD', 'bn-IN', 'bn'],
    'eu': ['eu-ES', 'eu'],
    'fil': ['fil-PH', 'fil'],
    'gl': ['gl-ES', 'gl'],
    'gu': ['gu-IN', 'gu'],
    'hr': ['hr-HR', 'hr'],
    'zu': ['zu-ZA', 'zu'],
    'jv': ['jv-ID', 'jv'],
    'kn': ['kn-IN', 'kn'],
    'km': ['km-KH', 'km'],
    'lo': ['lo-LA', 'lo'],
    'ne': ['ne-NP', 'ne'],
    'si': ['si-LK', 'si'],
    'su': ['su-ID', 'su'],
    'sw': ['sw-TZ', 'sw-KE', 'sw'],
    'ta': ['ta-IN', 'ta-SG', 'ta'],
    'te': ['te-IN', 'te'],
    'ur': ['ur-PK', 'ur-IN', 'ur'],
    'hy': ['hy-AM', 'hy'],
    'ka': ['ka-GE', 'ka'],
    'sr': ['sr-RS', 'sr'],
    'sl': ['sl-SI', 'sl'],
  };

  // Function to find an available voice for the given language
  const findVoice = (langCodes) => {
    const voices = window.speechSynthesis.getVoices();
    for (const code of langCodes) {
      const voice = voices.find(v => v.lang.startsWith(code));
      if (voice) return voice;
    }
    return null;
  };

  // Set language and voice
  const langCodes = languageCodes[language] || languageCodes['en'];
  utterance.lang = langCodes[0];
  const voice = findVoice(langCodes);
  if (voice) utterance.voice = voice;

  utterance.onstart = () => console.log("Speech started");
  utterance.onend = () => console.log("Speech ended");
  utterance.onerror = (event) => console.error("Speech error:", event);

  window.speechSynthesis.speak(utterance);
};

const LanguagePopUp = ({ onClose, onSelectLanguage }) => {
  const { i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'br', name: 'Breton' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'ms', name: 'Malay' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sv', name: 'Swedish' },
    { code: 'th', name: 'Thai' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'vi', name: 'Vietnamese' },
  ];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageSelection = (lang) => {
    i18n.changeLanguage(lang);
    onSelectLanguage(lang);
    speakText(i18n.t(`${lang}_welcome`), lang, false); // Speak a welcome message in the selected language
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-3/4 max-w-md">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <IoMdClose size={24} />
        </button>
        <h1 className="mb-4 text-xl font-bold">{i18n.t("Select Language")}</h1>

        <input
          type="text"
          placeholder={i18n.t("Search Language")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelection(lang.code)}
              className="w-full p-3 text-left border-b border-gray-300 text-smm"
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { speakText };
export default LanguagePopUp;
