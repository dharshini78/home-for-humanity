import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SkeletonLoader from "../Skeletons/SkeletonMaterialOne.jsx";
import "../Home.css";
import Navbar from "../Features/navbar.jsx";
import { useLanguage } from "../Features/languageContext.jsx";
import data from "../Data/PTSData.jsx";
import { IoMdArrowBack, IoMdEye } from "react-icons/io";
import he from "he";
import materialsImageData from "../Features/material.jsx"; // Import the materials image data

const MaterialsList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const { selectedLanguage } = useLanguage();
  const titleWithId = data.find((item) => item.id === id);

  useEffect(() => {
    const fetchTranslatedContent = async (language) => {
      try {
        const fileNameMapping = {
          "Timber-Frame Shelter": "timbershelter_materials_en.json",
          "Temporary Shelter": "temporaryshelter_materials_en.json",
          "Bamboo Shelter": "bambooshelter_materials_en.json",
          "Superadobe Shelter": "superadobeshelter_materials_en.json",
          "Octagreen Shelter": "octagreenshelter_materials_en.json",
        };
        const fileName =
          fileNameMapping[titleWithId.title] || "default_materials_en.json";

        const response = await fetch(
          "https://api.diyhomes.ai/shelter/gettranslation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              shelterName: titleWithId.title.replace(/\s+/g, ""),
              langCode: language,
              fileName: fileName,
            }),
          }
        );

        const data = await response.json();
        if (data.msg === "Success") {
          const decodedContent = decodeContent(data.translatedContent);
          setTranslatedContent(decodedContent);
        }
      } catch (error) {
        console.error("Error fetching translated content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslatedContent(selectedLanguage);
  }, [selectedLanguage]);

  const goBack = () => {
    navigate(`/haven/${id}`);
  };

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

  const handleViewMaterial = (material, index) => {
    setSelectedMaterial({ name: material, index });
  };

  const closeMaterialView = () => {
    setSelectedMaterial(null);
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
        <div className="flex flex-col justify-normal items-start min-h-svh">
          <h1 className="underline underline-offset-2 mt-6 text-smm">
            Material list
          </h1>
          <div className="w-full mt-7">
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-t-lg">
              <div className="font-bold">S.No</div>
              <div className="font-bold">Material</div>
              <div className="font-bold">View Item</div>
            </div>

            {Object.entries(translatedContent.materials).map(
              ([key, material], index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 p-4 border-t border-gray-200"
                >
                  <div>{index + 1}</div>
                  <div>{material}</div>
                  <div>
                    <button
                      className="flex items-center p-2 justify-center rounded-[6rem] bg-gray-100 border border-black h-9 text-smm ml-9 mt-4"
                      onClick={() => handleViewMaterial(material, index)}
                    >
                      <span className="mt-[0.2rem] text-smm">
                        <IoMdEye size={22} />
                      </span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {selectedMaterial && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          style={{ overflowY: "auto" }}
        >
          <div className="bg-white p-6 rounded-lg max-w-[90vw] w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeMaterialView}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {selectedMaterial.name}
            </h2>
            <div className="flex justify-center">
              <img
                src={
                  materialsImageData[id]?.[selectedMaterial.index] ||
                  "/placeholder.jpg"
                }
                alt={selectedMaterial.name}
                className="rounded"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialsList;
