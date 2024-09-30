import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import LanguagePopUp, { speakText } from "./LanguagePopUp.jsx";
import { useTranslation } from "react-i18next";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaLanguage } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    if (!hasSpoken) {
      speakText("Select language", false);
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
    setLanguageOpen(false);
    setHasSpoken(false); // Reset the flag when the location changes
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

  return (
    <>
      <div className="flex justify-between p-5 ff-xl z-10 border-b border-black">
        <div className="flex items-center md:hidden">
          <button
            onClick={() => {
              toggleMenu();
              speakText("Menu", false);
            }}
          >
            {isMenuOpen ? (
              <IoMdClose size={25} />
            ) : (
              <RxHamburgerMenu size={24} />
            )}
          </button>
        </div>


        <div className="hidden md:flex items-center space-x-4 mini">
          <Link
            onClick={() => {
              speakText("Shelter", false);
            }}
            to="/"
            className="underline-animation p-2"
          >
            {t("Shelters")}
          </Link>
          <Link
            to="/about"
            onClick={() => {
              speakText("about", false);
            }}
            className="underline-animation p-2"
          >
            {t("About")}
          </Link>
          <Link
            onClick={() => {
              speakText("FAQs", false);
            }}
            to="/faqs"
            className="underline-animation p-2"
          >
            {t("FAQs")}
          </Link>
        </div>

        
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
          <Link to="/" className="ml-3 mr-10 text-[1.15rem] mt-1">
            <h1 className="text-black mr-10">{t("home for humanity")}</h1>
          </Link>
        </div>

        <div className="flex items-center">
          <button onClick={toggleLanguage}>
            <FaLanguage size={22} className="mr-1" />
          </button>
          <h1 className="ff-xl">{i18n.language.toUpperCase()}</h1>
          <button>
            <MdOutlineArrowDropDown />
          </button>
        </div>
      </div>

      <div
        className={`mini bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-12 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link
          onClick={() => {
            speakText("Shelter", false);
          }}
          to="/"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 z-50"
        >
          {t("Shelters")}
        </Link>
        <Link
          to="/about"
          onClick={() => {
            speakText("about", false);
          }}
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini"
        >
          {t("About")}
        </Link>
        <Link
          onClick={() => {
            speakText("FAQs", false);
          }}
          to="/faqs"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini"
        >
          {t("FAQs")}
        </Link>
      </div>

      {isLanguageOpen && (
        <LanguagePopUp
          onClose={toggleLanguage}
          onSelectLanguage={handleLanguageSelect}
        />
      )}
    </>
  );
};

export default Navbar;
