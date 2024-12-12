import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SkeletonLoader from "../Skeletons/SkeletonMaterialOne.jsx";
import "../Home.css";
import Navbar from "../Features/navbar.jsx";
import { useLanguage } from "../Features/languageContext.jsx";
import data from "../Data/PTSData.jsx";
import { IoMdArrowBack } from "react-icons/io";
import he from 'he'; // Import the he library

const MaterialsList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState(null);
  const { selectedLanguage } = useLanguage();
  const titleWithId = data.find((item) => item.id === id);

  useEffect(() => {
    const fetchTranslatedContent = async (language) => {
      try {
        const fileNameMapping = {
          "Timber Shelter": "timbershelter_materials_en.json",
          "Temporary Shelter": "bambooshelter_materials_en.json",
          "Bamboo Shelter": "bambooshelter_materials_en.json",
          "Superadobe Shelter": "superadobeshelter_materials_en.json",
          "Octagreen Shelter": "octagreenshelter_materials_en.json"
        };
        const fileName = fileNameMapping[titleWithId.title] || 'timbershelter_materials_en.json';
        const response = await fetch('https://api.homeforhumanity.xrvizion.com/shelter/gettranslation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shelterName: titleWithId.title.replace(/\s+/g, ''), // Remove spaces
            langCode: language,
            fileName: fileName
          }),
        });
        const data = await response.json();
        if (data.msg === "Success") {
          const decodedContent = decodeContent(data.translatedContent);
          setTranslatedContent(decodedContent);
        }
      } catch (error) {
        console.error('Error fetching translated content:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch translated content for the selected language on initial load
    fetchTranslatedContent(selectedLanguage);
  }, [selectedLanguage]);

  const goBack = () => {
    navigate(`/haven/${id}`);
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

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!translatedContent) {
    return <div>Materials list not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="border-t border-black ff-xl flex justify-between items-center">
        <div className="flex items-center pl-6 mt-4 mb-2 ff-xl mini">
          <button className="flex items-center" onClick={goBack}>
            <IoMdArrowBack size={20} />
          </button>
          <h1 className="ml-2">{translatedContent.name}</h1>
        </div>
      </div>
      <div className="flex flex-col px-6">
        <div className="mt-6 flex flex-col justify-normal items-start min-h-svh">
          <h1 className="underline underline-offset-2 mt-6 text-smm">Material list</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 materials-font">
            {Object.values(translatedContent.materials).map((material, index) => (
              <div key={index} className="flex items-center mt-4">
                <p>{material}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialsList;
