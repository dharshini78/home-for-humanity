
import React from 'react';
import { IoMdClose } from "react-icons/io";

const LanguagePopUp = ({ onClose, onSelectLanguage }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-lg shadow-lg relative w-3/4">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl mb-4 ff-b">Select Language</h2>

        <div className="space-y-2">
          <button
            onClick={() => onSelectLanguage('en')}
            className="w-full border p-3 rounded-lg text-left ff-xl text-lg font-bold"
          >
            English
          </button>
          <button
            onClick={() => onSelectLanguage('es')}
            className="w-full border p-3 rounded-lg text-left ff-xl text-lg font-bold"
          >
            Spanish
          </button>
          <button
            onClick={() => onSelectLanguage('fr')}
            className="w-full border p-3 rounded-lg text-left ff-xl text-lg font-bold"
          >
            French
          </button>
          <button
            onClick={() => onSelectLanguage('de')}
            className="w-full border p-3 rounded-lg text-left ff-xl text-lg font-bold"
          >
            German
          </button>
          <button
            onClick={() => onSelectLanguage('zh')}
            className="w-full border p-3 rounded-lg text-left ff-xl text-lg font-bold"
          >
            Chinese
          </button>
          <button
            onClick={() => onSelectLanguage('hi')}
            className="w-full border p-3 rounded-lg text-left ff-xl text-lg font-bold"
          >
            Hindi
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePopUp;