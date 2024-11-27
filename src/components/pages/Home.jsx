import React, { useState, useEffect } from "react";
import { FaUser, FaLanguage } from "react-icons/fa";
import { IoIosSunny, IoMdClose, IoMdSearch } from "react-icons/io";
import { AiFillDollarCircle } from "react-icons/ai";
import { GoClockFill } from "react-icons/go";
import { BsCloudRainHeavyFill, BsSnow, BsWind } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiTimer } from "react-icons/ci";
import "../Home.css";
import data from "../Data/PTSData.jsx";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import SkeletonLoader from "../Skeletons/SkeletonHome.jsx";
import Chatbot from "../Features/AudioToText.jsx";
import LanguagePopUp from "../Features/LanguagePopUp.jsx";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [sortedData, setSortedData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [costSort, setCostSort] = useState(null);
  const [headCountSort, setHeadCountSort] = useState(null);
  const [climateSort, setClimateSort] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const location = useLocation();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [occupancySort, setOccupancySort] = useState(null);
  const [isDurationChanged, setIsDurationChanged] = useState(false);

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

  const MetricButton = ({ icon: Icon, value, tooltipText }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <Tooltip text={tooltipText} isVisible={showTooltip}>
        <div
          className="flex items-center rounded-[6rem] w-[3.4rem] justify-center border border-gray-600 h-8 text-sm md:text-base md:w-[5rem] hover:bg-gray-200 transition-colors cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Icon size={14} className="text-black" />
          <span className="ml-2 mt-1 materials-font">{value}</span> 
        </div>
      </Tooltip>
    );
  };

  const DurationIndicator = ({ duration, selectedHeadcount, tooltipText, isChanged }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const { t } = useTranslation();

    const generateTooltipText = () => {
      return `${t("Average construction duration with")} ${selectedHeadcount} ${t("Persons")}`;
    };

    return (
      <Tooltip text={generateTooltipText()} isVisible={showTooltip}>
        <div
          className={`flex items-center rounded-[6rem] w-[8rem] justify-center border border-gray-600 h-8 text-sm md:text-base md:w-[8rem] hover:bg-gray-200 transition-colors cursor-pointer ${
            isChanged ? 'animate-pulse bg-gray-800 text-white' : ''
          }`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <GoClockFill />
          <span className="ml-2 mb-[0.1rem]">
            {duration} {t("weeks")}
          </span>
        </div>
      </Tooltip>
    );
  };

  const PriceIndicator = ({ price, tooltipText }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <Tooltip text={tooltipText} isVisible={showTooltip}>
        <div
          className="flex items-center rounded-[6rem] w-[5rem] justify-center bg-white border border-gray-600 h-8 text-sm md:text-base md:w-[5rem] hover:bg-gray-200 transition-colors cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {Array.from({ length: price }, (_, i) => (
            <AiFillDollarCircle key={i} size={18} className="text-current" />
          ))}
          {Array.from({ length: 3 - price }, (_, i) => (
            <AiFillDollarCircle key={i} size={18} className="text-gray-400" />
          ))}
        </div>
      </Tooltip>
    );
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  const toggleLanguage = () => {
    if (!hasSpoken) {
      setHasSpoken(true);
    }
    setLanguageOpen(!isLanguageOpen);
  };

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
    setLanguageOpen(false);
  };

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setLanguageOpen(false);
    setHasSpoken(false);
  }, [location]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const suggestions = [
    "Timber shelter",
    "Temporary shelter",
    "Octagreen Shelter",
    "Bamboo shelter",
    "SuperAdobe shelter",
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [i18n.language]);

  const handleSort = (type, value) => {
    switch (type) {
      case 'climate':
        setClimateSort(prev =>
          prev.includes(value)
            ? prev.filter(item => item !== value)
            : [...prev, value]
        );
        break;
      case 'headcount':
        setHeadCountSort(prev => prev === value ? '' : value);
        setIsDurationChanged(true);
        const timeout = setTimeout(() => {
          setIsDurationChanged(false);
        }, 2000);
        return () => clearTimeout(timeout);
      case 'cost':
        setCostSort(prev => prev === value ? '' : value);
        setOccupancySort(null); // Disable occupancy sort
        break;
      case 'occupancy':
        setOccupancySort(prev => prev === value ? '' : value);
        setCostSort(null); // Disable cost sort
        break;
    }
  };

  const handleClearSort = () => {
    setCostSort(null);
    setHeadCountSort(null);
    setClimateSort([]);
    setOccupancySort(null);
  };

  const calculateDuration = (originalDuration, defaultHeadCount, selectedHeadCount) => {
    if (!selectedHeadCount) return originalDuration;

    const [minWeeks, maxWeeks] = originalDuration.split('-').map(Number);
    const defaultCount = parseInt(defaultHeadCount);
    const selectedCount = selectedHeadCount === '5+' ? 5 : parseInt(selectedHeadCount);

    if (selectedCount <= defaultCount) {
      const multiplier = defaultCount / selectedCount;
      const newMinWeeks = Math.ceil(minWeeks * multiplier);
      const newMaxWeeks = Math.ceil(maxWeeks * multiplier);
      return newMinWeeks === newMaxWeeks ? `${newMinWeeks}` : `${newMinWeeks}-${newMaxWeeks}`;
    } else {
      const multiplier = selectedCount / defaultCount;
      const newMinWeeks = Math.floor(minWeeks / multiplier);
      const newMaxWeeks = Math.floor(maxWeeks / multiplier);
      return newMinWeeks === newMaxWeeks ? `${newMinWeeks}` : `${newMinWeeks}-${newMaxWeeks}`;
    }
  };

  const sortByOccupancy = (data, order) => {
    return data.sort((a, b) => {
      if (order === "asc") {
        return a.headcounts - b.headcounts;
      } else {
        return b.headcounts - a.headcounts;
      }
    });
  };

  useEffect(() => {
    let filteredData = [...data];

    // Apply climate filter
    if (climateSort.length > 0) {
      filteredData = filteredData.filter((item) =>
        climateSort.every(climate => item.weather[climate])
      );
    }

    // Apply headcount and duration calculation
    if (headCountSort) {
      filteredData = filteredData.map(item => ({
        ...item,
        calculatedDuration: calculateDuration(item.duration, item.headcounts, headCountSort)
      }));
    } else {
      filteredData = filteredData.map(item => ({
        ...item,
        calculatedDuration: item.duration
      }));
    }

    // Apply cost sort
    if (costSort) {
      filteredData.sort((a, b) => {
        if (costSort === "asc") {
          return a.RealPrice - b.RealPrice;
        } else {
          return b.RealPrice - a.RealPrice;
        }
      });
    }

    // Apply occupancy sort
    if (occupancySort) {
      filteredData = sortByOccupancy(filteredData, occupancySort);
    }

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setSortedData(filteredData);
  }, [costSort, headCountSort, climateSort, searchQuery, occupancySort]);

  if (loading) {
    return <SkeletonLoader />;
  }

  const isFilterApplied = climateSort.length > 0 || headCountSort || costSort || occupancySort;
  return (
    <>
      <div className="flex justify-between items-center p-5 ff-xl z-10 border-b border-black">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <IoMdClose size={25} /> : <RxHamburgerMenu size={24} />}
          </button>
          <Link to="/" className="ml-3 mr-10 text-[1.2rem] md:text-[1.5rem] lg:text-[1.75rem] mt-1">
            <h1 className="text-black mini ">{t("home for humanity")}</h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 mr-[7rem] justify-center">
          <Link to="/" className="underline-animation p-1 text-smm">{t("Shelters")}</Link>
          <Link to="/about" className="underline-animation p-1 text-smm">{t("About")}</Link>
          <Link to="/faqs" className="underline-animation p-1 text-smm">{t("FAQs")}</Link>
          <Link to="/credits" className="underline-animation p-1 text-smm">{t("Credits")}</Link>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleSearch} className="flex items-center">
            <IoMdSearch size={24} />
          </button>
          <button onClick={toggleLanguage} className="flex items-center space-x-2">
            <FaLanguage size={35} />
          </button>
        </div>
      </div>

      <div
        className={`bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-[60px] left-0 z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link to="/" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini">
          {t("Shelters")}
        </Link>
        <Link to="/about" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini">
          {t("About")}
        </Link>
        <Link to="/faqs" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini">
          {t("FAQs")}
        </Link>
        <Link to="/credits" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini">
          {t("Credits")}
        </Link>
      </div>
      {isSearchOpen && (
        <div className="bg-gray-100 w-full flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-[60px] left-0 z-50 rounded-b-lg shadow-md">
          <div className="w-full p-4 border-b border-gray-300">
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm md:text-base"
            />
          </div>
          <ul className="w-full overflow-y-auto flex mini">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-4 text-xs md:text-smm border-b border-gray-300 flex items-center cursor-pointer"
                onClick={() => setSearchQuery(suggestion)}
              >
                <CiTimer className="mr-2" size={30} />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLanguageOpen && (
        <LanguagePopUp onClose={toggleLanguage} onSelectLanguage={handleLanguageSelect} />
      )}

      <div className=" text-xss flex justify-between items-center">
        <div className="relative flex-grow">

        </div>
      </div>

      <div className="mx-auto p-5 border-b border-gray-700">
        <div className="flex flex-wrap gap-6 items-start relative">
          {/* Climate Filter */}


          <div className="flex-shrink-0">
            <div className="mb-1">
              <h2 className="text-xss md:text-xss font-semibold mb-1">Climate</h2>
              <p className="text-xss md:text-xss text-gray-600">What describes the climate of the place you live?</p>
            </div>
            <div className="flex flex-wrap gap-1 text-xss">
              {[
                { name: 'sunny', icon: <IoIosSunny size={16} /> },
                { name: 'snowy', icon: <BsSnow size={16} /> },
                { name: 'rainy', icon: <BsCloudRainHeavyFill size={16} /> },
                { name: 'windy', icon: <BsWind size={16} /> }
              ].map(({ name, icon }) => (
                <button
                  key={name}
                  className={`p-1.5 rounded-full border border-gray-400 flex items-center gap-1 transition-all text-xs
                    ${climateSort.includes(name)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => handleSort('climate', name)}
                >
                  {icon}
                  <span className="capitalize">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Headcount Filter */}
          <div className="flex-shrink-0">
            <div className="mb-1">
              <h2 className="text-xss md:text-xss font-semibold mb-1">Headcount</h2>
              <p className="text-xss md:text-xss text-gray-600">This is to estimate how long it takes to construct the shelter</p>
            </div>
            <div className="flex flex-wrap gap-1 text-xss">
              {['2', '3', '4', '5+'].map((count) => (
                <button
                  key={count}
                  className={`px-2.5 py-1 text-xs rounded-full border border-gray-400 transition-all
                    ${headCountSort === count
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => handleSort('headcount', count)}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Section */}
          <div className="flex-grow">
            <div className="mb-1">
              <h2 className="text-xss md:text-xss font-semibold mb-1">Sort by</h2>
              <p className="text-xss md:text-xss text-gray-600">Arrange results by price or occupancy level</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Price Sort */}
              <div className="flex items-center gap-1">
                <span className="text-xss md:text-xss text-gray-600">Price:</span>
                <div className="flex gap-1">
                  {[
                    { label: '↑', value: 'desc', icon: <AiFillDollarCircle size={12} /> },
                    { label: '↓', value: 'asc', icon: <AiFillDollarCircle size={12} /> }
                  ].map(({ label, value, icon }) => (
                    <button
                      key={value}
                      className={`px-2 py-1 text-xss rounded border border-gray-400 transition-all flex items-center
                        ${costSort === value
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleSort('cost', value)}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupancy Sort */}
              <div className="flex items-center gap-1">
                <span className="text-xss md:text-xss text-gray-600">Occupancy:</span>
                <div className="flex gap-1">
                  {[
                    { label: '↑', value: 'desc', icon: <FaUser size={12} /> },
                    { label: '↓', value: 'asc', icon: <FaUser size={12} /> }
                  ].map(({ label, value, icon }) => (
                    <button
                      key={value}
                      className={`px-2 py-1 text-xss rounded border border-gray-400 transition-all flex items-center
                        ${occupancySort === value
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => handleSort('occupancy', value)}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Headcount and Reset Button */}
          <div className="flex-shrink-0 flex items-center gap-1 mt-4">
            <div className="flex-grow"></div>
            {isFilterApplied && (
              <button
                className="mt-7 ml-auto px-3 py-1 text-xss md:text-smm bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
                onClick={handleClearSort}
              >
                Reset
              </button>
            )}
          </div>

      
         
        </div>

        
        <footer className="fixed bottom-4 z-50">
  <button
    onClick={() => setIsChatbotOpen(true)}
    className="shadow-lg"
  >
    <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
  </button>
</footer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-1">
            {sortedData.map((item) => (
              <div key={item.id} className="p-5">
                <Link to={`/haven/${item.id}`} state={{ headcount: headCountSort }}>
                  <img
                    src={item.img}
                    alt={t(item.title)}
                    className="w-full h-auto"
                  />
                </Link>

                <div className="flex items-center mt-6">
                  <h1 className="ml-5 mr-6 text-[#3a3a3a] text-sm md:text-base mini">
                    {t(item.title)}
                  </h1>

                  <div className="flex space-x-2">
                    {Object.entries(item.weather).map(([climate, isSupported]) => (
                      <React.Fragment key={climate}>
                        {climate === 'sunny' && <IoIosSunny className={isSupported ? "text-black" : "text-gray-300"} size={20} />}
                        {climate === 'snowy' && <BsSnow className={isSupported ? "text-black" : "text-gray-300"} size={18} />}
                        {climate === 'windy' && <BsWind className={isSupported ? "text-black" : "text-gray-300"} size={20} />}
                        {climate === 'rainy' && <BsCloudRainHeavyFill className={isSupported ? "text-black" : "text-gray-300"} size={20} />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="pl-5 flex mt-1 space-x-2">
                  <MetricButton
                    icon={FaUser}
                    value={item.headcounts}
                    tooltipText={t("Occupancy")}
                  />
                  <PriceIndicator
                    price={item.price}
                    tooltipText={t("Relative cost indicator")}
                  />
                  <DurationIndicator
                    duration={item.calculatedDuration}
                    selectedHeadcount={headCountSort || item.headcounts}
                    tooltipText={t("Estimated construction duration")}
                    isChanged={isDurationChanged}
                  />
                </div>
              </div>
            ))}
          </div>
    </>
  );
}
