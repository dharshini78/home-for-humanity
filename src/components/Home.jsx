import { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { BsCloudSnowFill } from "react-icons/bs";
import { IoIosSunny } from "react-icons/io";
import { AiFillDollarCircle } from "react-icons/ai";
import { GoClockFill } from "react-icons/go";
import "./Home.css";
import ConditionsPopUp from "./ConditionsPopUp";
import data from './Data.jsx';

export default function Home() {
  const [openCost, setOpenCost] = useState(false);
  const [sortedData, setSortedData] = useState(data);

  const handleSort = (order) => {
    if (order === 'asc') {
      setSortedData([...sortedData].sort((a, b) => a.price - b.price));
    } else {
      setSortedData([...sortedData].sort((a, b) => b.price - a.price));
    }
  };

  return (
    <>
      <div className="border-t border-b border-black p-3 ff-xl font-bold flex justify-between items-center">
        <h1 className="ml-5">Search</h1>
        <button>
          <IoMdClose size={24} className="mr-3" />
        </button>
      </div>

      <div className="pl-5 flex mt-4">
        <button className="border flex items-center p-2 rounded-[6rem] w-[6rem] justify-center bg-gray-100 border-black h-10 mr-4">
          <h1>Climate</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>

        <button className="border flex items-center p-2 rounded-[6rem] w-[8rem] justify-center bg-gray-100 border-black h-10 mr-4">
          <h1>Head Count</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>

        <button
          className="border flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border-black h-10 mr-4"
          onClick={() => setOpenCost(true)}
        >
          <h1>Cost</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>
      </div>

      {sortedData.map((item) => (
        <div key={item.id} className="w-full p-5">
          <img src={item.img} alt={item.title} />
          <div className="flex items-center">
            <h1 className="ff-xl font-bold ml-7 mr-6">{item.title}</h1>
            <div className="flex">
              {item.weather}
              <IoIosSunny className="mr-2" />
              <BsCloudSnowFill />
            </div>
          </div>
          <div className="pl-5 flex mt-4">
            <button className="border flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border-black h-10 mr-4">
              <FaUser size={14} className="text-black" />
              <h1 className="ml-2">{item.headcounts}</h1>
            </button>

            <button className="border flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border-black h-10 mr-4">
              <AiFillDollarCircle size={18} className="text-black" />
              <AiFillDollarCircle size={18} className="text-gray-400" />
              <AiFillDollarCircle size={18} className="text-gray-400" />
              <p>Price: {item.price}</p>
            </button>

            <button className="border flex items-center p-2 rounded-[6rem] w-[8rem] justify-center bg-gray-100 border-black h-10 mr-4">
              <GoClockFill />
              <h1 className="ml-2">{item.duration}</h1>
            </button>
          </div>
        </div>
      ))}

      {openCost && <ConditionsPopUp onClose={() => setOpenCost(false)} onSort={handleSort} />}
    </>
  );
}
