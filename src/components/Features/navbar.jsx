import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import LanguagePopUp from "./LanguagePopUp.jsx";
import { useTranslation } from "react-i18next";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaLanguage } from "react-icons/fa";
import { IoClose, IoSearch } from "react-icons/io5";
import { CiTimer } from "react-icons/ci";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    "Octagen Shelter",
    "Bamboo shelter",
    "SuperAdobe shelter",
  ];

  return (
    <>
      <div className="flex justify-between items-center p-5 ff-xl z-10 border-b border-black">
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <IoMdClose size={25} /> : <RxHamburgerMenu size={24} />}
          </button>
        </div>

        <div className="flex items-center ml-3 md:justify-start w-full md:w-auto">
          <Link to="/" className="text-[1.2rem] mt-1">
            <h1 className="text-black mini">{t("home for humanity")}</h1>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6 mr-[7rem] justify-center">
          <Link to="/" className="underline-animation p-1 text-smm">{t("Shelters")}</Link>
          <Link to="/about" className="underline-animation p-1 text-smm">{t("About")}</Link>
          <Link to="/faqs" className="underline-animation p-1 text-smm">{t("FAQs")}</Link>
          <Link to="/credits" className="underline-animation p-1 text-smm">{t("Credits")}</Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* <button onClick={toggleSearch} className="flex items-center space-x-2">
            {isSearchOpen ? <IoClose size={25}/> : <IoSearch size={24}/>} 
          </button> */}

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
        <div
          className="bg-gray-100 w-full flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-[60px] left-0 z-50 rounded-b-lg shadow-md"
        >
          <div className="w-full p-4 border-b border-gray-300">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <ul className="w-full overflow-y-auto flex mini">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-4 border-b border-gray-300 flex items-center">
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
    </>
  );
};

export default Navbar;
