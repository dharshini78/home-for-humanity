import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";

const UnitConverter = ({ onClose }) => {
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("mm");

  const units = {
    cm: 1,
    mm: 10,
    km: 0.00001,
    in: 0.393701,
    ft: 0.0328084,
    yd: 0.0109361,
    mi: 0.00000621371,
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const convertedValue = (value * units[fromUnit]) / units[toUnit];
    setOutputValue(convertedValue.toFixed(2));
  };

  const handleFromUnitChange = (e) => {
    setFromUnit(e.target.value);
    const convertedValue = (inputValue * units[e.target.value]) / units[toUnit];
    setOutputValue(convertedValue.toFixed(2));
  };

  const handleToUnitChange = (e) => {
    setToUnit(e.target.value);
    const convertedValue = (inputValue * units[fromUnit]) / units[e.target.value];
    setOutputValue(convertedValue.toFixed(2));
  };

  return (
    <div className="flex flex-col ff-xl">
      <div className="flex justify-between items-center">
        <h2 className="ff-xl text-black">Conversion</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <IoMdClose size={24} />
        </button>
      </div>
      <div className="space-y-2 mt-4">
        <div className="flex items-center">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            className="p-2 border border-black rounded-[6rem] mr-4"
            placeholder="Enter value"
          />
          <select value={fromUnit} onChange={handleFromUnitChange} className="p-2 border border-black rounded-[6rem]">
            {Object.keys(units).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={outputValue}
            readOnly
            className="p-2 border border-black rounded-[6rem] mr-4"
            placeholder="Converted value"
          />
          <select value={toUnit} onChange={handleToUnitChange} className="p-2 border border-black rounded-[6rem]">
            {Object.keys(units).map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
