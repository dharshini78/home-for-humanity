import React, { useState, useRef, useEffect } from "react";
import { FaCircleArrowRight, FaCircleArrowLeft } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { useDropzone } from "react-dropzone";
import {
  BsPeopleFill,
  BsCloudRainHeavyFill,
  BsSnow,
  BsWind,
  BsSunFill,
  BsClockFill,
} from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import Navbar from "../Features/navbar";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { AiFillDollarCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [shelterImage, setShelterImage] = useState(null);
  const [occupancy, setOccupancy] = useState("");
  const [climate, setClimate] = useState([]);
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [step, setStep] = useState(1);
  const [instructions, setInstructions] = useState([]);
  const [isStepsOpen, setStepsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [materialImages, setMaterialImages] = useState([]);
  const [price, setPrice] = useState("");

  const stepsRef = useRef(null);
  const navigate = useNavigate();

  const handleInputBlur = () => {
    // Handle input blur logic if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleClimateChange = (e) => {
    const { value, checked } = e.target;
    setClimate((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleAddInstruction = (e) => {
    e.preventDefault();
    const newInstruction = {
      picture: e.target.picture.files[0],
      description: e.target.description.value,
      materials: materials,
      materialImages: materialImages,
    };
    setInstructions([...instructions, newInstruction]);
    e.target.reset();
    setCurrentInstructionIndex(null);
    setMaterials([]);
    setMaterialImages([]);
  };

  const handleEditInstruction = (index) => {
    const instructionToEdit = instructions[index];
    setCurrentInstructionIndex(index);
    // Populate the form fields with the instruction data
    document.querySelector('input[name="picture"]').files =
      instructionToEdit.picture;
    document.querySelector('textarea[name="description"]').value =
      instructionToEdit.description;
    setMaterials(instructionToEdit.materials);
    setMaterialImages(instructionToEdit.materialImages);
  };

  const toggleSteps = () => {
    setStepsOpen(!isStepsOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onDropThumbnail = (acceptedFiles) => {
    setThumbnail(acceptedFiles[0]);
  };

  const onDropShelterImage = (acceptedFiles) => {
    setShelterImage(acceptedFiles[0]);
  };

  const onDropMaterialImage = (acceptedFiles) => {
    setMaterialImages([...materialImages, ...acceptedFiles]);
  };

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    onDrop: onDropThumbnail,
    accept: "image/*",
    multiple: false,
  });

  const {
    getRootProps: getShelterImageRootProps,
    getInputProps: getShelterImageInputProps,
  } = useDropzone({
    onDrop: onDropShelterImage,
    accept: "image/*",
    multiple: false,
  });

  const {
    getRootProps: getMaterialImageRootProps,
    getInputProps: getMaterialImageInputProps,
  } = useDropzone({
    onDrop: onDropMaterialImage,
    accept: "image/*",
    multiple: true,
  });

  const handleAddMaterial = () => {
    setMaterials([...materials, ""]);
  };

  const handleMaterialChange = (index, value) => {
    const newMaterials = [...materials];
    newMaterials[index] = value;
    setMaterials(newMaterials);
  };

  const handlePreview = () => {
    navigate("/preview");
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-start min-h-screen p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-md text-center custom-scrollbar">
          {step === 1 && (
            <>
              <h2 className="ff-xl mb-4">Create a new shelter</h2>
              <p className="text-smm mb-8 text-justify">
                A shelter contains all instructions / steps, including pictures
                and videos to build a shelter.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="relative mb-4">
                  <input
                    required
                    onBlur={handleInputBlur}
                    type="text"
                    className="w-full p-2 mb-4 border border-gray-300 rounded text-smm bg-gray-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Shelter Name"
                  />
                  <BsFillQuestionCircleFill
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                    title="Enter the name of the shelter"
                  />
                </div>
                <div className="relative mb-4">
                  <div {...getThumbnailRootProps({ className: "upload-box" })}>
                    <input {...getThumbnailInputProps()} />
                    <FaUpload className="upload-icon" />
                    <p>
                      Drag and drop a thumbnail image here, or click to select a
                      file
                    </p>
                  </div>
                  {thumbnail && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Thumbnail Preview"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                <div className="relative mb-4">
                  <div
                    {...getShelterImageRootProps({ className: "upload-box" })}
                  >
                    <input {...getShelterImageInputProps()} />
                    <FaUpload className="upload-icon" />
                    <p>
                      Drag and drop a shelter image here, or click to select a
                      file
                    </p>
                  </div>
                  {shelterImage && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(shelterImage)}
                        alt="Shelter Image Preview"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                <div className="relative mb-4">
                  <select
                    required
                    className="w-full p-2 border border-gray-300 rounded text-smm bg-gray-200 appearance-none"
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value)}
                  >
                    <option value="" disabled>
                      Occupancy
                    </option>
                    {[2, 3, 4, 5, 6, 7, 8, "9+"].map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                  <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900" />
                </div>
                <div className="mb-4">
                  <label className="text-smm text-gray-600 flex">
                    Select the climate
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "sunny", icon: <BsSunFill /> },
                      { name: "snowy", icon: <BsSnow /> },
                      { name: "rainy", icon: <BsCloudRainHeavyFill /> },
                      { name: "windy", icon: <BsWind /> },
                    ].map(({ name, icon }) => (
                      <label key={name} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          value={name}
                          checked={climate.includes(name)}
                          onChange={handleClimateChange}
                          className="hidden"
                        />
                        <span
                          className={`flex items-center gap-1 px-[0.4rem] py-[0.2rem] border rounded-full cursor-pointer materials-fontt ${
                            climate.includes(name)
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-white-700 border-gray-400"
                          }`}
                        >
                          {icon}
                          <span className="capitalize">{name}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="relative mb-4">
                  <select
                    required
                    className="w-full p-2 border border-gray-300 rounded text-smm bg-gray-200 appearance-none"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="" disabled>
                      Duration to Build
                    </option>
                    {["2-3", "3-4", "4-5", "5-6", "6-7", "7+"].map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  <BsClockFill className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900" />
                </div>
                <div className="relative mb-4">
                  <select
                    required
                    className="w-full p-2 border border-gray-300 rounded text-smm bg-gray-200 appearance-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  >
                    <option value="" disabled>
                      Price
                    </option>
                    {["low", "medium", "high"].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                    {Array.from({ length: 3 }, (_, i) => (
                      <AiFillDollarCircle
                        key={i}
                        size={18}
                        className={`text-${
                          i < ["low", "medium", "high"].indexOf(price) + 1
                            ? "current"
                            : "gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full p-2 mb-4 border border-gray-300 rounded text-smm bg-gray-200"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Design Credits"
                  />
                  <BsFillQuestionCircleFill
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                    title="Description of the shelter"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 mb-4 border border-gray-300 rounded text-smm bg-gray-200"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Bibliography (Optional)"
                  />
                  <BsFillQuestionCircleFill
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                    title="Tags are used in homeforhumanity forum to get help and support"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className="w-[9rem] p-2 bg-gray-200 border-none rounded flex justify-center items-center text-smm"
                  >
                    <FaCircleArrowLeft className="mr-2" />
                    <a href="/dashboard">Back</a>
                  </button>
                  <button
                    type="button"
                    className="w-[9rem] p-2 bg-gray-900 border-none rounded flex justify-center items-center text-gray-100"
                    onClick={handleNext}
                  >
                    Next <FaCircleArrowRight className="ml-2" />
                  </button>
                </div>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="ff-xl mb-4">Add Instructions</h2>
                {isMobile && instructions.length > 0 && (
                  <button
                    className="flex items-center p-2 mb-6 rounded-full justify-center bg-gray-100 border border-black h-9"
                    onClick={toggleSteps}
                  >
                    Steps <FaCircleArrowRight className="ml-2" />
                  </button>
                )}
              </div>

              <p className="text-smm mb-8 text-justify">
                Provide clear and concise guidance for each task or action
                required in the construction process. Ensure that the
                instructions are easy to follow and comprehensive, covering
                everything from preparation to execution.
              </p>
              <form onSubmit={handleAddInstruction}>
                <div className="relative mb-4">
                  <label className="text-smm text-gray-600 flex mb-2">
                    Upload Instruction Image
                  </label>
                  <div {...getThumbnailRootProps({ className: "upload-box" })}>
                    <input {...getThumbnailInputProps()} name="picture" />
                    <FaUpload className="upload-icon" />
                    <p>
                      Drag and drop an instruction image here, or click to
                      select a file
                    </p>
                  </div>
                  {thumbnail && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Instruction Image Preview"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
                <div className="relative mb-4">
                  <textarea
                    required
                    className="w-full p-2 mb-4 border border-gray-300 rounded text-smm bg-gray-200"
                    name="description"
                    placeholder="Description"
                  />
                  <BsFillQuestionCircleFill
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                    title="Provide a detailed description of the instruction"
                  />
                </div>
                <div className="relative mb-4">
                  <label className="text-smm text-gray-600 flex mb-2">
                    Upload Material Images
                  </label>
                  <div
                    {...getMaterialImageRootProps({ className: "upload-box" })}
                  >
                    <input {...getMaterialImageInputProps()} />
                    <FaUpload className="upload-icon" />
                    <p>
                      Drag and drop material images here, or click to select
                      files
                    </p>
                  </div>
                  {materialImages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {materialImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Material Image Preview ${index + 1}`}
                            className="w-24 h-24 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative mb-4">
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded text-smm bg-gray-200"
                        value={material}
                        onChange={(e) =>
                          handleMaterialChange(index, e.target.value)
                        }
                        placeholder={`Material ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="ml-2 p-2 bg-red-500 text-white rounded"
                        onClick={() => {
                          const newMaterials = [...materials];
                          newMaterials.splice(index, 1);
                          setMaterials(newMaterials);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="p-2 bg-gray-900 text-white rounded"
                    onClick={handleAddMaterial}
                  >
                    Add Material
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    className="w-full p-2 mb-4 border border-gray-300 rounded text-smm bg-gray-200"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Reference video url"
                  />
                  <BsFillQuestionCircleFill
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 cursor-pointer"
                    title="Reference videos url for this step"
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    type="button"
                    className="w-[9rem] p-2 bg-gray-200 border-none rounded flex justify-center items-center text-smm"
                    onClick={handleBack}
                  >
                    <FaCircleArrowLeft className="mr-2" /> Back
                  </button>
                  <button
                    type="submit"
                    className="w-[9rem] p-2 bg-gray-900 border-none rounded flex justify-center items-center text-white"
                  >
                    <IoMdSave className="mr-2 size-5" /> Save
                  </button>
                </div>
              </form>
              <div className="fixed bottom-4 right-4">
                <button
                  type="button"
                  className="w-[9rem] p-2 bg-gray-900 border-none rounded flex justify-center items-center text-white"
                  onClick={handlePreview}
                >
                  Preview
                  <FaCircleCheck className="ml-2 size-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {step === 2 && !isMobile && (
          <div className="bg-transparent p-4 rounded-lg w-full max-w-xs ml-4 custom-scrollbar">
            <h3 className="ff-xl mb-4">Instructions</h3>
            <ul>
              {instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="mb-4 cursor-pointer"
                  onClick={() => handleEditInstruction(index)}
                >
                  <strong>{index + 1}. </strong> {instruction.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {step === 2 && (
        <div
          className={`fixed top-[76px] w-full h-screen md:hidden transition-transform duration-300 ease-in-out ${
            isStepsOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <div className="w-full h-full bg-white p-6 border-l-2 border-gray-600 overflow-y-auto custom-scrollbar">
            <div className="flex justify-end mb-4">
              <button
                className="flex items-center p-2 rounded-full justify-center bg-gray-100 border border-black h-9"
                onClick={toggleSteps}
              >
                <span className="text-smm mr-2">Close</span>
                <FaCircleArrowRight size={20} />
              </button>
            </div>

            <h3 className="ff-xl mb-4">Instructions</h3>
            <ul>
              {instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="mb-4 text-smm cursor-pointer"
                  onClick={() => handleEditInstruction(index)}
                >
                  <strong>{index + 1}.</strong> {instruction.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #888888 #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }
        .upload-box {
          border: 2px solid #cccccc;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          background-color: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .upload-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default CreateProject;
