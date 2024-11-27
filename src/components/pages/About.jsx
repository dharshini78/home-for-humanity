import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SkeletonLoader from "../Skeletons/SkeletonAbout.jsx";
import Navbar from "../Features/navbar.jsx";

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
      <Navbar />

      <div className="p-6 flex flex-col justify-evenly leading-7">
        <h1 className="ff-xl font-bold mb-6 text-left">About</h1>
        <div>
          <p className="ff-xl text-[1.1rem] mb-8 mini">
            Home for Humanity is a community-driven initiative aimed at addressing the global housing crisis by empowering individuals with the tools and knowledge to build sustainable, low-cost shelters. Our mission is to provide accessible, DIY solutions for those facing homelessness and housing insecurity, allowing communities to take action and make a real impact in their local environments.
          </p>
          <p className="ff-xl text-[1.1rem] mb-8 mini">
            We are starting with basic shelters that have already been built and proven to be effective. As we grow, we will be adding more shelter designs and tutorials to meet diverse needs. Whether you’re a volunteer, student, or an architect, Home for Humanity equips you with the resources needed to create safe and affordable housing for people in need. By fostering collaboration and leveraging technology, we aim to make dignified living spaces accessible to all, one home at a time.
          </p>
          <p className="ff-xl text-[1.1rem] mb-8 mini">
            With your help and the dedication of volunteer builders, we can continue to grow and make a difference. Share your DIY shelter creations using the hashtag <b>#HomeForHumanity</b>  to inspire others and join our movement!
          </p>
        </div>
      </div>

      <div
        className={`mini bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-12 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
      </div>
    </>
  );
};

export default About;
