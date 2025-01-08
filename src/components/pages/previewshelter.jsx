import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Features/navbar";
import { FaUser, FaClipboardList, FaBookReader } from "react-icons/fa";
import { IoDownload } from "react-icons/io5";
import { GoClockFill } from "react-icons/go";
import { BsSunFill, BsCloudRainHeavyFill, BsSnow, BsWind } from "react-icons/bs";
import { AiFillDollarCircle } from "react-icons/ai";

const PreviewShelter = () => {
  const location = useLocation();
  const {
    name,
    thumbnail,
    shelterImage,
    occupancy,
    climate,
    duration,
    description,
    tags,
    instructions,
    price,
  } = location.state;

  const climateIcons = {
    sunny: <BsSunFill />,
    snowy: <BsSnow />,
    rainy: <BsCloudRainHeavyFill />,
    windy: <BsWind />,
  };

  return (
    <>
      <Navbar />
      <div className="border-black ff-xl flex justify-between items-center">
        <div className="flex items-center pl-6 mt-4 mb-3 ff-xl mini">
          <h1 className="ml-2">{name}</h1>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row px-6">
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex flex-col">
            <div className="flex">
              <div className="flex items-center rounded-[6rem] w-[3.4rem] justify-center border border-gray-600 h-8 text-sm md:text-base md:w-[5rem]">
                <FaUser size={14} className="text-black" />
                <span className="ml-2 mt-1 materials-font">{occupancy}</span>
              </div>
              <div className="flex items-center rounded-[6rem] w-[8rem] justify-center border border-gray-600 h-8 text-sm md:text-base md:w-[8rem]">
                <GoClockFill />
                <span className="ml-2 mt-1 materials-font">{duration} weeks</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-normal items-start mb-9">
            <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="w-full h-auto" />
            <div className="w-full flex flex-col justify-between h-[180px] mt-5">
              <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5">
                <FaBookReader size={16} className="mr-4" />
                Instructions
              </button>
              <button className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5">
                <FaClipboardList size={18} className="mr-3" />
                Material List
              </button>
              <a
                href="#"
                className="border-b-[0.6px] w-full flex pb-5 border-gray-400 text-smm items-center mt-5 text-blue-500  hover:text-blue-700"
              >
                <IoDownload size={24} className="mr-2 text-gray-800 mb-1" />
                Download as PDF
              </a>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col lg:mt-0 lg:pl-6">
          <div className="w-full text-smm">
            <h2 className="text-lg font-bold">Design Credits</h2>
            <pre className="whitespace-pre-wrap text-smm">{description}</pre>
          </div>
          <div className="w-full mt-4">
            <h2 className="text-lg font-bold">Bibliography</h2>
            <pre className="whitespace-pre-wrap text-smm">{tags}</pre>
          </div>
          <div className="w-full mt-4">
            <h2 className="text-lg font-bold">Climate</h2>
            <div className="flex flex-wrap gap-2">
              {climate.map((climateType) => (
                <div key={climateType} className="flex items-center gap-1 px-[0.4rem] py-[0.2rem] border rounded-full">
                  {climateIcons[climateType]}
                  <span className="capitalize">{climateType}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mt-4">
            <h2 className="text-lg font-bold">Price</h2>
            <div className="flex items-center">
              {Array.from({ length: 3 }, (_, i) => (
                <AiFillDollarCircle
                  key={i}
                  size={18}
                  className={`text-${i < ["low", "medium", "high"].indexOf(price) + 1 ? "current" : "gray-400"}`}
                />
              ))}
            </div>
          </div>
          <div className="w-full mt-4">
            <h2 className="text-lg font-bold">Instructions</h2>
            <ul>
              {instructions.map((instruction, index) => (
                <li key={index} className="mb-4">
                  <strong>{index + 1}. </strong> {instruction.description}
                  <img src={URL.createObjectURL(instruction.picture)} alt={`Instruction ${index + 1}`} className="w-full h-auto mt-2" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {instruction.materialImages.map((image, imgIndex) => (
                      <img key={imgIndex} src={URL.createObjectURL(image)} alt={`Material ${imgIndex + 1}`} className="w-24 h-24 object-cover" />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewShelter;
