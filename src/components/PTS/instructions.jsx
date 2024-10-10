import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import data from "../Data/PTSData.jsx";
import { RiArrowRightDoubleFill, RiArrowLeftDoubleFill } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import SkeletonLoader from "../Skeletons/SkeletonMaterialOne.jsx";
import "../Home.css";
import { FaCircleArrowUp } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { PiMicrophoneFill, PiMicrophoneSlashFill } from "react-icons/pi";
import { useSwipeable } from "react-swipeable";
import LanguagePopUp from "../Features/LanguagePopUp.jsx";
import { BsArrowRepeat } from "react-icons/bs";

const speakText = (text, isMuted, language) => {
  if (isMuted) return;

  window.speechSynthesis.cancel(); // Cancel any ongoing speech

  const utterance = new SpeechSynthesisUtterance(text);
  switch (language) {
    case 'en':
      utterance.lang = 'en-US';
      break;
    case 'fr':
      utterance.lang = 'fr-FR';
      break;
    case 'zh':
      utterance.lang = 'cmn-Hans-CN';
      break;
    case 'es':
      utterance.lang = 'es-ES';
      break;
    case 'de':
      utterance.lang = 'de-DE';
      break;
    case 'it':
      utterance.lang = 'it-IT';
      break;
    case 'ja':
      utterance.lang = 'ja-JP';
      break;
    case 'ko':
      utterance.lang = 'ko-KR';
      break;
    case 'nl':
      utterance.lang = 'nl-NL';
      break;
    case 'pl':
      utterance.lang = 'pl-PL';
      break;
    case 'pt':
      utterance.lang = 'pt-BR';
      break;
    case 'ru':
      utterance.lang = 'ru-RU';
      break;
    case 'hi':
      utterance.lang = 'hi-IN';
      break;
    case 'ar':
      utterance.lang = 'ar-SA';
      break;
    case 'bg':
      utterance.lang = 'bg-BG';
      break;
    case 'ca':
      utterance.lang = 'ca-ES';
      break;
    case 'cs':
      utterance.lang = 'cs-CZ';
      break;
    case 'da':
      utterance.lang = 'da-DK';
      break;
    case 'el':
      utterance.lang = 'el-GR';
      break;
    case 'fi':
      utterance.lang = 'fi-FI';
      break;
    case 'he':
      utterance.lang = 'he-IL';
      break;
    case 'hu':
      utterance.lang = 'hu-HU';
      break;
    case 'id':
      utterance.lang = 'id-ID';
      break;
    case 'lt':
      utterance.lang = 'lt-LT';
      break;
    case 'lv':
      utterance.lang = 'lv-LV';
      break;
    case 'ms':
      utterance.lang = 'ms-MY';
      break;
    case 'no':
      utterance.lang = 'nb-NO';
      break;
    case 'ro':
      utterance.lang = 'ro-RO';
      break;
    case 'sk':
      utterance.lang = 'sk-SK';
      break;
    case 'sv':
      utterance.lang = 'sv-SE';
      break;
    case 'th':
      utterance.lang = 'th-TH';
      break;
    case 'tr':
      utterance.lang = 'tr-TR';
      break;
    case 'uk':
      utterance.lang = 'uk-UA';
      break;
    case 'vi':
      utterance.lang = 'vi-VN';
      break;
    case 'af':
      utterance.lang = 'af-ZA';
      break;
    case 'am':
      utterance.lang = 'am-ET';
      break;
    case 'az':
      utterance.lang = 'az-AZ';
      break;
    case 'bn':
      utterance.lang = 'bn-BD';
      break;
    case 'eu':
      utterance.lang = 'eu-ES';
      break;
    case 'fil':
      utterance.lang = 'fil-PH';
      break;
    case 'gl':
      utterance.lang = 'gl-ES';
      break;
    case 'gu':
      utterance.lang = 'gu-IN';
      break;
    case 'hr':
      utterance.lang = 'hr-HR';
      break;
    case 'zu':
      utterance.lang = 'zu-ZA';
      break;
    case 'jv':
      utterance.lang = 'jv-ID';
      break;
    case 'kn':
      utterance.lang = 'kn-IN';
      break;
    case 'km':
      utterance.lang = 'km-KH';
      break;
    case 'lo':
      utterance.lang = 'lo-LA';
      break;
    case 'ne':
      utterance.lang = 'ne-NP';
      break;
    case 'si':
      utterance.lang = 'si-LK';
      break;
    case 'su':
      utterance.lang = 'su-ID';
      break;
    case 'sw':
      utterance.lang = 'sw-TZ';
      break;
    case 'ta':
      utterance.lang = 'ta-IN';
      break;
    case 'te':
      utterance.lang = 'te-IN';
      break;
    case 'ur':
      utterance.lang = 'ur-PK';
      break;
    case 'hy':
      utterance.lang = 'hy-AM';
      break;
    case 'ka':
      utterance.lang = 'ka-GE';
      break;
    case 'sr':
      utterance.lang = 'sr-RS';
      break;
    case 'sl':
      utterance.lang = 'sl-SI';
      break;
    default:
      utterance.lang = 'en-US';
  }
  utterance.onstart = () => console.log("Speech started");
  utterance.onend = () => console.log("Speech ended");
  utterance.onerror = (event) => console.error("Speech error:", event);

  window.speechSynthesis.speak(utterance);
};

const Materials = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isStepsOpen, setStepsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("mm");
  const [isLanguagePopUpOpen, setLanguagePopUpOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const titleWithId = data.find((item) => item.id === id);
  const stepsRef = useRef(null);

  const units = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];

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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSteps = () => {
    setStepsOpen(!isStepsOpen);
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
    if (isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  useEffect(() => {
    if (!loading && titleWithId) {
      speakStepDescription();
    }
  }, [currentIndex, loading, titleWithId, i18n.language]);

  const handlePrevious = () => {
    setImageLoading(true);
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    setImageLoading(false);
    speakStepDescription();
    console.log("pressed");
    console.log(`Current step description: ${t(titleWithId.steps[currentIndex].description)}`);
  };

  const handleNext = () => {

    setImageLoading(true);
    setCurrentIndex((prevIndex) =>
      prevIndex < titleWithId.steps.length - 1 ? prevIndex + 1 : prevIndex
    );
    setImageLoading(false);
    speakStepDescription();
    console.log(`Current step description: ${t(titleWithId.steps[currentIndex].description)}`);
  };

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
    setCurrentIndex(index);
    toggleSteps();
    speakStepDescription();
    console.log(`Current step description: ${t(titleWithId.steps[currentIndex].description)}`);
  };

  const speakStepDescription = () => {
    const step = titleWithId.steps[currentIndex];
    const textToSpeak = t(step.description);
    const materialsText = step.materials.map(material => t(material)).join(", ");
    const fullTextToSpeak = `${textToSpeak}. ${t("Materials used")}: ${materialsText}.`;
    speakText(fullTextToSpeak, isMuted, i18n.language);
  };

  const handleClickOutside = (event) => {
    if (stepsRef.current && !stepsRef.current.contains(event.target)) {
      setStepsOpen(false);
    }
  };

  useEffect(() => {
    if (isStepsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  const openLanguagePopUp = () => {
    setLanguagePopUpOpen(true);
  };

  const closeLanguagePopUp = () => {
    setLanguagePopUpOpen(false);
  };

  const handleLanguageSelection = (lang) => {
    i18n.changeLanguage(lang);
    closeLanguagePopUp();
    speakText(t(`${lang}_welcome`), lang, false);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!titleWithId) {
    return <div>{t("Materials not found")}</div>;
  }

  return (
    <>
    <div className="border-t border-black ff-xl flex justify-between items-center">
      <div className="flex items-center pl-6 mt-4 mb-2 ff-xl mini">
        <button className="flex items-center" onClick={goBack}>
          <IoMdArrowBack size={20} />
        </button>
        <h1 className="ml-2">{t(titleWithId.title)}</h1>
      </div>
      {windowWidth <= 1024 && (
        <button
          className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-9 mr-4 mt-4 text-smm"
          onClick={toggleSteps}
        >
          <RiArrowRightDoubleFill size={24} />
          <h1 className="mt-[0.2rem] text-smm">{t("Steps")}</h1>
        </button>
      )}
    </div>

      <div className="flex pr-7 pl-7 flex-col">
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
            <h1 className="text-smm">{t("Previous")}</h1>
          </button>
          <p className="text-smm">
            {currentIndex + 1} / {titleWithId.steps.length}
          </p>
          <button className="flex items-center mini" onClick={handleNext}>
            <h1 className="text-smm">{t("Next")}</h1>
            <IoIosArrowForward />
          </button>
        </div>
        <div className="flex-col mt-5">
          <div className="flex w-full justify-between items-center">
            <h1 className="underline underline-offset-2 text-smm">
              {t("Prepare the Site")}
            </h1>

            <div className="flex items-center">
              <button
                className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-8 ml-2"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <>
                    <div className="flex text-smm p-2">
                      <PiMicrophoneSlashFill size={24} />
                      <p>Speak</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex text-smm p-2">
                      <PiMicrophoneFill size={24} />
                      <p>Speak</p>
                    </div>
                  </>
                )}
              </button>
              <button
                className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-8 ml-2"
                onClick={speakStepDescription}
              >
                <div className="flex text-smm p-1">
                  <BsArrowRepeat size={24} />
                  <p>Repeat</p>
                </div>
              </button>
            </div>
          </div>
          <p className="mt-6 text-smm">
            {t(titleWithId.steps[currentIndex].description)}
          </p>

          <h1 className="underline underline-offset-2 mt-9 text-smm">
            {t("Material list")}
          </h1>

          <div className="flex w-full justify-between mt-7 materials-font">
            <div className="leading-7">
              {titleWithId.steps[currentIndex].materials.map(
                (material, index) => (
                  <p key={index}>{t(material)}</p>
                )
              )}
            </div>
          </div>

          <div className="flex flex-col text-smm mt-7">
            <div className="flex justify-between items-center">
              <h2 className="text-smm underline-offset-2 underline text-black">
                {t("Conversion")}
              </h2>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center">
                <input
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="p-1 border border-gray-300 rounded-sm mr-4 bg-gray-200 text-smm"
                  placeholder={t("Enter value")}
                />
                <select
                  value={fromUnit}
                  onChange={handleFromUnitChange}
                  className="p-2 text-smm"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.toUpperCase()}
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
                  placeholder={t("Converted value")}
                />
                <select
                  value={toUnit}
                  onChange={handleToUnitChange}
                  className="p-2 text-smm"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <h1 className="underline underline-offset-2 mt-6 text-smm">
            {t("References")}
          </h1>

          <iframe
            className="w-full h-auto mt-6 pr-4 pb-3"
            src="https://www.youtube.com/embed/1WwPw7itMv4?modestbranding=1"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>

          <p className="materials-font mb-5">
            {t("How to dig holes about 40cm deep | Youtube | 2024")}
          </p>
        </div>

        <div
          className={`grid grid-cols-12 top-[73px] w-full min-h-screen fixed transition-transform duration-300 ease-in-out ${
            isStepsOpen ? "translate-x-0" : "translate-x-full"
          }`}
          ref={stepsRef}
          {...swipeHandlers}
        >
          <div className="col-span-4 bg-white backdrop-blur-[1px] bg-opacity-10 flex flex-col justify-start items-center"></div>
          <div className="col-span-8 bg-white p-6 border-l-2 border-gray-600 overflow-y-auto scrollable-area">
            <div className="flex justify-end">
              <button
                className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-9 mr-4 mb-4"
                onClick={toggleSteps}
              >
                <h1 className="text-smm">{t("Close")}</h1>
                <RiArrowLeftDoubleFill size={24} />
              </button>
            </div>

            <h1 className="mini underline underline-offset-2 mb-4">
              {t("Steps")}
            </h1>

            {/* Render the current step on top */}
            <div className="mb-4">
              <p className="leading-7 mb-8 text-smm mr-10 text-right font-bold">
                <IoIosArrowForward size={24} className="inline-block mr-2" />
                {currentIndex + 1}. {t(titleWithId.steps[currentIndex].description)}
              </p>
            </div>

            {/* Render all steps */}
            {titleWithId.steps.map((step, index) => (
              <p
                key={index}
                className={`leading-7 mb-8 text-smm mr-10 text-left cursor-pointer ${
                  index === currentIndex
                    ? "font-bold"
                    : ""
                }`}
                onClick={() => handleStepClick(index)}
              >
                {index + 1}. {t(step.description)}
              </p>
            ))}
          </div>
        </div>

        {isStepsOpen && (
          <button
            className="fixed bottom-4 right-[1] bg-gray-200 p-2 rounded-full shadow-lg"
            onClick={scrollToTop}
          >
            <FaCircleArrowUp size={24} />
          </button>
        )}
      </div>

      <footer className="fixed bottom-4 right-4 z-50">
        {/* <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 bg-gray-200 rounded-full shadow-lg"
        >
          {isMuted ? (
            <PiMicrophoneSlashFill size={24} />
          ) : (
            <PiMicrophoneFill size={24} />
          )}
        </button> */}
      </footer>

      {isLanguagePopUpOpen && (
        <LanguagePopUp
          onClose={closeLanguagePopUp}
          onSelectLanguage={handleLanguageSelection}
        />
      )}
    </>
  );
};

export default Materials;
