import { useState, useEffect } from "react";
import Navbar from "../Features/navbar.jsx";
import { useLanguage } from "../Features/languageContext.jsx";
import he from 'he'; // Import the he library

const Credits = () => {
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`https://api.homeforhumanity.xrvizion.com/shelter/gettranslation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shelterName: "OtherPages",
            langCode: selectedLanguage,
            fileName: 'creditspage_en.json',
          }),
        });
        const data = await response.json();
        if (data.msg === "Success") {
          const decodedContent = decodeContent(data.translatedContent);
          setTranslations(decodedContent);
        } else {
          console.error('Error in translation response:', data.msg);
        }
      } catch (error) {
        console.error('Error fetching credits translations:', error);
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
    if (typeof content === 'string') {
      return he.decode(content);
    } else if (Array.isArray(content)) {
      return content.map(decodeContent);
    } else if (typeof content === 'object' && content !== null) {
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

      <div className="container mx-auto px-4 py-8 mini flex flex-col items-start justify-start min-h-screen">
        <h1 className="ff-xl font-bold mb-6 text-left">{translations ? translations.Credits : "Credits"}</h1>

        <section className="mb-8 w-full max-w-3xl">
          <h2 className="ff-xl font-bold mb-4 text-left">{translations ? translations.TEAM : "TEAM"}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{translations ? translations.Founders : "Founders"}</h3>
              <p>{translations ? translations.foundersDescription : "Miki Higasa, Julie Gilhart, Tomoko Ogura and Kikka Hanazawa, Fashion Girls for Humanity, https://www.fashiongirlsforhumanity.org/"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{translations ? translations.ProjectLeader : "Project Leader"}</h3>
              <p>{translations ? translations.projectLeaderDescription : "Kai Dal Bello, Home for Humanity Project, Fashion Girls for Humanity"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{translations ? translations.Curators : "Curators"}</h3>
              <p>{translations ? translations.curator1 : "Prof. Momoyo Kaijima, Chair of Architectural Behaviorology, Institute for Architectural Design (iea), ETH Zurich, www.kaijima.arch.ethz.ch"}</p>
              <p>{translations ? translations.curator2 : "Prof. Laurent Stalder, Chair of the Theory of Architecture, Institute for the History and Theory of Architecture (gta), ETH Zurich, www.stalder.arch.ethz.ch"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{translations ? translations.Collaborators : "Collaborators"}</h3>
              <p>{translations ? translations.collaboratorsDescription : "Christoph Danuser, Architect at Atelier Danuser & Teaching and Research Assistant, ETH Zurich, Davide Spina, Postdoctoral Researcher, ETH Zurich, Federico Bertagna, Postdoctoral Researcher and Lecturer, ETH Zurich"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{translations ? translations.Drawingsby : "Drawings by"}</h3>
              <p>{translations ? translations.drawingsDescription : "Christoph Danuser, ETH Zurich, Jan Aebi, Student Assistant, ETH Zurich, Dimitri Bleichenbacher, Student Assistant, ETH Zurich, Matthias Bisig, Student Assistant, ETH Zurich, Miriam Gabour, Student Assistant, ETH Zurich"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{translations ? translations.Webdesign : "Webdesign"}</h3>
              <p>{translations ? translations.webdesignDescription : "Subham Jain, XR Vizion, www.xrvizion.com"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{translations ? translations.Advisors : "Advisors"}</h3>
              <p>{translations ? translations.advisorsDescription : "Hitoshi Abe, UCLA Professor, Architecture & Urban Design and Director of UCLA Terasaki Chair for Contemporary Japanese Studies, Shohei Shigematsu, Partner at OMA North America, https://www.oma.com/news/oma-new-york-office, Toyo Ito, Toyo Ito & Associates, http://www.toyo-ito.co.jp, Moises Gonzalez, Architect"}</p>
            </div>
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
