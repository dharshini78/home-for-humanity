import React from 'react'

const filters = () => {
  return (
     <div className="pl-5 flex mt-6 mini">
        <button
          className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-10 mr-4 md:text-base md:w-[8rem]"
          onClick={() => {
            setOpenClimate(true);
            speakText("climate", i18n.language, isMuted);
          }}
        >
          <h1 className="mt-1 text-[.9rem]">{t("climate")}</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>

        <button
          className="flex items-center p-2 rounded-[6rem] justify-center bg-gray-100 border border-black h-10 mr-4 md:text-base md:w-[8rem]"
          onClick={() => {
            setOpenHeadCount(true);
            speakText("headcount", i18n.language, isMuted);
          }}
        >
          <h1 className="text-[.9rem] mt-1">{t("head count")}</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>

        <button
          className="flex items-center p-2 rounded-[6rem] w-[5rem] justify-center bg-gray-100 border border-black h-10 mr-4  md:text-base md:w-[5rem]"
          onClick={() => {
            setOpenCost(true);
            speakText("cost", i18n.language, isMuted);
          }}
        >
          <h1 className="text-[0.9rem] mt-1">{t("cost")}</h1>
          <IoIosArrowDown className="ml-1 mt-1" />
        </button>
      </div> 
  )
}

export default filters