import { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";

const ConditionsPopUp = ({ onClose, onSort, onClear, selectedCost }) => {
  const [localSelectedCost, setLocalSelectedCost] = useState(selectedCost);

  useEffect(() => {
    setLocalSelectedCost(selectedCost);
  }, [selectedCost]);

  const handleCostSelect = (cost) => {
    setLocalSelectedCost(cost);
    onSort('cost', cost);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg relative w-3/4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl mb-4 ff-b">Cost</h2>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="cost1"
              name="cost"
              value="asc"
              checked={localSelectedCost === 'asc'}
              onChange={() => handleCostSelect('asc')}
              className="mr-2"
            />
            <label htmlFor="cost1" className="flex items-center">
              <span className='ff-xl text-lg mini'>Low to High</span>
            </label>
          </div>

          <div className="flex items-center mini">
            <input
              type="radio"
              id="cost2"
              name="cost"
              value="desc"
              checked={localSelectedCost === 'desc'}
              onChange={() => handleCostSelect('desc')}
              className="mr-2"
            />
            <label htmlFor="cost2" className="flex items-center">
              <span className='ff-xl text-lg'>High to Low</span>
            </label>
          </div>
        </div>

        <button onClick={onClear} className="mt-4 bg-gray-200 rounded-md text-black mini ff-xl p-2">
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default ConditionsPopUp;
