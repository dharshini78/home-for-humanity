import React, { createContext, useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import data from "../Data/PTSData";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    return storedLanguage || 'en';
  });
  const [translatedContent, setTranslatedContent] = useState({});
  const { id } = useParams();
  const titleWithId = data.find((item) => item.id === id);

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    const fetchTranslatedContent = async (language) => {
      const storedContent = localStorage.getItem(`translatedContent_${language}_${titleWithId.title}`);
      if (storedContent) {
        setTranslatedContent((prevContent) => ({
          ...prevContent,
          [language]: JSON.parse(storedContent),
        }));
      } else {
        try {
          const fileNameMapping = {
            "Timber Shelter": "timbershelter_instructions_en.json",
            "Octagreen Shelter": "octagreenshelter_instructions_en.json",
            "Temporary Shelter": "temporaryshelter_instructions_en.json",
            "Bamboo Shelter": "bambooshelter_instructions_en.json",
            "Superadobe Shelter": "superadobeshelter_instructions_en.json",
            // Add other shelters as needed
          };

          const fileName = fileNameMapping[titleWithId.title] || 'default_instructions_en.json';

          const response = await fetch('https://api.homeforhumanity.xrvizion.com/shelter/gettranslation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shelterName: titleWithId.title.replace(/\s+/g, ''), // Remove spaces
              langCode: language,
              fileName: fileName,
            }),
          });
          const data = await response.json();
          if (data.msg === "Success") {
            setTranslatedContent((prevContent) => ({
              ...prevContent,
              [language]: data.translatedContent,
            }));
            localStorage.setItem(`translatedContent_${language}_${titleWithId.title}`, JSON.stringify(data.translatedContent));
          }
        } catch (error) {
          console.error('Error fetching translated content:', error);
        }
      }
    };

    if (!translatedContent[selectedLanguage] && titleWithId) {
      fetchTranslatedContent(selectedLanguage);
    }
  }, [selectedLanguage, translatedContent, id]);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage, translatedContent }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
