import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import data from "../Data/PTSData.jsx";
import { FaUser, FaClipboardList } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import { IoDownload } from "react-icons/io5";
import { IoMdArrowBack, IoMdArrowDropleft, IoMdArrowDropright, IoMdClose, IoMdVolumeOff, IoMdVolumeHigh } from "react-icons/io";
import './HavenOne.css';
import { useMute } from "../Features/muteContext.jsx"
import { FaBookReader } from "react-icons/fa";
import SkeletonLoader from "../Skeletons/SkeletonHavenOne.jsx";
import CommentTS from "../Features/CommentTS.jsx";
import CommentLOG from "../Features/CommentLOG.jsx";
import CommentTem from "../Features/CommentTem.jsx";
import CommentBS from "../Features/CommentBS.jsx";
import CommentSS from "../Features/CommentSS.jsx";

const speakText = (text, isMuted) => {
  if (isMuted) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onstart = () => console.log('Speech started');
  utterance.onend = () => console.log('Speech ended');
  utterance.onerror = (event) => console.error('Speech error:', event);

  window.speechSynthesis.speak(utterance);
};

const HavenOne = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const { isMuted, toggleMute } = useMute();
  const itemWithId = data.find(item => item.id === id);



  
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
    if (isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  if (!itemWithId) {
    return <div>Home not found</div>;
  }

  if (loading) {
    return <SkeletonLoader />;
  }

  // const handleImageClick = (image, index) => {
  //   setSelectedImage(image);
  //   setImageIndex(index);
  // };

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

  const speakHeadCount = () => {
    speakText(`Headcount: ${itemWithId.headcounts}`, isMuted);
  };

  const speakDuration = () => {
    speakText(`Duration: ${itemWithId.duration} ${t("weeks")}`, isMuted);
  };

  const speakMaterialList = () => {
    speakText(`Material list`, isMuted);
  };

  const speakOpenInstructions = () => {
    speakText(`Opening instructions`, isMuted);
  };

  const speakDownloadPDF = () => {
    speakText(`Downloading as PDF`, isMuted);
  };

  const renderCommentComponent = () => {
    switch (id) {
      case "0":
        return <CommentTS comments={comments} onSubmit={handleCommentSubmit} />;
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

  return (
    <>
      <div className="border-t border-black ff-xl flex justify-between items-center">
        <div className="flex items-center pl-6 mt-4 mb-3 ff-xl mini">
          <button className="flex items-center" onClick={goBack}>
            <IoMdArrowBack size={20} />
          </button>
          <h1 className="ml-2">{t(itemWithId.title)}</h1>
        </div>
      </div>
      <div className="flex flex-col px-6">
        <div className="flex flex-col">
          <div key={itemWithId.id} className="flex">
            <button className="border flex items-center p-2 rounded-[6rem] w-auto justify-center bg-gray-100 border-black h-8 mr-2" onClick={speakHeadCount}>
              <FaUser size={14} className="text-black" />
              <h1 className="ml-2 mt-[.2rem] materials-font">{itemWithId.headcounts}</h1>
            </button>

            <button className="border flex items-center p-2 rounded-[6rem] w-auto justify-center bg-gray-100 border-black h-8 ml-2" onClick={speakDuration}>
              <GoClockFill />
              <h1 className="ml-2 mt-[.2rem] materials-font">
                {itemWithId.duration} {t("weeks")}
              </h1>
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-normal items-start min-h-svh">
          <img src={itemWithId.Tent} alt="Tent" className="w-full h-auto" />
          <div className="w-full flex flex-col justify-between h-[180px] mt-5">

            <Link to={`/haven/${itemWithId.id}/materials`}>
              <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5" onClick={speakOpenInstructions}>
                {t("Instructions")}
                <FaBookReader size={16} className="ml-4" />

              </button>
            </Link>
            <Link to={`/haven/${itemWithId.id}/list`}>
              <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5" onClick={speakMaterialList}>
                {t("material list")}
                <FaClipboardList  size={18} className="ml-3"/>

              </button>
            </Link>

            <a
              href="/Timber_Pakistan_Instructions.pdf"
              download="Timber_Pakistan_Instructions.pdf"
              className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5"
              onClick={speakDownloadPDF}
            >
              {t("Download as PDF")}
              <IoDownload size={24} className="ml-2 text-gray-800 mb-1" />
            </a>
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
        <button
          onClick={toggleMute}
          className="p-2 bg-gray-200 rounded-full shadow-lg"
        >
          {isMuted ? <IoMdVolumeOff size={24} /> : <IoMdVolumeHigh size={24} />}
        </button>
      </footer>
    </>
  );
};

export default HavenOne;
