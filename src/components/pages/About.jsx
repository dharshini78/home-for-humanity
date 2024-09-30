import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SkeletonLoader from "../Skeletons/SkeletonAbout.jsx";


const About = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <div className="p-6 flex flex-col justify-evenly leading-7">
        <div>
          <h1 className="ff-xl text-2xl mb-4 mini">{t("about_title")}</h1>
          <p className="ff-xl text-[1.1rem] mb-8 mini">{t("about_text")}</p>
        </div>

        <div>
          <h1 className="ff-xl text-2xl mb-4 mini">{t("our_vision_title")}</h1>
          <p className="ff-xl text-[1.1rem] mb-8 mini">
            {t("our_vision_text")}
          </p>
        </div>

        <div>
          <h1 className="ff-xl text-2xl mini mb-4">{t("our_mission_title")}</h1>
          <p className="ff-xl text-[1.1rem] mini">{t("our_mission_text")}</p>
        </div>
      </div>

      <div
        className={`mini bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-12 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link
          to="/"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl"
        >
          {t("shelters")}
        </Link>
        <Link
          to="/about"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl"
        >
          {t("about_title")}
        </Link>
        <Link
          to="/faqs"
          className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl"
        >
          {t("faqs")}
        </Link>
      </div>
    </>
  );
};

export default About;
