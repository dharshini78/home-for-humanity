import { useState, useEffect } from "react";
import SkeletonLoader from "../Skeletons/SkeletonAbout.jsx";
import Navbar from "../Features/navbar.jsx";
import { useLanguage } from "../Features/languageContext.jsx";
import he from "he"; // Import the he library

const About = () => {
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async (langCode) => {
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
              langCode: langCode,
              fileName: "about_en.json",
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

    // Fetch default English translations on mount
    fetchTranslations("en");

    // Fetch translations for the selected language when it changes
    if (selectedLanguage) {
      fetchTranslations(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

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

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <Navbar />

      <div className="p-6 flex flex-col justify-evenly leading-7">
        <h1 className="ff-xl font-bold mb-6 text-left">
          {translations ? translations.About : "About"}
        </h1>
        <div>
          <p className="ff-xl text-[1.1rem] mb-8 mini">
            {translations?.description1}
          </p>
          <p className="ff-xl text-[1.1rem] mb-8 mini">
            {translations?.description2}
          </p>
          <p className="ff-xl text-[1.1rem] mb-8 mini">
            {translations?.description3}
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
