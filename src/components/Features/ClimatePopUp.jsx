import { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";

const ClimatePopUp = ({ onClose, onSort, onClear, selectedClimate }) => {
  const [localSelectedClimate, setLocalSelectedClimate] = useState(selectedClimate);

  useEffect(() => {
    setLocalSelectedClimate(selectedClimate);
  }, [selectedClimate]);

  const handleClimateSelect = (climate) => {
    setLocalSelectedClimate(climate);
    onSort('climate', climate);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg relative w-3/4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl mb-4 ff-b">Climate</h2>

        {/* Climate Checklist */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="climate1"
              name="climate"
              value="sunny"
              checked={localSelectedClimate === 'sunny'}
              onChange={() => handleClimateSelect('sunny')}
              className="mr-2"
            />
            <label htmlFor="climate1" className="flex items-center">
              <span className='ff-xl text-lg'>Sunny</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="climate2"
              name="climate"
              value="snowy"
              checked={localSelectedClimate === 'snowy'}
              onChange={() => handleClimateSelect('snowy')}
              className="mr-2"
            />
            <label htmlFor="climate2" className="flex items-center">
              <span className='ff-xl text-lg'>Snowy</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="climate3"
              name="climate"
              value="windy"
              checked={localSelectedClimate === 'windy'}
              onChange={() => handleClimateSelect('windy')}
              className="mr-2"
            />
            <label htmlFor="climate3" className="flex items-center">
              <span className='ff-xl text-lg'>Windy</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="climate4"
              name="climate"
              value="rainy"
              checked={localSelectedClimate === 'rainy'}
              onChange={() => handleClimateSelect('rainy')}
              className="mr-2"
            />
            <label htmlFor="climate4" className="flex items-center">
              <span className='ff-xl text-lg'>Rainy</span>
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

export default ClimatePopUp;
