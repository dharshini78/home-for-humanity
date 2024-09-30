import { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";

const HeadCountPopUp = ({ onClose, onSort, onClear, selectedHeadCount }) => {
  const [localSelectedHeadCount, setLocalSelectedHeadCount] = useState(selectedHeadCount);

  useEffect(() => {
    setLocalSelectedHeadCount(selectedHeadCount);
  }, [selectedHeadCount]);

  const handleHeadCountSelect = (headCount) => {
    setLocalSelectedHeadCount(headCount);
    onSort('headcount', headCount);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ff-xl mini">
      <div className="bg-white p-10 rounded-lg shadow-lg relative w-3/4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl mb-4 ff-b">Head Count</h2>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="headCount1"
              name="headCount"
              value="1"
              checked={localSelectedHeadCount === '1'}
              onChange={() => handleHeadCountSelect('1')}
              className="mr-2"
            />
            <label htmlFor="headCount1" className="flex items-center">
              <span className='ff-xl text-lg'>1</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="headCount2"
              name="headCount"
              value="2-3"
              checked={localSelectedHeadCount === '2-3'}
              onChange={() => handleHeadCountSelect('2-3')}
              className="mr-2"
            />
            <label htmlFor="headCount2" className="flex items-center">
              <span className='ff-xl text-lg'>2-3</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="headCount3"
              name="headCount"
              value="3-4"
              checked={localSelectedHeadCount === '3-4'}
              onChange={() => handleHeadCountSelect('3-4')}
              className="mr-2"
            />
            <label htmlFor="headCount3" className="flex items-center">
              <span className='ff-xl text-lg'>3-4</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="headCount4"
              name="headCount"
              value="more than 4"
              checked={localSelectedHeadCount === 'more than 4'}
              onChange={() => handleHeadCountSelect('more than 4')}
              className="mr-2"
            />
            <label htmlFor="headCount4" className="flex items-center">
              <span className='ff-xl text-lg'>More than 4</span>
            </label>
          </div>
        </div>

        <button onClick={onClear} className="mt-4 bg-gray-200 rounded-md text-black mini ff-xl p-2">
          Clear Filter
        </button>

        <p className="mt-4 text-gray-600">Caution: A lesser number of headcounts will take more time to build a shelter.</p>
      </div>
    </div>
  );
};

export default HeadCountPopUp;
