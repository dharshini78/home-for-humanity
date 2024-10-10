import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosSunny, IoMdClose } from "react-icons/io";
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
import Chatbot from "../Features/AudioToText.jsx";

export default function Home() {
  const { t, i18n } = useTranslation();
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
  }, [i18n.language]);

  const handleSort = (type, value) => {
    if (type === "cost") {
      setCostSort(value);
    } else if (type === "headcount") {
      setHeadCountSort(value);
    } else if (type === "climate") {
      setClimateSort(value);
    }
  };

  const handleClearSort = () => {
    setCostSort(null);
    setHeadCountSort(null);
    setClimateSort(null);
    setOpenCost(false);
    setOpenHeadCount(false);
    setOpenClimate(false);
  };

  useEffect(() => {
    let filteredData = [...data];

    if (headCountSort) {
      filteredData = filteredData.map(item => ({
        ...item,
        headcounts: headCountSort,
        duration: calculateDuration(item.duration, parseInt(headCountSort))
      }));
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

  const calculateDuration = (originalDuration, headCount) => {
    const [minWeeks, maxWeeks] = originalDuration.split('-').map(Number);
    const multiplier = 5 / headCount; // Assuming 5 people is the base headcount
    return `${Math.ceil(minWeeks * multiplier)}-${Math.ceil(maxWeeks * multiplier)}`;
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <div className="ff-xl flex justify-between items-center z-10">
        <div className="flex justify-between flex-grow">
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-6 bg-gray-100 border-b border-black h-10 outline-none mini"
          />
          <button
            className="flex items-center bg-gray-100 h-[3.05rem] justify-center p-2 border-b border-t-1 border-black"
            onClick={() => setSearchQuery("")}
          >
            <IoMdClose size={24} className="mt-1 mr-3" />
          </button>
        </div>
      </div>
      <div className="container mx-auto p-4 border-b border-black ">
        <div className="flex items-center justify-between text-sm mt-3">
          <div>
            <h1 className="mini">Climate</h1>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-gray-100 border border-black rounded-full p-2"
              onClick={() => handleSort('climate', 'sunny')}
            >
              <IoIosSunny className="text-black" size={20} />
            </button>
            <button
              className="bg-gray-100 border border-black rounded-full p-2"
              onClick={() => handleSort('climate', 'snowy')}
            >
              <BsSnow className="text-black" size={20} />
            </button>
            <button
              className="bg-gray-100 border border-black rounded-full p-2"
              onClick={() => handleSort('climate', 'rainy')}
            >
              <BsCloudRainHeavyFill className="text-black" size={20} />
            </button>
            <button
              className="bg-gray-100 border border-black rounded-full p-2 "
              onClick={() => handleSort('climate', 'windy')}
            >
              <BsWind className="text-black" size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-smm">
            <h1 className="text-lg mini">Head Count</h1>
            <div className="flex space-x-2">
              <button
                className="bg-gray-100 border border-black rounded-full p-1 w-[2rem]"
                onClick={() => handleSort('headcount', '2')}
              >
                2
              </button>
              <button
                className="bg-gray-100 border border-black rounded-full p-1 w-[2rem]"
                onClick={() => handleSort('headcount', '3')}
              >
                3
              </button>
              <button
                className="bg-gray-100 border border-black rounded-full p-1 w-[2rem]"
                onClick={() => handleSort('headcount', '4')}
              >
                4
              </button>
              <button
                className="bg-gray-100 border border-black rounded-full p-1 w-[2.5rem]"
                onClick={() => handleSort('headcount', '5+')}
              >
                5+
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-smm">
            <h1 className="mini">Cost</h1>
            <div className="flex space-x-2">
              <button
                className="bg-gray-100 border border-black rounded-full p-2"
                onClick={() => handleSort('cost', 'desc')}
              >
                High to low
              </button>
              <button
                className="bg-gray-100 border border-black rounded-full p-2"
                onClick={() => handleSort('cost', 'asc')}
              >
                Low to high
              </button>
              <button
                className="bg-gray-100 border border-black rounded-full p-2 w-[5rem]"
                onClick={handleClearSort}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-5">
        {sortedData.map((item) => (
          <div key={item.id} className="p-5">
            <Link to={`/haven/${item.id}`}>
              <img
                src={item.img}
                alt={t(item.title)}
                className="w-full h-auto"
              />
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
            <div className="pl-5 flex mt-4 space-y-2">
              <div className="flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border border-black h-10 text-sm md:text-base md:w-[5rem]">
                <FaUser size={14} className="text-black" />
                <h1 className="ml-2 materials-font">{item.headcounts}</h1>
              </div>

              <div className="flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border border-black h-10 text-sm md:text-base md:w-[5rem]">
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
              </div>

              <div className="flex items-center p-2 rounded-[6rem] w-[8rem] justify-center bg-gray-100 border border-black h-10 text-sm md:text-base md:w-[8rem]">
                <GoClockFill />
                <h1 className="ml-2 materials-font">
                  {item.duration} {t("weeks")}
                </h1>
              </div>
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
        <h1 className="mini">Which climates describe your residence?</h1>
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
