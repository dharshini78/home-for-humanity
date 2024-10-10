import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FaLanguage } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import LanguagePopUp from "./LanguagePopUp";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // Default language is English
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguageOpen(!isLanguageOpen);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setLanguageOpen(false);
  };

  useEffect(() => {
    setMenuOpen(false);
    setLanguageOpen(false);
  }, [location]);

  return (
    <>
      <div className="flex justify-between p-5 ff-xl font-bold">
        <div className="flex items-center">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <IoMdClose size={25} /> : <HiOutlineMenuAlt4 size={24} />}
          </button>
          <h1 className="ml-3">Home for Humanity</h1>
        </div>
        <div className="flex items-center">
          <button onClick={toggleLanguage}>
            <FaLanguage size={22} className="mr-1" />
          </button>
          <h1 className="font-bold ff-xl">{selectedLanguage.slice(0, 2).toUpperCase()}</h1>
          <button>
            <MdOutlineArrowDropDown />
          </button>
        </div>
      </div>

      <div
        className={`text-black bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-12 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link
          to="/"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl font-bold"
        >
          Shelters
        </Link>
        <Link
          to="/about"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl font-bold"
        >
          About
        </Link>
        <Link
          to="/faqs"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl font-bold"
        >
          FAQs
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
