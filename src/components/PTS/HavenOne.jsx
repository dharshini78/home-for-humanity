import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { IoMdArrowBack, IoMdArrowDropleft, IoMdArrowDropright, IoMdClose } from "react-icons/io";
import { GoClockFill } from "react-icons/go";
import { FaUser, FaClipboardList, FaBookReader } from "react-icons/fa";
import { IoDownload } from "react-icons/io5";
import './HavenOne.css';
import SkeletonLoader from "../Skeletons/SkeletonHavenOne.jsx";
import CommentTS from "../Features/CommentTS.jsx";
import CommentLOG from "../Features/CommentLOG.jsx";
import CommentTem from "../Features/CommentTem.jsx";
import CommentBS from "../Features/CommentBS.jsx";
import CommentSS from "../Features/CommentSS.jsx";
import Navbar from '../Features/navbar.jsx';
import { useLanguage } from "../Features/languageContext.jsx";
import data from "../Data/PTSData.jsx";
import he from 'he'; // Import the he library
import axios from "axios";

const Tooltip = ({ children, text, isVisible }) => {
  return (
    <div className="relative group">
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const DurationIndicator = ({ duration, selectedHeadcount, itemWithId, tooltipText, translatedContent }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const calculateDuration = (originalDuration, defaultHeadCount, selectedHeadCount) => {
    if (!selectedHeadCount) return originalDuration;

    const [minWeeks, maxWeeks] = originalDuration.split('-').map(Number);
    const defaultCount = parseInt(defaultHeadCount, 10);
    const selectedCount = selectedHeadcount === '5+' ? 5 : parseInt(selectedHeadcount, 10);

    if (isNaN(selectedCount) || isNaN(defaultCount) || isNaN(minWeeks) || isNaN(maxWeeks)) {
      return originalDuration;
    }

    if (selectedCount <= defaultCount) {
      const multiplier = defaultCount / selectedCount;
      const newMinWeeks = Math.ceil(minWeeks * multiplier);
      const newMaxWeeks = Math.ceil(maxWeeks * multiplier);
      return newMinWeeks === newMaxWeeks ? `${newMinWeeks}` : `${newMinWeeks}-${newMaxWeeks}`;
    } else {
      const multiplier = selectedCount / defaultCount;
      const newMinWeeks = Math.floor(minWeeks / multiplier);
      const newMaxWeeks = Math.floor(maxWeeks / multiplier);
      return newMinWeeks === newMaxWeeks ? `${newMinWeeks}` : `${newMinWeeks}-${newMaxWeeks}`;
    }
  };

  const calculatedDuration = calculateDuration(duration, itemWithId.headcounts, selectedHeadcount);

  return (
    <Tooltip text={translatedContent ? translatedContent.tooltip.estimated : tooltipText} isVisible={showTooltip}>
      <div
        className="flex items-center rounded-[6rem] w-[8rem] justify-center border border-gray-600 h-8 text-sm md:text-base md:w-[8rem] hover:bg-gray-200 transition-colors cursor-pointer ml-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <GoClockFill />
        <span className="ml-2 mt-1 materials-font">
          {calculatedDuration} {translatedContent ? translatedContent.duration : "weeks"}
        </span>
      </div>
    </Tooltip>
  );
};

const OccupancyIndicator = ({ occupancy, tooltipText, translatedContent }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip text={translatedContent ? translatedContent.tooltip.occupancy : tooltipText} isVisible={showTooltip}>
      <div
        className="flex items-center rounded-[6rem] w-[3.4rem] justify-center border border-gray-600 h-8 text-sm md:text-base md:w-[5rem] hover:bg-gray-200 transition-colors cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FaUser size={14} className="text-black" />
        <span className="ml-2 mt-1 materials-font">{occupancy}</span>
      </div>
    </Tooltip>
  );
};

const HavenOne = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemWithId = data.find((item) => item.id === id);

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [translatedContent, setTranslatedContent] = useState(null);
  const { selectedLanguage } = useLanguage(); // Use the LanguageContext
  const [selectedHeadcount, setSelectedHeadcount] = useState(location.state?.headcount || itemWithId.headcounts);
  const [lastFetchedLanguage, setLastFetchedLanguage] = useState(null);

  const goBack = () => {
    navigate('/');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsResponse, translatedContentResponse] = await Promise.all([
          axios.get(`https://api.homeforhumanity.xrvizion.com/shelter/comments?shelterId=${id}`),
          fetchTranslatedContent(selectedLanguage)
        ]);

        const filteredComments = commentsResponse.data.comments.filter(
          (comment) => comment.posted
        );
        setComments(filteredComments);

        const data = await translatedContentResponse;
        if (data && data.msg === "Success") {
          const decodedContent = decodeContent(data.translatedContent);
          setTranslatedContent(decodedContent);
          setLastFetchedLanguage(selectedLanguage);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, selectedLanguage, lastFetchedLanguage]);

  const fetchTranslatedContent = async (language) => {
    try {
      const fileNameMapping = {
        "Timber Shelter": "timbershelter_homepage_en.json",
        "Temporary Shelter": "temporaryshelter_homepage_en.json",
        "Bamboo Shelter": "bambooshelter_homepage_en.json",
        "Superadobe Shelter": "superadobeshelter_homepage_en.json",
        "Octagreen Shelter": "octagreenshelter_homepage_en.json"
      };

      const fileName = fileNameMapping[itemWithId.title] || 'default_homepage_en.json';

      const response = await axios.post(
        `https://api.homeforhumanity.xrvizion.com/shelter/gettranslation`,
        {
          shelterName: itemWithId.title.replace(/\s+/g, ''), // Remove spaces
          langCode: language,
          fileName: fileName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching translated content:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (selectedLanguage !== lastFetchedLanguage) {
      fetchTranslatedContent(selectedLanguage);
    }
  }, [selectedLanguage, lastFetchedLanguage]);

  if (!itemWithId) {
    return <div>Home not found</div>;
  }

  if (loading) {
    return <SkeletonLoader />;
  }

  const closeImagePopup = () => {
    setSelectedImage(null);
    setImageIndex(0);
  };

  const handlePrevImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
      setSelectedImage(comments.flatMap(comment => comment.filePaths)[imageIndex - 1]);
    }
  };

  const handleNextImage = () => {
    if (imageIndex < comments.flatMap(comment => comment.filePaths).length - 1) {
      setImageIndex(imageIndex + 1);
      setSelectedImage(comments.flatMap(comment => comment.filePaths)[imageIndex + 1]);
    }
  };

  const handleCommentSubmit = (comment) => {
    setComments([...comments, comment]);
  };

  const renderCommentComponent = () => {
    switch (id) {
      case "0":
        return <CommentTS comments={comments} onSubmit={handleCommentSubmit} className='underline' />;
      case "1":
        return <CommentLOG comments={comments} onSubmit={handleCommentSubmit} />;
      case "2":
        return <CommentTem comments={comments} onSubmit={handleCommentSubmit} />;
      case "3":
        return <CommentBS comments={comments} onSubmit={handleCommentSubmit} />;
      case "4":
        return <CommentSS comments={comments} onSubmit={handleCommentSubmit} />;
      default:
        return null;
    }
  };

  const pdfMapping = {
    "0": "/Timber_Pakistan_Instructions.pdf",
    "1": "/LOG_Shelter_Instructions.pdf",
    "2": "/Temporary_Shelter_Instructions.pdf",
    "3": "/Bamboo_Shelter_Instructions.pdf",
    "4": "/Superadobe_Shelter_Instructions.pdf",
  };

  const pdfPath = pdfMapping[id];

  return (
    <>
      <Navbar />
      <div className="border-black ff-xl flex justify-between items-center">
        <div className="flex items-center pl-6 mt-4 mb-3 ff-xl mini">
          <button className="flex items-center" onClick={goBack}>
            <IoMdArrowBack size={20} />
          </button>
          <h1 className="ml-2">{translatedContent ? translatedContent.name : itemWithId.title}</h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row px-6">
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex flex-col">
            <div key={itemWithId.id} className="flex">
            <OccupancyIndicator
  occupancy={translatedContent ? translatedContent.occupancy : itemWithId.headcounts}
  tooltipText="Occupancy"
  translatedContent={translatedContent}
/>

<DurationIndicator
  duration={itemWithId.duration}
  selectedHeadcount={selectedHeadcount}
  itemWithId={itemWithId}
  tooltipText="Estimated construction duration"
  translatedContent={translatedContent}
/>

            </div>
          </div>
          <div className="mt-6 flex flex-col justify-normal items-start mb-9">
            <img src={itemWithId.Tent} alt="Tent" className="w-full h-auto" />
            <div className="w-full flex flex-col justify-between h-[180px] mt-5">
              <Link to={`/haven/${itemWithId.id}/materials`}>
                <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5">
                  <FaBookReader size={16} className="mr-4" />
                  {translatedContent ? translatedContent.instructions : "Instructions"}
                </button>
              </Link>
              <Link to={`/haven/${itemWithId.id}/list`}>
                <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5">
                  <FaClipboardList size={18} className="mr-3" />
                  {translatedContent ? translatedContent.materialList : "material list"}
                </button>
              </Link>

              <a
                href={pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                download={`${itemWithId.title}_Instructions.pdf`}
                className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5"
              >
                <IoDownload size={24} className="mr-2 text-gray-800 mb-1" />
                {translatedContent ? translatedContent.downloadAsPdf : "Download as PDF"}
              </a>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col lg:mt-0 lg:pl-6">
          <div className="w-full text-smm">
            <h2 className="text-lg font-bold">{translatedContent ? translatedContent.designCredits.title : "Design Credits"}</h2>
            <pre className="whitespace-pre-wrap text-smm">
              {translatedContent ? (
                <>
                  {translatedContent.designCredits.content.shelterName}<br />
                  {translatedContent.designCredits.content.designer}<br />
                  {translatedContent.designCredits.content.organization}<br />
                  {translatedContent.designCredits.content.address}<br />
                  <a href={translatedContent.designCredits.content.website} target="_blank" rel="noopener noreferrer">
                    {translatedContent.designCredits.content.website}
                  </a>
                </>
              ) : (
                "Loading..."
              )}
            </pre>
          </div>
          <div className="w-full mt-4">
            <h2 className="text-lg font-bold">{translatedContent ? translatedContent.bibliography.title : "Bibliography"}</h2>
            <pre className="whitespace-pre-wrap text-smm">
              {translatedContent ? (
                <>
                  {translatedContent.bibliography.content.zoteroLibrary.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.title}<br />
                      {item.source}<br />
                      {item.date}<br />
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.link}
                      </a>
                      <br /><br />
                    </React.Fragment>
                  ))}
                  {translatedContent.bibliography.content.otherSources.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.title}<br />
                      {item.source && <>{item.source}<br /></>}
                      {item.platform && <>{item.platform}<br /></>}
                      {item.date && <>{item.date}<br /></>}
                      {item.link && (
                        <>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.link}
                          </a>
                          <br />
                        </>
                      )}
                      {item.author && <>{item.author}<br /></>}
                      {item.publisher && <>{item.publisher}<br /></>}
                      {item.year && <>{item.year}<br /><br /></>}
                    </React.Fragment>
                  ))}
                </>
              ) : (
                "Loading..."
              )}
            </pre>
          </div>
          <div className="w-full mt-4">
            {comments.length === 0 && <p className="mt-4 text-smm"></p>}

            {renderCommentComponent()}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <button className="absolute top-4 right-4 text-white" onClick={closeImagePopup}>
            <IoMdClose size={24} />
          </button>
          <button className="absolute left-4 text-white" onClick={handlePrevImage} disabled={imageIndex === 0}>
            <IoMdArrowDropleft size={24} />
          </button>
          <img src={selectedImage} alt="Selected" className="max-w-[80%] max-h-[80%]" />
          <button className="absolute right-4 text-white" onClick={handleNextImage} disabled={imageIndex === comments.flatMap(comment => comment.filePaths).length - 1}>
            <IoMdArrowDropright size={24} />
          </button>
        </div>
      )}

      <footer className="fixed bottom-4 right-4 z-50">

      </footer>
    </>
  );
};

export default HavenOne;
