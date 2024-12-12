import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosSunny, IoMdClose, IoMdSearch } from "react-icons/io";
import { AiFillDollarCircle } from "react-icons/ai";
import { GoClockFill } from "react-icons/go";
import { BsCloudRainHeavyFill, BsSnow, BsWind } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiTimer } from "react-icons/ci";
import { RiArrowDropDownFill } from "react-icons/ri";

import "../Home.css";
import data from "../Data/PTSData.jsx";
import { Link, useLocation } from "react-router-dom";
import SkeletonLoader from "../Skeletons/SkeletonHome.jsx";
import Chatbot from "../Features/AudioToText.jsx";
import LanguagePopUp from "../Features/LanguagePopUp.jsx";
import { FaLanguage } from "react-icons/fa";
import { useLanguage } from "../Features/languageContext.jsx";
import he from 'he'; // Import the he library
import axios from 'axios';
import Navbar from "../Features/navbar.jsx";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { selectedLanguage } = useLanguage();
  const [translations, setTranslations] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        console.log("Fetching translations for FAQs");
        const response = await fetch('https://api.homeforhumanity.xrvizion.com/shelter/gettranslation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shelterName: "OtherPages",
            langCode: selectedLanguage,
            fileName: 'faqpage_en.json',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data.msg === "Success") {
          const decodedContent = decodeContent(data.translatedContent);
          setTranslations(decodedContent);
        } else {
          console.error('Error in translation response:', data.msg);
        }
      } catch (error) {
        console.error('Error fetching FAQ translations:', error);
      }
    };

    fetchTranslations();
  }, [selectedLanguage]);

  const faqs = [
    {
      question: translations ? translations.questions[0].question : "Some question here",
      answer: translations ? translations.questions[0].answer : "Description",
    },
    {
      question: translations ? translations.questions[1].question : "Few more question here",
      answer: translations ? translations.questions[1].answer : "Description",
    },
    {
      question: translations ? translations.questions[2].question : "Few more question here",
      answer: translations ? translations.questions[2].answer : "Description",
    },
    {
      question: translations ? translations.questions[3].question : "Few more question here",
      answer: translations ? translations.questions[3].answer : "Description",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    try {
      await axios.post('https://homeforhumanity.onrender.com/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const decodeContent = (content) => {
    if (typeof content === 'string') {
      return he.decode(content);
    } else if (Array.isArray(content)) {
      return content.map(decodeContent);
    } else if (typeof content === 'object' && content !== null) {
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
      <Navbar />
      <div className='p-4 max-w-4xl mx-auto'>
        <div className='p-3 max-w-4xl mx-auto'>
          <h1 className='ff-xl font-bold mb-4 mini'>{translations ? translations.FAQs : "FAQs"}</h1>
          {faqs.map((faq, index) => (
            <div key={index} className=''>
              <button
                onClick={() => toggleFAQ(index)}
                className='w-full text-left px-4 py-[1rem] bg-gray-200 border border-gray-300 flex items-center justify-between text-smm'
              >
                {faq.question}
                <RiArrowDropDownFill className={`transition-transform ${activeIndex === index ? 'transform rotate-180' : ''}`} />
              </button>

              {activeIndex === index && (
                <div className='p-4 bg-gray-100 border border-gray-300 transition-max-height duration-300 ease-in-out max-h-screen overflow-auto'>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='p-3 max-w-4xl mx-auto'>
          <h2 className='text-2xl font-bold mb-4 mini'>{translations ? translations["Have any more questions?"] : "Have any more questions?"}</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-4 text-smm'>
              <label className='block text-gray-700'>{translations ? translations.Name : "Name"}</label>
              <input
                type='text'
                className='w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className=' mb-4 text-smm'>
              <label className=' block text-gray-700'>{translations ? translations.Email : "Email"}</label>
              <input
                type='email'
                className='w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mb-4 text-smm'>
              <label className='block text-gray-700'>{translations ? translations.Message : "Message"}</label>
              <textarea
                className=' w-full md:w-1/2 px-3 py-2 border border-gray-300 h-[7rem] rounded-lg'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type='submit' className='px-8 bg-gray-800 text-smmm text-white py-2 border border-gray-300'>
              {translations ? translations.Submit : "Submit"}
            </button>
          </form>
        </div>

        {isModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4'>
            <div className='bg-white p-6 rounded-lg w-full max-w-md relative'>
              <button onClick={closeModal} className='absolute top-2 right-2 p-4 text-gray-600 hover:text-gray-900'>
                <IoMdClose size={24} color='black' />
              </button>
              <h2 className='ff-xl font-bold mb-4'>{translations ? translations["Post Comment"] : "Post Comment"}</h2>
              <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                  <label className='block text-gray-700'>{translations ? translations.Name : "Name"}</label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700'>{translations ? translations.Email : "Email"}</label>
                  <input
                    type='email'
                    className='w-full px-3 py-2 border border-gray-300'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700'>{translations ? translations.Message : "Message"}</label>
                  <textarea
                    className='w-full px-3 py-2 border border-gray-300 h-64'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button type='submit' className='w-1/2 bg-gray-800 text-white py-2 border border-gray-300'>
                  {translations ? translations.Submit : "Submit"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FAQs;
