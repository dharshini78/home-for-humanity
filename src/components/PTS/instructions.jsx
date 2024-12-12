import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import SkeletonLoader from "../Skeletons/SkeletonMaterialOne.jsx";
import "../Home.css";
import { FaCircleArrowUp, FaStop, FaPlay } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { useSwipeable } from "react-swipeable";
import LanguagePopUp from "../Features/LanguagePopUp.jsx";
import Navbar from "../Features/navbar.jsx";
import data from "../Data/PTSData.jsx";
import he from 'he'; // Import the he library
import { useLanguage } from "../Features/languageContext.jsx";

const Materials = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isStepsOpen, setStepsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("in");
  const [isLanguagePopUpOpen, setLanguagePopUpOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [translatedContent, setTranslatedContent] = useState(null);
  const { selectedLanguage } = useLanguage(); // Use the LanguageContext

  const stepsRef = useRef(null);
  const currentStepRef = useRef(null);
  const titleWithId = data.find((item) => item.id === id);

  const units = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];
  const languageCodeMapping = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'zh': 'yue-HK',
    'hi': 'hi-IN',
    'ar': 'ar-XA',
    'bg': 'bg-BG',
    'br': 'br-FR',
    'cs': 'cs-CZ',
    'da': 'da-DK',
    'fi': 'fi-FI',
    'he': 'he-IL',
    'hu': 'hu-HU',
    'id': 'id-ID',
    'is': 'is-IS',
    'it': 'it-IT',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'lt': 'lt-LT',
    'lv': 'lv-LV',
    'ms': 'ms-MY',
    'nl': 'nl-NL',
    'no': 'nb-NO',
    'pl': 'pl-PL',
    'pt': 'pt-PT',
    'ro': 'ro-RO',
    'ru': 'ru-RU',
    'sk': 'sk-SK',
    'sv': 'sv-SE',
    'th': 'th-TH',
    'tr': 'tr-TR',
    'uk': 'uk-UA',
    'vi': 'vi-VN',
  };

  const convertUnits = (value, fromUnit, toUnit) => {
    const metersValue = parseFloat(value) || 0;

    const meterConversions = {
      m: 1,
      cm: 100,
      mm: 1000,
      km: 1 / 1000,
      in: 39.3701,
      ft: 3.28084,
      yd: 1.09361,
      mi: 1 / 1609.34,
    };

    const valueInMeters = metersValue / meterConversions[fromUnit];
    return valueInMeters * meterConversions[toUnit];
  };

  const fetchTTSAudio = async (content, targetLanguage, shelterName, pageNumber) => {
    try {
      const ttsLanguageCode = languageCodeMapping[targetLanguage] || 'en-US'; // Default to 'en-US' if mapping is not found

      const response = await fetch('https://api.homeforhumanity.xrvizion.com/shelter/gettts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targetLanguage: ttsLanguageCode, // Use the TTS language code
          shelterName: shelterName.replace(/\s+/g, ''), // Remove spaces
          pageNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data); // Detailed logging

      if (data.msg === "Success" && data.audioBuffer && data.audioBuffer.data) {
        const audioBuffer = new Uint8Array(data.audioBuffer.data);
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Audio URL:', audioUrl); // Debugging statement
        return audioUrl;
      } else {
        throw new Error('Failed to fetch TTS audio: Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching TTS audio:', error);
      return null;
    }
  };

  const decodeContent = (content) => {
    if (typeof content === 'string') {
      return he.decode(content);
    } else if (Array.isArray(content)) {
      return content.map(decodeContent);
    } else if (typeof content === 'object' && content !== null) {
      const decodedObject = {};
      for (const key in content) {
        if (content.hasOwnProperty(key)) {
          decodedObject[key] = decodeContent(content[key]);
        }
      }
      return decodedObject;
    }
    return content;
  };

  const fetchTranslatedContent = async (language) => {
    try {
      const fileNameMapping = {
        "Timber Shelter": "timbershelter_instructions_en.json",
        "Octagreen Shelter": "octagreenshelter_instructions_en.json",
        "Temporary Shelter": "temporaryshelter_instructions_en.json",
        "Bamboo Shelter": "bambooshelter_instructions_en.json",
        "Superadobe Shelter": "superadobeshelter_instructions_en.json",
        // Add other shelters as needed
      };

      const fileName = fileNameMapping[titleWithId.title] || 'default_instructions_en.json';

      console.log("Fetching translated content for:", {
        shelterName: titleWithId.title.replace(/\s+/g, ''),
        langCode: language,
        fileName: fileName,
      });

      const response = await fetch('https://api.homeforhumanity.xrvizion.com/shelter/gettranslation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shelterName: titleWithId.title.replace(/\s+/g, ''), // Remove spaces
          langCode: language,
          fileName: fileName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.msg === "Success") {
        // Decode HTML entities
        const decodedContent = decodeContent(data.translatedContent);
        setTranslatedContent(decodedContent);
      } else {
        console.error("Translation failed:", data.msg);
      }
    } catch (error) {
      console.error('Error fetching translated content:', error);
    }
  };

  useEffect(() => {
    // Fetch translated content for the selected language on initial load
    fetchTranslatedContent(selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSteps = () => {
    setStepsOpen(!isStepsOpen);
    if (!isStepsOpen && currentStepRef.current) {
      currentStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (isStepsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isStepsOpen]);

  useEffect(() => {
    if (!loading && translatedContent) {
      speakStepDescription();
    }
  }, [currentIndex, loading, translatedContent]);

  const scrollToTop = () => {
    const scrollableArea = document.querySelector(".scrollable-area");
    if (scrollableArea) {
      scrollableArea.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    navigate(`/haven/${id}`);
  };

  const handleStepClick = (index) => {
    clearTimeout(audioTimeout);
    stopCurrentAudio();

    const timeoutId = setTimeout(() => {
      setCurrentIndex(index);
      if (windowWidth <= 1024) {
        toggleSteps();
      }
    }, 500); // 1-second delay

    setAudioTimeout(timeoutId);
  };

  const [currentAudio, setCurrentAudio] = useState(null);
  const [audioTimeout, setAudioTimeout] = useState(null);

  const speakStepDescription = async () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const step = translatedContent.instructions[`step${currentIndex + 1}`];
    const textToSpeak = step.description;
    const materialsText = step.usedMaterials.join(", ");
    const fullTextToSpeak = `${textToSpeak}. ${translatedContent.others.materialsList} ${materialsText}.`;

    const timeoutId = setTimeout(async () => {
      const audioUrl = await fetchTTSAudio(fullTextToSpeak, selectedLanguage, titleWithId.title, currentIndex + 1);

      if (audioUrl) {
        const newAudio = new Audio(audioUrl);
        setCurrentAudio(newAudio);
        newAudio.play();
        setIsSpeaking(true);

        newAudio.onended = () => {
          setIsSpeaking(false);
          setCurrentAudio(null);
        };

        newAudio.onerror = (error) => {
          console.error('Error playing audio:', error);
          setIsSpeaking(false);
          setCurrentAudio(null);
        };
      }
    }, 1000); // 2-second delay

    setAudioTimeout(timeoutId);
  };

  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsSpeaking(false);
      setCurrentAudio(null);
    }
  };

  const handlePrevious = () => {
    clearTimeout(audioTimeout);
    stopCurrentAudio();
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    clearTimeout(audioTimeout);
    stopCurrentAudio();
    setCurrentIndex((prevIndex) =>
      prevIndex < Object.keys(translatedContent.instructions).length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  useEffect(() => {
    const handleClickOrTouchOutside = (event) => {
      if (stepsRef.current && !stepsRef.current.contains(event.target)) {
        setStepsOpen(false);
      }
    };

    if (isStepsOpen) {
      document.addEventListener("mousedown", handleClickOrTouchOutside);
      document.addEventListener("touchstart", handleClickOrTouchOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOrTouchOutside);
      document.removeEventListener("touchstart", handleClickOrTouchOutside);
    };
  }, [isStepsOpen]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isStepsOpen) {
        setStepsOpen(false);
      } else {
        setStepsOpen(true);
      }
    },
    onSwipedRight: () => {
      if (isStepsOpen) {
        setStepsOpen(false);
      } else {
        handlePrevious();
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const convertedValue = convertUnits(value, fromUnit, toUnit);
    setOutputValue(convertedValue.toFixed(2));
  };

  const handleFromUnitChange = (e) => {
    setFromUnit(e.target.value);
    const convertedValue = convertUnits(inputValue, e.target.value, toUnit);
    setOutputValue(convertedValue.toFixed(2));
  };

  const handleToUnitChange = (e) => {
    setToUnit(e.target.value);
    const convertedValue = convertUnits(inputValue, fromUnit, e.target.value);
    setOutputValue(convertedValue.toFixed(2));
  };

  const closeLanguagePopUp = () => {
    setLanguagePopUpOpen(false);
  };

  const handleLanguageSelection = (lang) => {
    closeLanguagePopUp();
    fetchTranslatedContent(lang);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!translatedContent) {
    return <div>Materials not found</div>;
  }

  return (
    <>
      <Navbar onLanguageSelect={handleLanguageSelection} />
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 p-2">
        <div className="lg:col-span-2 overflow-y-auto max-h-screen custom-scrollbar">
          <div className="flex justify-between items-center">
            <div className="flex items-center pl-4 mt-2 mb-1">
              <button className="flex items-center" onClick={goBack}>
                <IoMdArrowBack size={23} />
              </button>
              <h1 className="ml-2 mini">{translatedContent.name}</h1>
            </div>
            {windowWidth <= 1024 && (
              <button
                className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-9 mr-4 mt-4 text-smm"
                onClick={toggleSteps}
              >
                <RiArrowLeftDoubleFill size={24} />
                <h1 className="mt-[0.2rem] text-smm">{translatedContent.others.steps}</h1>
              </button>
            )}
          </div>

          <div className="flex pr-5 pl-5 flex-col">

<div className="mt-4 w-full max-w-[800px] mx-auto" {...swipeHandlers}>
          {imageLoading ? (
            <SkeletonLoader />
          ) : (
            <img
              src={titleWithId.steps[currentIndex].img}
              alt={`Step ${currentIndex + 1}`}
              className="w-full h-auto object-cover"
              onLoad={() => setImageLoading(false)}
            />
          )}
        </div>

            <div className="flex w-full justify-between items-center mt-4">
              <button className="flex items-center" onClick={handlePrevious}>
                <IoIosArrowBack />
                <h1 className="text-smm">{translatedContent.others.previous}</h1>
              </button>
              <p className="text-smm">
                {currentIndex + 1} / {Object.keys(translatedContent.instructions).length}
              </p>
              <button className="flex items-center mini" onClick={handleNext}>
                <h1 className="text-smm">{translatedContent.others.next}</h1>
                <IoIosArrowForward />
              </button>
            </div>

            <div className="flex-col mt-5">
              <div className="flex justify-between items-center">

                <div className="flex items-center">
                  <h1 className="underline underline-offset-2 text-smm mr-4">
                    {translatedContent.others.instructions}
                  </h1>
                  <button
  onClick={() => {
    if (isSpeaking) {
      stopCurrentAudio();
    } else {
      speakStepDescription();
    }
  }}
  className="p-[0.6rem] bg-gray-200 rounded-full border-black hover:bg-gray-900 hover:text-white hover:border-white active:bg-black border-[0.02rem]"
>
  {isSpeaking ? <FaStop size={12} /> : <FaPlay size={12} />}
</button>
                </div>
              </div>

              <p className="mt-4 text-smm">
                {translatedContent.instructions[`step${currentIndex + 1}`].description}
              </p>

              <h1 className="underline underline-offset-2 mt-4 text-smm">
                {translatedContent.others.materialsList}
              </h1>

              <div className="flex w-full justify-between mt-4 materials-font">
                <div className="leading-7">
                  {translatedContent.instructions[`step${currentIndex + 1}`].usedMaterials.map(
                    (material, index) => (
                      <p key={index}>{material}</p>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col text-smm mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-smm underline-offset-2 underline text-black">
                    {translatedContent.others.conversion}
                  </h2>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                      className="p-1 border border-gray-300 rounded-sm mr-4 bg-gray-200 text-smm"
                    />
                    <select
                      value={fromUnit}
                      onChange={handleFromUnitChange}
                      className="p-2 text-smm"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={outputValue}
                      readOnly
                      className="p-1 border border-gray-300 rounded-sm mr-4 bg-gray-200 text-smm"
                    />
                    <select
                      value={toUnit}
                      onChange={handleToUnitChange}
                      className="p-2 text-smm"
                    >
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <h1 className="underline underline-offset-2 mt-4 text-smm">
                {translatedContent.others.references}
              </h1>

              <div className="w-full max-w-[560px] mx-auto mt-4 ml-0">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/1WwPw7itMv4?modestbranding=1"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <p className="materials-font mb-5">
                How to dig holes about 40cm deep | YouTube | 2024
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 lg:border-gray-600 lg:pl-4 hidden lg:block overflow-y-auto max-h-screen custom-scrollbar">
          <div className="flex justify-end mb-4">
            <h1 className="mini underline underline-offset-2 mb-4">{translatedContent.others.steps}</h1>
          </div>

          {Object.keys(translatedContent.instructions).map((stepKey, index) => (
            <p
              key={index}
              className={`leading-7 mb-8 text-smm mr-10 text-left cursor-pointer ${
                index === currentIndex
                  ? "border-l-2 border-black pl-3 font-bold"
                  : ""
              }`}
              onClick={() => handleStepClick(index)}
              ref={index === currentIndex ? currentStepRef : null}
            >
              {index + 1}. {translatedContent.instructions[stepKey].description}
            </p>
          ))}
        </div>
      </div>

      <div
        className={`grid grid-cols-12 top-[73px] w-full min-h-screen fixed transition-transform duration-300 ease-in-out ${
          isStepsOpen ? "translate-x-0" : "translate-x-full"
        }`}
        ref={stepsRef}
        {...swipeHandlers}
      >
        <div className="col-span-4 bg-white backdrop-blur-[1px] bg-opacity-10 flex flex-col justify-start items-center"></div>
        <div className="col-span-8 bg-white p-6 border-l-2 border-gray-600 overflow-y-auto scrollable-area border-t-2">
          <div className="flex justify-end">
            <button
              className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-9 mr-4 mb-4"
              onClick={toggleSteps}
            >
              <h1 className="text-smm">{translatedContent.others.close}</h1>
              <RiArrowRightDoubleFill size={24} />
            </button>
          </div>

          <h1 className="mini underline underline-offset-2 mb-4">
            {translatedContent.others.steps}
         </h1>

          {Object.keys(translatedContent.instructions).map((stepKey, index) => (
            <p
              key={index}
              className={`leading-7 mb-8 text-smm mr-10 text-left cursor-pointer ${
                index === currentIndex
                  ? "border-l-2 border-black pl-3 font-bold"
                  : ""
              }`}
              onClick={() => handleStepClick(index)}
              ref={index === currentIndex ? currentStepRef : null}
            >
              {index + 1}. {translatedContent.instructions[stepKey].description}
            </p>
          ))}
        </div>
      </div>

      {isStepsOpen && (
        <footer className="fixed bottom-4 right-4 bg-gray-200 p-2 rounded-full shadow-lg z-50">
          <button onClick={scrollToTop}>
            <FaCircleArrowUp size={24} />
          </button>
        </footer>
      )}

      {isLanguagePopUpOpen && (
        <LanguagePopUp
          onClose={closeLanguagePopUp}
          onSelectLanguage={handleLanguageSelection}
        />
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #888888 #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }
        .aspect-video {
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </>
  );
};

export default Materials;
