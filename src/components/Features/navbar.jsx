import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaLanguage } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import { useLanguage } from "../Features/languageContext.jsx";
import LanguagePopUp from "../Features/LanguagePopUp.jsx";
import { Link, useLocation } from "react-router-dom";
import he from "he"; // Import the he library

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const location = useLocation();
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedLanguage, setSelectedLanguage } = useLanguage(); // Use the LanguageContext

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    if (!hasSpoken) {
      setHasSpoken(true);
    }
    setLanguageOpen(!isLanguageOpen);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language); // Update the selected language in the context
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
    "Timber Shelter",
    "Temporary Shelter",
    "Octagreen Shelter",
    "Bamboo Shelter",
    "Superadobe Shelter",
  ];

  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(
          `https://api.homeforhumanity.xrvizion.com/shelter/gettranslation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shelterName: "OtherPages",
              langCode: selectedLanguage,
              fileName: "navbar_en.json",
            }),
          }
        );
        const data = await response.json();
        if (data.msg === "Success") {
          const decodedContent = decodeContent(data.translatedContent);
          setTranslations(decodedContent);
        } else {
          console.error("Error in translation response:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching about translations:", error);
      }
    };

    fetchTranslations();
  }, [selectedLanguage]);

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

  return (
    <>
      <div className="flex justify-between items-center p-5 ff-xl z-10 border-b border-black">
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <IoMdClose size={25} />
            ) : (
              <RxHamburgerMenu size={24} />
            )}
          </button>
        </div>

        <div className="flex items-center ml-3 md:justify-start w-full md:w-auto">
          <Link to="/" className="text-[1.2rem] mt-1">
            <h1 className="text-black mini">Home for Humanity</h1>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6 mr-[7rem] justify-center">
          <Link to="/" className="underline-animation p-1 text-smm">
            {translations ? translations["Shelters"] : "Shelters"}
          </Link>
          <Link to="/about" className="underline-animation p-1 text-smm">
            {translations ? translations["About"] : "About"}
          </Link>
          <Link to="/faqs" className="underline-animation p-1 text-smm">
            {translations ? translations["FAQs"] : "FAQs"}
          </Link>
          <Link to="/credits" className="underline-animation p-1 text-smm">
            {translations ? translations["Credits"] : "Credits"}
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2"
          >
            <FaLanguage size={35} />
          </button>
        </div>
      </div>

      <div
        className={`bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-[60px] left-0 z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link
          to="/"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini"
        >
          {translations ? translations["Shelters"] : "Shelters"}
        </Link>
        <Link
          to="/about"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini"
        >
          {translations ? translations["About"] : "About"}
        </Link>
        <Link
          to="/faqs"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini"
        >
          {translations ? translations["FAQs"] : "FAQs"}
        </Link>
        <Link
          to="/credits"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 mini"
        >
          {translations ? translations["Credits"] : "Credits"}
        </Link>
      </div>

      {isSearchOpen && (
        <div className="bg-gray-100 w-full flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-[60px] left-0 z-50 rounded-b-lg shadow-md">
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
              <li
                key={index}
                className="p-4 border-b border-gray-300 flex items-center"
              >
                <CiTimer className="mr-2" size={30} />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

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
