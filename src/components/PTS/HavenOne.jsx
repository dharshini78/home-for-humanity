import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import data from "../Data/PTSData.jsx";
import { FaUser, FaClipboardList } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import { IoDownload } from "react-icons/io5";
import { IoMdArrowBack, IoMdArrowDropleft, IoMdArrowDropright, IoMdClose } from "react-icons/io";
import './HavenOne.css';
import { FaBookReader } from "react-icons/fa";
import SkeletonLoader from "../Skeletons/SkeletonHavenOne.jsx";
import CommentTS from "../Features/CommentTS.jsx";
import CommentLOG from "../Features/CommentLOG.jsx";
import CommentTem from "../Features/CommentTem.jsx";
import CommentBS from "../Features/CommentBS.jsx";
import CommentSS from "../Features/CommentSS.jsx";
import Navbar from '../Features/navbar.jsx';

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

const DurationIndicator = ({ duration, selectedHeadcount, itemWithId, tooltipText }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useTranslation();

  const calculateDuration = (originalDuration, defaultHeadCount, selectedHeadCount) => {
    if (!selectedHeadCount) return originalDuration;

    const [minWeeks, maxWeeks] = originalDuration.split('-').map(Number);
    const defaultCount = parseInt(defaultHeadCount);
    const selectedCount = selectedHeadcount === '5+' ? 5 : parseInt(selectedHeadcount);

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

  const generateTooltipText = () => {
    return `${t("Average construction duration with")} ${selectedHeadcount} ${t("men")}`;
  };

  const calculatedDuration = calculateDuration(duration, itemWithId.headcounts, selectedHeadcount);

  return (
    <Tooltip text={generateTooltipText()} isVisible={showTooltip}>
      <div
        className="flex items-center rounded-[6rem] w-[8rem] justify-center border border-gray-600 h-8 text-sm md:text-base md:w-[8rem] hover:bg-gray-200 transition-colors cursor-pointer ml-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <GoClockFill />
        <span className="ml-2 mt-1 materials-font">
          {calculatedDuration} {t("weeks")}
        </span>
      </div>
    </Tooltip>
  );
};

const OccupancyIndicator = ({ occupancy, tooltipText }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip text={tooltipText} isVisible={showTooltip}>
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const itemWithId = data.find(item => item.id === id);
  const [selectedHeadcount, setSelectedHeadcount] = useState(location.state?.headcount || itemWithId.headcounts);

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

  const creditsMapping = {
    "0": "Timber Shelter Pakistan\nInternational Federation of Red Cross and Red Crescent Societies\nP.O. Box 372, CH-1211 Geneva 19, Switzerland\nfrom:\n\"Transitional shelters - Eight designs\"\nInternational Federation of Red Cross and Red Crescent Societies\nGeneva, 2011",
    "1": "Lari Octa Green Shelter\nDr. Yasmeen Lari\nHeritage Foundation of Pakistan\nE-6, 4th Gizri Street, DHA 4, Karachi, 75500 Pakistan\nhttps://www.heritagefoundationpak.org",
    "2": "Temporary Shelter Nepal\nCharles Lai\nAona Architects\n4/F, 1 Jervois Street, Sheung Wan, Hong Kong\nhttps://www.aona-architects.com\nand\nTakehiko Suzuki\nTakehiko Suzuki Architects\n166-0013, 1 Horinouchi, Suginami Ward, Tokyo, Japan\nhttps://www.takehikosuzuki.com",
    "3": "Bamboo Frame Shelter Indonesia\nInternational Federation of Red Cross and Red Crescent Societies\nP.O. Box 372, CH-1211 Geneva 19, Switzerland\nfrom:\n\"Transitional shelters - Eight designs\"\nInternational Federation of Red Cross and Red Crescent Societies\nGeneva, 2011",
    "4": "Za'atari Classroom\nEmergency Architecture & Human Rights (EAHR)\nMichal Ulfstjerne\nNørre Allé 7, 2200 København, Danmark\nhttps://ea-hr.com",
  };

  const bibliographyMapping = {
    "0": "Books in Zotero Library:\n- Transistional shelters - Eight Designs\nInternational Federation of Red Cross and Red Crescent Societies\nGeneva, 2011\n\nOther Sources:\n- Shelter 5: Structral Assessment - Pakistan\nARUP\nLondon, 26.04.2011",
    "1": "Books in Zotero Library:\n- ‘LARI OCTA GREEN’: SUSTAINABLE BAMBOO DESIGN FOR FLOOD RELIEF\nDesignboom.com\n26/11/2022\nhttps://www.designboom.com/architecture/lari-octa-green-emergency-bamboo-shelters-flood-relief-heritage-foundation-of-pakistan-10-26-2022/\n\nOther Sources:\n- LOG (Lari OctaGreen)\nYasmeen Lari's Zero Carbon Channel youtube\n12/03/2021\nhttps://www.youtube.com/watch?v=YC5dm2Yl1EE\n\nDocuments and plans\nYasmeen Lari\n\nWorking with Bamboo - Basic Principles and Techniques\nStéphane Schröder\nRetrieved 08.07.2024\nhttps://www.guaduabamboo.com/blog/joining-bamboo\n\nManual de construcción con bambú\nOscar Hidalgo López\nUniversidad Nacional de Colombia\n1981",
    "2": "Books in Zotero Library:\n- Temporary Shelter in Nepal / Charles Lai + Takehiko Suzuki\narchdaily (curator)\narchdaily.com\n14/07/2015\nhttps://www.archdaily.com/769890/temporary-shelter-in-nepal-charles-lai-plus-takehiko-suzuki\n\nOther Sources:\n- Documents and Plans:\naona architects",
    "3": "Books in Zotero Library:\n- Transitional shelters - Eight designs\nInternational Federation of Red Cross and Red Crescent Societies\nGeneva, 2011\n\nOther Sources:\n- Bambus als Baustoff\nKlaus Dunkelberg\nHabelt Verlag\nBonn, 1980\n\nWorking with Bamboo - Basic Principles and Techniques\nStéphane Schröder\nRetrieved 08.07.2024\nhttps://www.guaduabamboo.com/blog/joining-bamboo\n\nManual de construcción con bambú\nOscar Hidalgo López\nUniversidad Nacional de Colombia\n1981\n\nPost-disaster shelter: Ten designs\nInternational Federation of Red Cross and Red Crescent Societies\nGeneva, 2013\n\nNipa Palm - Making Roof Panels\nRicky and Reyna Amacna\nPhilppine Life\nRetrieved 15.07.24\nhttps://www.youtube.com/watch?v=G059aijUm38",
    "4": "Books in Zotero Library:\n- 100 Classrooms for Refugee Children / Emergency Architecture & Human Rights\narchdaily (curator)\narchdaily.com\n29/09/2017\nhttps://www.archdaily.com/880676/100-classrooms-for-refugee-children-emergency-architecture-and-human-rights?ad_source=search&ad_medium=projects_tab\n\nOther Sources:\n- calearth\ncalearth.org\n16/07/2024\nhttps://calearth.org\n\nhttps://www.curvatecture.com\n16/07/2024\n\nHive mind: Refugee classroom in Za’atari Camp, Jordan by Emergency Architecture & Human Rights\nKatrine Bech Taxholm\nThe Architectural Review\n29/06/2018\nhttps://www.architectural-review.com/buildings/hive-mind-refugee-classroom-in-zaatari-camp-jordan-by-emergency-architecture-human-rights\n\nEarthbag Building Guide\nOwen Geiger\nExcellence in Natural Building Series\n2011\nhttps://www.earthbagbuilding.com/articles/ebbuildingguide.htm",
  };

  const credits = creditsMapping[id];
  const bibliography = bibliographyMapping[id];

  return (
    <>
      <Navbar />
      <div className="border-black ff-xl flex justify-between items-center">
        <div className="flex items-center pl-6 mt-4 mb-3 ff-xl mini">
          <button className="flex items-center" onClick={goBack}>
            <IoMdArrowBack size={20} />
          </button>
          <h1 className="ml-2">{t(itemWithId.title)}</h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row px-6">
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex flex-col">
            <div key={itemWithId.id} className="flex">
              <OccupancyIndicator
                occupancy={itemWithId.headcounts}
                tooltipText={t("Occupancy")}
              />

              <DurationIndicator
                duration={itemWithId.duration}
                selectedHeadcount={selectedHeadcount}
                itemWithId={itemWithId}
                tooltipText={t("Estimated construction duration")}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-normal items-start mb-9">
            <img src={itemWithId.Tent} alt="Tent" className="w-full h-auto" />
            <div className="w-full flex flex-col justify-between h-[180px] mt-5">
              <Link to={`/haven/${itemWithId.id}/materials`}>
                <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5">
                  <FaBookReader size={16} className="mr-4" />
                  {t("Instructions")}
                </button>
              </Link>
              <Link to={`/haven/${itemWithId.id}/list`}>
                <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5">
                  <FaClipboardList size={18} className="mr-3" />
                  {t("material list")}
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
                {t("Download as PDF")}
              </a>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col lg:mt-0 lg:pl-6">
          <div className="w-full text-smm">
            <h2 className="text-lg font-bold">Design Credits</h2>
            <pre className="whitespace-pre-wrap text-smm">{credits}</pre>
          </div>
          <div className="w-full mt-4">
            <h2 className="text-lg font-bold">Bibliography</h2>
            <pre className="whitespace-pre-wrap text-smm">{bibliography}</pre>
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
