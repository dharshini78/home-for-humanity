import React, { useState, useEffect } from "react";
import { IoMdClose, IoMdVolumeOff, IoMdVolumeHigh } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";
import { AiFillDollarCircle } from "react-icons/ai";
import { GoClockFill } from "react-icons/go";
import { BsCloudRainHeavyFill, BsSnow, BsWind } from "react-icons/bs";
import "../Home.css";
import ConditionsPopUp from "../Features/ConditionsPopUp.jsx";
import HeadCountPopUp from "../Features/HeadCountPopUp.jsx";
import ClimatePopUp from "../Features/ClimatePopUp.jsx";
import LanguagePopUp from "../Features/LanguagePopUp.jsx";
import data from "../Data/PTSData.jsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SkeletonLoader from "../Skeletons/SkeletonHome.jsx";
import { useMute } from "../Features/muteContext.jsx";
import Chatbot from "../Features/AudioToText.jsx";

const speakText = (text, lang, isMuted) => {
  if (isMuted) return;

  const utterance = new SpeechSynthesisUtterance(text);

  switch (lang) {
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
    case 'is':
      utterance.lang = 'is-IS';
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

  utterance.onstart = () => console.log('Speech started');
  utterance.onend = () => console.log('Speech ended');
  utterance.onerror = (event) => console.error('Speech error:', event);

  window.speechSynthesis.speak(utterance);
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const { isMuted, toggleMute } = useMute();
  const [openCost, setOpenCost] = useState(false);
  const [openHeadCount, setOpenHeadCount] = useState(false);
  const [openClimate, setOpenClimate] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [sortedData, setSortedData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [costSort, setCostSort] = useState(null);
  const [headCountSort, setHeadCountSort] = useState(null);
  const [climateSort, setClimateSort] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log("Microphone permission granted");
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);

    const homeText = `Welcome to Home for Humanity. You can search for shelters, filter by head count, cost, and climate, and select your language. There are five shelters. Timber shelter, Lari Octagreen shelter, Temporary shelter, Bamboo shelter, Super-adobe-shelter`;
    speakText(homeText, i18n.language, isMuted);
  }, [isMuted, i18n.language]);

  useEffect(() => {
    if (isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  const handleSort = (type, value) => {
    if (type === "cost") {
      setCostSort(value);
    } else if (type === "headcount") {
      setHeadCountSort(value);
    } else if (type === "climate") {
      setClimateSort(value);
    }
  };

  const handleClearSort = (type) => {
    if (type === "cost") {
      setCostSort(null);
    } else if (type === "headcount") {
      setHeadCountSort(null);
    } else if (type === "climate") {
      setClimateSort(null);
    }
  };

  useEffect(() => {
    let filteredData = [...data];

    if (headCountSort) {
      if (headCountSort === "more than 4") {
        filteredData = filteredData.filter(
          (item) => parseInt(item.headcounts) > 4
        );
      } else {
        filteredData = filteredData.filter(
          (item) => item.headcounts === headCountSort
        );
      }
    }

    if (costSort) {
      filteredData.sort((a, b) => {
        if (costSort === "asc") {
          return a.RealPrice - b.RealPrice;
        } else {
          return b.RealPrice - a.RealPrice;
        }
      });
    }

    if (climateSort) {
      filteredData = filteredData.filter((item) => item.weather[climateSort]);
    }

    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setSortedData(filteredData);
  }, [costSort, headCountSort, climateSort, searchQuery]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <div className="ff-xl flex justify-between items-center z-10">
        <div className="flex justify-between flex-grow">
          <input
            onClick={() => {
              speakText("Searching", i18n.language, isMuted);
            }}
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-6 bg-gray-100  border-b border-black h-10 outline-none mini"
          />
          <button
            className="flex items-center bg-gray-100 h-[3.05rem] justify-center p-2 border-b border-t-1 border-black"
            onClick={() => setSearchQuery("")}
          >
            <IoMdClose size={24} className="mt-1 mr-3" />
          </button>
        </div>
      </div>

      <div className="pl-5 flex mt-6 mini">
        <button
          className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-10 mr-4 md:text-base md:w-[8rem]"
          onClick={() => {
            setOpenClimate(true);
            speakText("climate", i18n.language, isMuted);
          }}
        >
          <h1 className="mt-1 text-[.9rem]">{t("climate")}</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>

        <button
          className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-10 mr-4 md:text-base md:w-[8rem]"
          onClick={() => {
            setOpenHeadCount(true);
            speakText("headcount", i18n.language, isMuted);
          }}
        >
          <h1 className="text-[.9rem] mt-1">{t("head count")}</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>

        <button
          className="flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border border-black h-10 mr-4  md:text-base md:w-[5rem]"
          onClick={() => {
            setOpenCost(true);
            speakText("cost", i18n.language, isMuted);
          }}
        >
          <h1 className="text-[0.9rem] mt-1">{t("cost")}</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {sortedData.map((item) => (
          <div key={item.id} className="p-5">
            <Link to={`/haven/${item.id}`}>
              <img src={item.img} alt={t(item.title)} className="w-full h-auto" onClick={() => {
                speakText(item.title, i18n.language, isMuted)
              }}/>
            </Link>

            <div className="flex items-center mt-6">
              <h1 className="ml-7 mr-6 text-[#3a3a3a] md:text-base mini">
                {t(item.title)}
              </h1>
              <div className="flex space-x-2">
                {item.weather.sunny && (
                  <IoIosSunny className="text-black" size={20} />
                )}
                {item.weather.snowy && (
                  <BsSnow className="text-black" size={18} />
                )}
                {item.weather.windy && (
                  <BsWind className="text-black" size={20} />
                )}
                {item.weather.rainy && (
                  <BsCloudRainHeavyFill className="text-black" size={20} />
                )}
              </div>
            </div>
            <div className="pl-5 flex mt-4 space-x-4">
              <button className="flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border border-black h-10 text-sm md:text-base md:w-[5rem]">
                <FaUser size={14} className="text-black" />
                <h1 className="ml-2 materials-font">{item.headcounts}</h1>
              </button>

              <button className="flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border border-black h-10 text-sm md:text-base md:w-[5rem]">
                {Array.from({ length: item.price }, (_, i) => (
                  <AiFillDollarCircle key={i} size={18} className="text-black" />
                ))}
                {Array.from({ length: 3 - item.price }, (_, i) => (
                  <AiFillDollarCircle
                    key={i}
                    size={18}
                    className="text-gray-400"
                  />
                ))}
              </button>

              <button className="flex items-center p-2 rounded-[6rem] w-[8rem] justify-center bg-gray-100 border border-black h-10 text-sm md:text-base md:w-[8rem]">
                <GoClockFill />
                <h1 className="ml-2 materials-font">
                  {item.duration} {t("weeks")}
                </h1>
              </button>
            </div>
          </div>
        ))}
      </div>

      {openCost && (
        <ConditionsPopUp
          onClose={() => setOpenCost(false)}
          onSort={handleSort}
          onClear={() => handleClearSort("cost")}
        />
      )}

      {openHeadCount && (
        <HeadCountPopUp
          onClose={() => setOpenHeadCount(false)}
          onSort={handleSort}
          onClear={() => handleClearSort("headcount")}
        />
      )}

      {openClimate && (
        <ClimatePopUp
          onClose={() => setOpenClimate(false)}
          onSort={handleSort}
          onClear={() => handleClearSort("climate")}
        />
      )}

      {openLanguage && (
        <LanguagePopUp
          onClose={() => setOpenLanguage(false)}
          onSelectLanguage={(language) => {
            i18n.changeLanguage(language);
            setOpenLanguage(false);
          }}
        />
      )}

      <footer className="fixed bottom-4 left-4 z-50">
        <button
          onClick={toggleMute}
          className="p-2 bg-gray-200 rounded-full shadow-lg"
        >
          {isMuted ? <IoMdVolumeOff size={24} /> : <IoMdVolumeHigh size={24} />}
        </button>
      </footer>

      <footer className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="w-full shadow-lg ml-2"
        >
          <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
        </button>
      </footer>
    </>
  );
}
