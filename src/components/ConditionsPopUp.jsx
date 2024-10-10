import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";

const ConditionsPopUp = ({ onClose, onSort }) => {
  const [selectedCost, setSelectedCost] = useState(null);

  const handleCostSelect = (cost) => {
    setSelectedCost(cost);
    if (cost === '1') {
      onSort('asc');
    } else {
      onSort('desc');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg relative w-3/4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl mb-4 ff-b">Cost</h2>

        {/* Cost Checklist */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="cost1"
              name="cost"
              value="1"
              checked={selectedCost === '1'}
              onChange={() => handleCostSelect('1')}
              className="mr-2"
            />
            <label htmlFor="cost1" className="flex items-center">
              <span className='ff-xl text-lg font-bold'>Low to High</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="cost2"
              name="cost"
              value="2"
              checked={selectedCost === '2'}
              onChange={() => handleCostSelect('2')}
              className="mr-2"
            />
            <label htmlFor="cost2" className="flex items-center">
              <span className='ff-xl text-lg font-bold'>High to Low</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionsPopUp;
