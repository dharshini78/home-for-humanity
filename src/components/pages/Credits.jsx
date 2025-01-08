import { useState, useEffect } from "react";
import Navbar from "../Features/navbar.jsx";
import { useLanguage } from "../Features/languageContext.jsx";
import he from "he"; // Import the he library

const Credits = () => {
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(
          `https://api.homeforhumanity.xrvizion.com/shelter/gettranslation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shelterName: "OtherPages",
              langCode: selectedLanguage,
              fileName: "creditspage_en.json",
            }),
          }
        );
        const data = await response.json();
        if (data.msg === "Success") {
          const decodedContent = decodeContent(data.translatedContent);
          setTranslations(decodedContent);
        } else {
          console.error("Error in translation response:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching credits translations:", error);
      }
    };

    fetchTranslations();
  }, [selectedLanguage]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const decodeContent = (content) => {
    if (typeof content === "string") {
      return he.decode(content);
    } else if (Array.isArray(content)) {
      return content.map(decodeContent);
    } else if (typeof content === "object" && content !== null) {
      const decodedObject = {};
      for (const key in content) {
        if (content.hasOwnProperty(key)) {
          decodedObject[key] = decodeContent(content[key]);
        }
      }
      return decodedObject;
    }
    return content;
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex flex-col items-start justify-start min-h-screen">
        <h1 className="ff-xl font-bold mb-6 text-left">
          {translations ? translations.Credits : "Credits"}
        </h1>

        <section className="mb-8 w-full max-w-3xl">
          <h2 className="ff-xl font-bold mb-4 text-left">
            {translations ? translations.TEAM : "TEAM"}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-smm font-semibold">
                {translations ? translations.Founders : "Founders"}
              </h3>
              <p className="text-smm">
                {translations
                  ? translations.foundersDescription
                  : "Miki Higasa, Julie Gilhart, Tomoko Ogura and Kikka Hanazawa, Fashion Girls for Humanity, "}
                <a
                  href={
                    translations
                      ? translations.foundersLinks[0]
                      : "https://www.fashiongirlsforhumanity.org/"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations
                    ? translations.foundersLinks[0]
                    : "https://www.fashiongirlsforhumanity.org/"}
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-smm font-semibold">
                {translations ? translations.ProjectLeader : "Project Leader"}
              </h3>
              <p className="text-smm">
                {translations
                  ? translations.projectLeaderDescription
                  : "Kai Dal Bello, Home for Humanity Project, Fashion Girls for Humanity"}
              </p>
            </div>
            <div>
              <h3 className="text-smm font-semibold">
                {translations ? translations.Curators : "Curators"}
              </h3>
              <p className="text-smm">
                {translations
                  ? translations.curator1
                  : "Prof. Momoyo Kaijima, Chair of Architectural Behaviorology, Institute for Architectural Design (iea), ETH Zurich, "}
                <a
                  href={
                    translations
                      ? translations.curator1Links[0]
                      : "http://www.kaijima.arch.ethz.ch"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations
                    ? translations.curator1Links[0]
                    : "www.kaijima.arch.ethz.ch"}
                </a>
              </p>
              <p className="text-smm">
                {translations
                  ? translations.curator2
                  : "Prof. Laurent Stalder, Chair of the Theory of Architecture, Institute for the History and Theory of Architecture (gta), ETH Zurich, "}
                <a
                  href={
                    translations
                      ? translations.curator2Links[0]
                      : "http://www.stalder.arch.ethz.ch"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations
                    ? translations.curator2Links[0]
                    : "www.stalder.arch.ethz.ch"}
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-smm font-semibold">
                {translations ? translations.Collaborators : "Collaborators"}
              </h3>
              <p className="text-smm">
                {translations
                  ? translations.collaboratorsDescription
                  : "Christoph Danuser, Architect at Atelier Danuser & Teaching and Research Assistant, ETH Zurich, Davide Spina, Postdoctoral Researcher, ETH Zurich, Federico Bertagna, Postdoctoral Researcher and Lecturer, ETH Zurich"}
              </p>
            </div>
            <div>
              <h3 className="text-smm font-semibold">
                {translations ? translations.Drawingsby : "Drawings by"}
              </h3>
              <p className="text-smm">
                {translations
                  ? translations.drawingsDescription
                  : "Christoph Danuser, ETH Zurich, Jan Aebi, Student Assistant, ETH Zurich, Dimitri Bleichenbacher, Student Assistant, ETH Zurich, Matthias Bisig, Student Assistant, ETH Zurich, Miriam Gabour, Student Assistant, ETH Zurich"}
              </p>
            </div>
            <div>
              <h3 className="text-smm font-semibold">
                {translations ? translations.Webdesign : "Webdesign"}
              </h3>
              <p className="text-smm">
                {translations
                  ? translations.webdesignDescription
                  : "Subham Jain, XR Vizion, "}
                <a
                  href={
                    translations
                      ? translations.webdesignLinks[0]
                      : "http://www.xrvizion.com"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations
                    ? translations.webdesignLinks[0]
                    : "http://www.xrvizion.com"}
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-smm font-semibold">
                {translations ? translations.Advisors : "Advisors"}
              </h3>
              <p className="text-smm">
                {translations
                  ? translations.advisorsDescription
                  : "Hitoshi Abe, UCLA Professor, Architecture & Urban Design and Director of UCLA Terasaki Chair for Contemporary Japanese Studies, Shohei Shigematsu, Partner at OMA North America, "}
                <a
                  href={
                    translations
                      ? translations.advisorsLinks[0]
                      : "https://www.oma.com/news/oma-new-york-office"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations
                    ? translations.advisorsLinks[0]
                    : "https://www.oma.com/news/oma-new-york-office"}
                </a>
                {", Toyo Ito, Toyo Ito & Associates, "}
                <a
                  href={
                    translations
                      ? translations.advisorsLinks[1]
                      : "http://www.toyo-ito.co.jp"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations
                    ? translations.advisorsLinks[1]
                    : "http://www.toyo-ito.co.jp"}
                </a>
                {", Moises Gonzalez, Architect"}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 w-full max-w-3xl">
          <h2 className="ff-xl font-bold mb-4 text-left">
            {translations ? translations.Bibliography.title : "Bibliography"}
          </h2>
          <div className="space-y-4">
            {translations && translations.Bibliography ? (
              Object.keys(translations.Bibliography).map((shelter, index) => (
                <div key={index}>
                  <h3 className="text-smm font-semibold mb-2">{shelter}</h3>
                  {translations.Bibliography[shelter].bibliography.map(
                    (item, idx) => (
                      <div key={idx} className="mb-4">
                        <p className="font-semibold">{item.title}</p>
                        {item.author && <p className="text-smm">{item.author}</p>}
                        {item.publisher && <p className="text-smm">{item.publisher}</p>}
                        {item.address && <p className="text-smm">{item.address}</p>}
                        {item.year && <p className="text-smm">{item.year}</p>}
                        {item.date && <p className="text-smm">{item.date}</p>}
                        {item.source && <p className="text-smm">{item.source}</p>}
                        {item.platform && <p className="text-smm">{item.platform}</p>}
                        {item.links &&
                          item.links.map((link, linkIdx) => (
                            <a
                              key={linkIdx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline hover:text-blue-700 ml-1 block"
                            >
                              {link}
                            </a>
                          ))}
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div>
                <p className="font-semibold">
                  Transitional shelters - Eight designs
                </p>
                <p className="text-smm">
                  International Federation of Red Cross and Red Crescent
                  Societies
                </p>
                <p className="text-smm">Geneva</p>
                <p className="text-smm">2011</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default Credits;
