import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import LanguagePopUp from "./LanguagePopUp.jsx";
import { useTranslation } from "react-i18next";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaLanguage } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

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
      // speakText("Select language", false);
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
      <div className="flex justify-between items-center p-5 ff-xl z-10 border-b border-black">
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <IoMdClose size={25} /> : <RxHamburgerMenu size={24} />}
          </button>
        </div>

        {/* Centered Logo for Small Screens */}
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
  <Link to="/" className="ml-3 mr-10 mt-1">
    <h1 className="text-black text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold whitespace-nowrap">
      Home for Humanity
    </h1>
  </Link>
</div>


        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="underline-animation p-2">{t("Shelters")}</Link>
          <Link to="/about" className="underline-animation p-2">{t("About")}</Link>
          <Link to="/faqs" className="underline-animation p-2">{t("FAQs")}</Link>
        </div>

        {/* Search and Language Selection */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <button className="flex items-center">
            <IoIosSearch size={24} />
          </button>

          {/* Language Dropdown */}
          <button onClick={toggleLanguage} className="flex items-center space-x-2">
            <FaLanguage size={30} />
        
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-0 left-0 z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link to="/" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300">
          {t("Shelters")}
        </Link>
        <Link to="/about" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300">
          {t("About")}
        </Link>
        <Link to="/faqs" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300">
          {t("FAQs")}
        </Link>
      </div>

      {/* Language Popup */}
      {isLanguageOpen && (
        <LanguagePopUp onClose={toggleLanguage} onSelectLanguage={handleLanguageSelect} />
      )}
    </>
  );
};

export default Navbar;
