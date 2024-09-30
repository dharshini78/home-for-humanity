import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import data from "../Data/PTSData.jsx";
import { IoMdArrowBack } from "react-icons/io";
import SkeletonLoader from "../Skeletons/SkeletonMaterialOne.jsx";
import "../Home.css";

const MaterialsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const titleWithId = data.find((item) => item.id === id);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const goBack = () => {
    navigate(`/haven/${id}`);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!titleWithId) {
    return <div>Materials list not found</div>;
  }

  return (
    <>
      <div className="border-t border-black ff-xl flex justify-between items-center">
        <div className="flex items-center pl-6 mt-4 mb-2 ff-xl mini">
          <button className="flex items-center" onClick={goBack}>
            <IoMdArrowBack size={20} />
          </button>
          <h1 className="ml-2">{t(titleWithId.title)}</h1>
        </div>
      </div>
      <div className="flex flex-col px-6">
        <div className="mt-6 flex flex-col justify-normal items-start min-h-svh">
          <h1 className="underline underline-offset-2 mt-6 text-smm">Material list</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 materials-font">
            {titleWithId.list.map((item, index) => (
              <div key={index} className="flex items-center mt-4">
                <p>{item.listImgName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialsList;
