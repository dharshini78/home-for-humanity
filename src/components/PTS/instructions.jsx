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
import he from "he"; // Import the he library
import { useLanguage } from "../Features/languageContext.jsx";
import { IoConstruct } from "react-icons/io5";

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
  const [audioUrl, setAudioUrl] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const stepsRef = useRef(null);
  const currentStepRef = useRef(null);
  const titleWithId = data.find((item) => item.id === id);

  const units = ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"];
  const languageCodeMapping = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    zh: "yue-HK",
    hi: "hi-IN",
    ar: "ar-XA",
    bg: "bg-BG",
    br: "br-FR",
    cs: "cs-CZ",
    da: "da-DK",
    fi: "fi-FI",
    he: "he-IL",
    hu: "hu-HU",
    id: "id-ID",
    is: "is-IS",
    it: "it-IT",
    ja: "ja-JP",
    ko: "ko-KR",
    lt: "lt-LT",
    lv: "lv-LV",
    ms: "ms-MY",
    nl: "nl-NL",
    no: "nb-NO",
    pl: "pl-PL",
    pt: "pt-PT",
    ro: "ro-RO",
    ru: "ru-RU",
    sk: "sk-SK",
    sv: "sv-SE",
    th: "th-TH",
    tr: "tr-TR",
    uk: "uk-UA",
    vi: "vi-VN",
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

  const fetchTTSAudio = async (
    content,
    targetLanguage,
    shelterName,
    pageNumber
  ) => {
    try {
      const ttsLanguageCode = languageCodeMapping[targetLanguage] || "en-US"; // Default to 'en-US' if mapping is not found

      const response = await fetch(
        "https://api.homeforhumanity.xrvizion.com/shelter/gettts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            targetLanguage: ttsLanguageCode, // Use the TTS language code
            shelterName: shelterName.replace(/\s+/g, ""), // Remove spaces
            pageNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend response:", data); // Detailed logging

      if (data.msg === "Success" && data.audioBuffer && data.audioBuffer.data) {
        const audioBuffer = new Uint8Array(data.audioBuffer.data);
        const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio URL:", audioUrl); // Debugging statement
        return audioUrl;
      } else {
        throw new Error(
          "Failed to fetch TTS audio: Invalid response structure"
        );
      }
    } catch (error) {
      console.error("Error fetching TTS audio:", error);
      return null;
    }
  };

  const decodeContent = (content) => {
    if (typeof content === "string") {
      return he.decode(content);
    } else if (Array.isArray(content)) {
      return content.map(decodeContent);
    } else if (typeof content === "object" && content !== null) {
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
        "Timber-Frame Shelter": "timbershelter_instructions_en.json",
        "Octagreen Shelter": "octagreenshelter_instructions_en.json",
        "Temporary Shelter": "temporaryshelter_instructions_en.json",
        "Bamboo Shelter": "bambooshelter_instructions_en.json",
        "Superadobe Shelter": "superadobeshelter_instructions_en.json",
        // Add other shelters as needed
      };

      const fileName =
        fileNameMapping[titleWithId.title] || "default_instructions_en.json";

      console.log("Fetching translated content for:", {
        shelterName: titleWithId.title.replace(/\s+/g, ""),
        langCode: language,
        fileName: fileName,
      });

      const response = await fetch(
        "https://api.homeforhumanity.xrvizion.com/shelter/gettranslation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shelterName: titleWithId.title.replace(/\s+/g, ""), // Remove spaces
            langCode: language,
            fileName: fileName,
          }),
        }
      );

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
      console.error("Error fetching translated content:", error);
    }
  };

  useEffect(() => {
    // Fetch translated content for the selected language on initial load
    fetchTranslatedContent(selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSteps = () => {
    setStepsOpen(!isStepsOpen);
    if (!isStepsOpen && currentStepRef.current) {
      currentStepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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


  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  useEffect(() => {
    if (!loading && translatedContent && autoPlayEnabled) {
      speakStepDescription();
    }
  }, [currentIndex, loading, translatedContent, autoPlayEnabled]);

  const scrollToTop = () => {
    const scrollableArea = document.querySelector(".scrollable-area");
    if (scrollableArea) {
      scrollableArea.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    // First stop any playing audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
    }
    setIsSpeaking(false);
    setCurrentAudio(null);
    setAudioUrl(null);

    // Then navigate
    navigate(`/haven/${id}`);
};

  // const handleStepClick = (index) => {
  //   clearTimeout(audioTimeout);
  //   stopCurrentAudio();
  //   setAudioUrl(null); // Clear the audio URL

  //   const timeoutId = setTimeout(() => {
  //     setCurrentIndex(index);
  //     if (windowWidth <= 1024) {
  //       toggleSteps();
  //     }
  //   }, 500); // 1-second delay

  //   setAudioTimeout(timeoutId);
  // };

  useEffect(() => {
    // Clear audio state when language changes
    stopCurrentAudio();
    setAudioUrl(null);
  }, [selectedLanguage]);
  const [currentAudio, setCurrentAudio] = useState(null);
// Add/update these state variables at the top of your component
const [isAudioPending, setIsAudioPending] = useState(false);
const audioTimeoutRef = useRef(null);
const pendingAudioFetchRef = useRef(null);

// Replace the existing speakStepDescription function
// Update this state at component level

const speakStepDescription = async () => {
  // If audio is currently playing, just stop it
  if (isSpeaking) {
    stopCurrentAudio();
    return;
  }

  // If we already have the audio URL, play it immediately
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    audio.play();
    setIsSpeaking(true);

    audio.onended = () => {
      setIsSpeaking(false);
      setCurrentAudio(null);
    };

    audio.onerror = (error) => {
      console.error("Error playing audio:", error);
      setIsSpeaking(false);
      setCurrentAudio(null);
    };
    return;
  }

  // If we need to fetch new audio
  if (!isAudioPending) {
    const step = translatedContent.instructions[`step${currentIndex + 1}`];
    const textToSpeak = step.description;
    const materialsText = step.usedMaterials.join(", ");
    const fullTextToSpeak = `${textToSpeak}. ${translatedContent.others.materialsList} ............ ${materialsText}.`;

    setIsAudioPending(true);

    try {
      const url = await fetchTTSAudio(
        fullTextToSpeak,
        selectedLanguage,
        titleWithId.title,
        currentIndex + 1
      );

      if (url) {
        setAudioUrl(url);
        const audio = new Audio(url);
        setCurrentAudio(audio);
        audio.play();
        setIsSpeaking(true);

        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentAudio(null);
        };

        audio.onerror = (error) => {
          console.error("Error playing audio:", error);
          setIsSpeaking(false);
          setCurrentAudio(null);
        };
      }
    } catch (error) {
      console.error("Error fetching audio:", error);
    } finally {
      setIsAudioPending(false);
    }
  }
};

const stopCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  setIsSpeaking(false);
  setCurrentAudio(null);
  // setAutoPlayEnabled(false);
};

// Add cleanup in useEffect
useEffect(() => {
  return () => {
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
    }
    if (pendingAudioFetchRef.current) {
      pendingAudioFetchRef.current.abort();
    }
    stopCurrentAudio();
  };
}, []);

// Update handleStepClick
const handleStepClick = (index) => {
  if (audioTimeoutRef.current) {
    clearTimeout(audioTimeoutRef.current);
  }
  if (pendingAudioFetchRef.current) {
    pendingAudioFetchRef.current.abort();
  }
  stopCurrentAudio();
  setAudioUrl(null);

  setCurrentIndex(index);
  if (windowWidth <= 1024) {
    toggleSteps();
  }
};

const handlePrevious = () => {
  // Clear any existing timeouts
  if (audioTimeoutRef.current) {
    clearTimeout(audioTimeoutRef.current);
  }
  // Cancel any pending fetch requests
  if (pendingAudioFetchRef.current) {
    pendingAudioFetchRef.current.abort();
  }
  stopCurrentAudio();
  setAudioUrl(null);
  setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
};

const handleNext = () => {
  // Clear any existing timeouts
  if (audioTimeoutRef.current) {
    clearTimeout(audioTimeoutRef.current);
  }
  // Cancel any pending fetch requests
  if (pendingAudioFetchRef.current) {
    pendingAudioFetchRef.current.abort();
  }
  stopCurrentAudio();
  setAudioUrl(null);
  setCurrentIndex((prevIndex) =>
    prevIndex < Object.keys(translatedContent.instructions).length - 1
      ? prevIndex + 1
      : prevIndex
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
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-700 text-lg font-semibold">
        Instructions not found
      </div>
    );
  }

  const Tooltip = ({ children, text, isVisible }) => {
    return (
      <div className="relative group">
        {children}
        {isVisible && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap z-50">
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  const getConstructionPhase = (shelterType, currentIndex) => {
    switch (shelterType) {
      case "Temporary Shelter":
        if (currentIndex >= 0 && currentIndex < 9) {
          return translatedContent.construction.staves;
        } else if (currentIndex >= 9 && currentIndex < 14) {
          return translatedContent.construction.framework;
        } else if (currentIndex >= 14 && currentIndex < 19) {
          return translatedContent.construction.joinParts;
        } else if (currentIndex >= 19 && currentIndex < 26) {
          return translatedContent.construction.roofStructure;
        } else if (currentIndex >= 26 && currentIndex < 32) {
          return translatedContent.construction.waterProofing;
        } else if (currentIndex >= 32 && currentIndex < 40) {
          return translatedContent.construction.bracing;
        } else if (currentIndex >= 40 && currentIndex < 47) {
          return translatedContent.construction.roof;
        } else if (currentIndex >= 47 && currentIndex < 53) {
          return translatedContent.construction.floor;
        } else {
          return "";
        }
      case "Superadobe Shelter":
        if (currentIndex >= 0 && currentIndex < 2) {
          return translatedContent.construction.preparation;
        } else if (currentIndex >= 2 && currentIndex < 18) {
          return translatedContent.construction.foundation;
        } else if (currentIndex >= 18 && currentIndex < 27) {
          return translatedContent.construction.floor;
        } else if (currentIndex >= 27 && currentIndex < 37) {
          return translatedContent.construction.dome;
        } else if (currentIndex >= 37 && currentIndex < 49) {
          return translatedContent.construction.dome;
        } else if (currentIndex >= 49 && currentIndex < 58) {
          return translatedContent.construction.storageFloor;
        } else if (currentIndex >= 58 && currentIndex < 59) {
          return translatedContent.construction.roof;
        } else if (currentIndex >= 59 && currentIndex < 75) {
          return translatedContent.construction.plaster;
        } else {
          return "";
        }
      case "Bamboo Shelter":
        if (currentIndex >= 0 && currentIndex < 4) {
          return translatedContent.construction.foundation;
        } else if (currentIndex >= 4 && currentIndex < 10) {
          return translatedContent.construction.primaryColumns;
        } else if (currentIndex >= 10 && currentIndex < 16) {
          return translatedContent.construction.beams;
        } else if (currentIndex >= 16 && currentIndex < 21) {
          return translatedContent.construction.secondaryColumns;
        } else if (currentIndex >= 21 && currentIndex < 27) {
          return translatedContent.construction.bracings1;
        } else if (currentIndex >= 27 && currentIndex < 33) {
          return translatedContent.construction.bracings2;
        } else if (currentIndex >= 33 && currentIndex < 40) {
          return translatedContent.construction.bracings3;
        } else if (currentIndex >= 40 && currentIndex < 43) {
          return translatedContent.construction.rodBeams;
        } else if (currentIndex >= 43 && currentIndex < 51) {
          return translatedContent.construction.roofMainFrame;
        } else if (currentIndex >= 51 && currentIndex < 59) {
          return translatedContent.construction.roofSecondaryFrame;
        } else if (currentIndex >= 59 && currentIndex < 64) {
          return translatedContent.construction.rafters;
        } else if (currentIndex >= 64 && currentIndex < 73) {
          return translatedContent.construction.roofPanels;
        } else if (currentIndex >= 73 && currentIndex < 82) {
          return translatedContent.construction.facade;
        } else {
          return "";
        }
      case "Octagreen Shelter":
        if (currentIndex >= 0 && currentIndex < 11) {
          return translatedContent.construction.foundation;
        } else if (currentIndex >= 11 && currentIndex < 24) {
          return translatedContent.construction.brickFoundation;
        } else if (currentIndex >= 24 && currentIndex < 47) {
          return translatedContent.construction.wallPanels;
        } else if (currentIndex >= 47 && currentIndex < 59) {
          return translatedContent.construction.doorPanels;
        } else if (currentIndex >= 59 && currentIndex < 67) {
          return translatedContent.construction.assemblyPanels;
        } else if (currentIndex >= 67 && currentIndex < 81) {
          return translatedContent.construction.roof;
        } else if (currentIndex >= 81 && currentIndex < 109) {
          return translatedContent.construction.grassRoof;
        } else if (currentIndex >= 109 && currentIndex < 116) {
          return translatedContent.construction.walls;
        } else if (currentIndex >= 116 && currentIndex < 126) {
          return translatedContent.construction.flooring;
        } else {
          return "";
        }
      case "Timber-Frame Shelter":
        if (currentIndex >= 0 && currentIndex < 9) {
          return translatedContent.construction.foundation;
        } else if (currentIndex >= 9 && currentIndex < 14) {
          return translatedContent.construction.ridgeBeam;
        } else if (currentIndex >= 14 && currentIndex < 16) {
          return translatedContent.construction.masonry;
        } else if (currentIndex >= 16 && currentIndex < 21) {
          return translatedContent.construction.roofStructure;
        } else if (currentIndex >= 21 && currentIndex < 29) {
          return translatedContent.construction.waterProofing;
        } else if (currentIndex >= 29 && currentIndex < 32) {
          return translatedContent.construction.insulation;
        } else if (currentIndex >= 32 && currentIndex < 37) {
          return translatedContent.construction.metalRoof;
        } else if (currentIndex >= 37 && currentIndex < 41) {
          return translatedContent.construction.guyRopes;
        } else {
          return "";
        }
      default:
        return "";
    }
  };

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
                <h1 className="mt-[0.2rem] text-smm">
                  {translatedContent.others.steps}
                </h1>
              </button>
            )}
          </div>

          <div className="flex pr-5 pl-5 flex-col">
            <div
              className="mt-4 w-full max-w-[800px] mx-auto"
              {...swipeHandlers}
            >
              {imageLoading ? (
                <SkeletonLoader />
              ) : (
                <img
                  src={titleWithId.steps[currentIndex].img}
                  alt={`Step ${currentIndex + 1}`}
                  className="standard-image"
                  onLoad={() => setImageLoading(false)}
                />
              )}
            </div>

            <div className="flex w-full justify-between items-center mt-4">
              <button className="flex items-center" onClick={handlePrevious}>
                <IoIosArrowBack />
                <h1 className="text-smm">
                  {translatedContent.others.previous}
                </h1>
              </button>
              <p className="text-smm">
                {currentIndex + 1} /{" "}
                {Object.keys(translatedContent.instructions).length}
              </p>
              <button className="flex items-center mini" onClick={handleNext}>
                <h1 className="text-smm">{translatedContent.others.next}</h1>
                <IoIosArrowForward />
              </button>
            </div>

            <div className="flex-col mt-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="underline underline-offset-2 text-smm mr-4 steps-heading">
                    {translatedContent.others.instructions}
                  </h1>
                  <button
  onClick={() => {
    if (isSpeaking) {
      stopCurrentAudio();
      setAutoPlayEnabled(false);
    } else {
      setAutoPlayEnabled(true);
      speakStepDescription();
    }
  }}
  className="p-[0.6rem] bg-gray-200 rounded-full border-black hover:bg-gray-900 hover:text-white hover:border-white active:bg-black border-[0.02rem]"
>
  {isSpeaking ? <FaStop size={12} /> : <FaPlay size={12} />}
</button>
                </div>
              </div>
              <div className="relative">
  <h2 className="text-smm mt-4 inline-block mr-2">
    {getConstructionPhase(titleWithId.title, currentIndex)} :
  </h2>
  <p className="text-smm mt-4 inline">
    {translatedContent.instructions[`step${currentIndex + 1}`].description}
  </p>
</div>

              <h1 className="underline underline-offset-2 mt-4 text-smm">
                {translatedContent.others.materialsList}
              </h1>

              <div className="flex w-full justify-between mt-4 materials-font">
                <div className="leading-7">
                  {translatedContent.instructions[
                    `step${currentIndex + 1}`
                  ].usedMaterials.map((material, index) => (
                    <p key={index}>{material}</p>
                  ))}
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
          <div className="flex justify-start mb-4 mt-3">
            <h1 className="mini underline underline-offset-2 mb-4">
              {translatedContent.others.steps}
            </h1>
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
  .steps-heading {
    text-align: left;
  }
  .standard-image {
    width: 900px; /* Standard width */
    height: 500px; /* Standard height */
    object-fit: contain; /* Maintain aspect ratio */
    
  }
`}</style>

    </>
  );
};

export default Materials;
