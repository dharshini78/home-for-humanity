import React, { useState, useEffect } from "react";
import { IoMdClose, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import he from "he"; // Import the he library
import { useLanguage } from "../Features/languageContext.jsx"; // Import the language context

const MAX_IMAGES = 10;
const DISPLAY_LIMIT = 3;

const CommentTS = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [translations, setTranslations] = useState(null);
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    fetchComments();
    fetchTranslations();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      console.log("Current selected language:", selectedLanguage);
      fetchComments();
      fetchTranslations();
    }
  }, [selectedLanguage]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        "https://api.homeforhumanity.xrvizion.com/shelter/comments?shelterId=3"
      );

      console.log("Raw comments response:", response.data);

      const filteredComments = response.data.comments.filter(
        (comment) => comment.posted
      );

      console.log("Filtered comments before translation:", filteredComments);

      // Translate each comment's message
      const translatedComments = await Promise.all(
        filteredComments.map(async (comment) => {
          try {
            // Skip translation for comments without a message
            if (!comment.comments) {
              console.warn("Skipping comment without message:", comment);
              return comment;
            }

            const translatedMessage = await translateMessage(
              comment.comments,
              selectedLanguage
            );

            return {
              ...comment,
              comments: translatedMessage,
            };
          } catch (translateError) {
            console.error(
              "Translation error for specific comment:",
              translateError
            );
            return comment;
          }
        })
      );

      console.log("Translated comments:", translatedComments);
      setComments(translatedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchTranslations = async () => {
    try {
      const response = await axios.post(
        "https://api.homeforhumanity.xrvizion.com/shelter/gettranslation",
        {
          shelterName: "BambooShelter",
          langCode: selectedLanguage,
          fileName: "bambooshelter_comments.json",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.msg === "Success") {
        setTranslations(response.data.translatedContent);
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
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

  const translateMessage = async (message, langCode) => {
    // Validate input
    if (!message || !langCode) {
      console.warn("No message or language code provided");
      return message;
    }

    try {
      console.log("Original Message:", message);
      console.log("Target Language:", langCode);

      const response = await axios.post(
        "https://api.homeforhumanity.xrvizion.com/shelter/gettranslation",
        {
          shelterName: "BambooShelter",
          langCode: langCode,
          fileName: "bambooshelter_comments.json",
          text: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Full Translation Response:", response.data);

      // Detailed debugging of the response
      if (response.data.msg === "Success") {
        // Attempt to extract translated message with multiple strategies
        let translatedMessage = message;

        // Check if translatedContent exists and is a string or has translatedMessage
        if (response.data.translatedContent) {
          if (typeof response.data.translatedContent === "string") {
            translatedMessage = response.data.translatedContent;
          } else if (response.data.translatedContent.translatedMessage) {
            translatedMessage =
              response.data.translatedContent.translatedMessage;
          } else if (response.data.translatedContent.text) {
            translatedMessage = response.data.translatedContent.text;
          }
        }

        console.log("Extracted Translated Message:", translatedMessage);

        // Ensure we return a string, fallback to original message
        return String(translatedMessage).trim() || message;
      } else {
        console.error("Translation failed:", response.data.msg);
        return message;
      }
    } catch (error) {
      console.error("Comprehensive translation error:", error);
      return message;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!name || !email || !message) {
      setError(
        translations
          ? translations.requiredFieldsError
          : "Please fill in all required fields."
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    try {
      // Translate the message to the selected language before posting
      const translatedMessage = await translateMessage(
        message,
        selectedLanguage
      );

      formData.append("comments", translatedMessage);
      formData.append("shelterId", "3"); // Timber Shelter ID

      // Handle file uploads
      if (file.length) {
        for (let i = 0; i < file.length; i++) {
          formData.append("files", file[i]);
        }
      }

      // Post the comment with the translated message
      await axios.post(
        "https://api.homeforhumanity.xrvizion.com/shelter/updatecomments",
        formData,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form and fetch updated comments
      fetchComments();
      setShowModal(false);
      setName("");
      setEmail("");
      setMessage("");
      setFiles([]);
      setError("");
    } catch (error) {
      console.error("Error posting comment:", error);
      setError(
        translations
          ? translations.submissionError
          : "Failed to post comment. Please try again."
      );
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > MAX_IMAGES) {
      setError(
        translations
          ? translations.fileUploadError
          : `You can only upload up to ${MAX_IMAGES} images.`
      );
      return;
    }
    setFiles(selectedFiles);
    setError("");
  };

  const renderFilePreview = (file, index, totalFiles) => {
    const isBeyondLimit = index >= DISPLAY_LIMIT;
    const shouldShowOverlay =
      index === DISPLAY_LIMIT && totalFiles.length > DISPLAY_LIMIT;

    if (file instanceof File) {
      return (
        <div className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt="File preview"
            className={`mt-2 w-[70px] h-[70px] object-cover cursor-pointer mr-2 sm:w-[100px] sm:h-[100px] ${
              isBeyondLimit ? "grayscale" : ""
            }`}
            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
            onClick={() => openImagePopup(index, totalFiles)}
          />
          {shouldShowOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
              +{totalFiles.length - DISPLAY_LIMIT}
            </div>
          )}
        </div>
      );
    } else if (typeof file === "string") {
      return (
        <div className="relative">
          <img
            src={file}
            alt="Uploaded content"
            className={`mt-2 w-[70px] h-[70px] object-cover cursor-pointer mr-2 sm:w-[100px] sm:h-[100px] ${
              isBeyondLimit ? "grayscale" : ""
            }`}
            onClick={() => openImagePopup(index, totalFiles)}
          />
          {shouldShowOverlay && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
              +{totalFiles.length - DISPLAY_LIMIT}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const openImagePopup = (index, files) => {
    setCurrentImageIndex(index);
    setCurrentImages(files);
    setShowImagePopup(true);
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % currentImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (currentImageIndex - 1 + currentImages.length) % currentImages.length
    );
  };

  return (
    <div>
      <div className="mt-[3rem] flex justify-between w-full items-center">
        <h2 className="mini underline underline-offset-2">
          {translations ? translations.comments : "Comments"}
        </h2>
        <button
          className="border flex items-center p-2 rounded-[6rem] w-[9rem] justify-center bg-gray-100 mini border-gray-400 h-9 mr-4 text-smm"
          onClick={() => setShowModal(true)}
        >
          {translations ? translations.postAComment : "Post comments"}
        </button>
      </div>
      {comments.map((comment, index) => (
        <div key={index} className="mt-4 border-b pb-4">
          <h3 className="text-smm font-semibold">{comment.name}</h3>
          <p className="mt-2 text-smm comment-message">
            {translations?.commentMessages?.[index] || comment.comments}
          </p>
          <div className="flex flex-wrap mt-2">
            {comment.fileUrl && Array.isArray(comment.fileUrl)
              ? comment.fileUrl.map((file, idx) => (
                  <div key={idx}>
                    {renderFilePreview(file, idx, comment.fileUrl)}
                  </div>
                ))
              : comment.fileUrl &&
                renderFilePreview(comment.fileUrl, 0, [comment.fileUrl])}
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <IoMdClose size={24} />
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {translations ? translations.postAComment : "Post a Comment"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {translations ? translations.name : "Name"}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {translations ? translations.email : "Email"}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  {translations ? translations.message : "Message"}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="files"
                  className="block text-sm font-medium text-gray-700"
                >
                  {translations ? translations.uploadFiles : "Upload Files"}
                </label>
                <input
                  type="file"
                  id="files"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  multiple
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {translations ? translations.submit : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImagePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            <button
              onClick={closeImagePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <IoMdClose size={24} />
            </button>
            <div className="relative">
              <img
                src={currentImages[currentImageIndex]}
                alt="Image preview"
                className="w-full h-auto"
              />
              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                <IoIosArrowBack size={24} className="bg-white rounded-xl" />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                <IoIosArrowForward size={24} className="bg-white rounded-xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentTS;
