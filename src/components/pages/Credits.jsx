import { useState, useEffect } from "react";
import Navbar from "../Features/navbar.jsx";
import { useLanguage } from "../Features/languageContext.jsx";
import he from "he";

const Credits = () => {
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const resp = await fetch(
          `https://api.diyhomes.ai/shelter/gettranslation`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              shelterName: "OtherPages",
              langCode: selectedLanguage,
              fileName: "creditspage_en.json"
            })
          }
        );
        const data = await resp.json();
        if (data.msg === "Success") {
          setTranslations(decodeContent(data.translatedContent));
        } else {
          console.error("Translation error:", data.msg);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchTranslations();
  }, [selectedLanguage]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const decodeContent = (content) => {
    if (typeof content === "string") return he.decode(content);
    if (Array.isArray(content)) return content.map(decodeContent);
    if (typeof content === "object" && content) {
      const obj = {};
      for (const k in content) {
        if (content.hasOwnProperty(k)) obj[k] = decodeContent(content[k]);
      }
      return obj;
    }
    return content;
  };

  if (loading) return <Navbar />;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex flex-col items-start min-h-screen">
        <h1 className="ff-xl font-bold mb-6">
          {translations?.Credits || "Credits"}
        </h1>

        <section className="mb-8 w-full max-w-3xl">
          <h2 className="ff-xl font-bold mb-4">
            {translations?.TEAM || "TEAM"}
          </h2>
          <div className="space-y-6">
            {/* Founders */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.Founders || "Founders"}
              </h3>
              <p className="text-smm">
                {translations?.foundersDescription ||
                  "Fashion Girls for Humanity, Miki Higasa, Julie Gilhart, Tomoko Ogura and Kikka Hanazawa"}
                <a
                  href={translations?.foundersLinks?.[0] ||
                    "https://www.fashiongirlsforhumanity.org/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations?.foundersLinks?.[0] ||
                    "https://www.fashiongirlsforhumanity.org/"}
                </a>
              </p>
            </div>

            {/* Project Leader */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.ProjectLeader || "Founders’ Project Leader"}
              </h3>
              <p className="text-smm">
                {translations?.projectLeaderDescription ||
                  "Kai Dal Bello, Home for Humanity Project, Fashion Girls for Humanity"}
              </p>
            </div>

            {/* Curators Team */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.Curators || "Curators Team"}
              </h3>
              <p className="text-smm mb-1">
                {translations?.curator1 ||
                  "Prof. Momoyo Kaijima, Chair of Architectural Behaviorology, Institute for Architectural Design (IEA), ETH Zurich"}
                <a
                  href={translations?.curator1Links?.[0] ||
                    "https://www.kaijima.arch.ethz.ch"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations?.curator1Links?.[0] ||
                    "https://www.kaijima.arch.ethz.ch"}
                </a>
              </p>
              <p className="text-smm">
                {translations?.curator2 ||
                  "Prof. Laurent Stalder, Chair of the Theory of Architecture, Institute for the History and Theory of Architecture (gta), ETH Zurich"}
                <a
                  href={translations?.curator2Links?.[0] ||
                    "https://www.stalder.arch.ethz.ch"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations?.curator2Links?.[0] ||
                    "https://www.stalder.arch.ethz.ch"}
                </a>
              </p>
            </div>

            {/* Curators’ Project Leaders */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.CuratorsProjectLeaders ||
                  "Curators’ Project Leaders"}
              </h3>
              <p className="text-smm">
                {translations?.curatorsProjectLeadersDescription ||
                  "Christoph Danuser, Architect at Atelier Danuser & Teaching and Research Assistant at Chair of Architectural Behaviorology, IEA, ETH Zurich; Tazuru Harada, Architect and Research Assistant at Chair of Architectural Behaviorology, IEA, ETH Zurich"}
              </p>
            </div>

            {/* Curatorial Research Collaborators */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.CuratorialResearchCollaborators ||
                  "Curatorial Research Collaborators"}
              </h3>
              <p className="text-smm">
                {translations?.curatorialResearchDescription ||
                  "Davide Spina, Postdoctoral Researcher at Chair of the Theory of Architecture, gta, ETH Zurich; Federico Bertagna, Postdoctoral Researcher and Lecturer at Chair of the Structural Design, ITA, ETH Zurich"}
              </p>
            </div>

            {/* Drafting / Drawings Collaborators */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.CuratorialDrawingsCollaborators ||
                  "Curatorial Drawings Collaborators"}
              </h3>
              <p className="text-smm">
                {translations?.curatorialDrawingsDescription ||
                  "Christoph Danuser, Architect at Atelier Danuser & Teaching and Research Assistant at Chair of Architectural Behaviorology, IEA, ETH Zurich; Jan Aebi, Dimitri Bleichenbacher, Matthias Bisig and Miriam Gabour, Student Assistants, ETH Zurich"}
              </p>
            </div>

            {/* Copy‑editor */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.CopyEditor || "Copy‑editor"}
              </h3>
              <p className="text-smm">
                {translations?.copyEditorDescription ||
                  "Thomas Skelton‑Robinson"}
              </p>
            </div>

            {/* Web Designer */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.Webdesign || "Web designer"}
              </h3>
              <p className="text-smm">
                {translations?.webdesignDescription ||
                  "Subham Jain, XR Vizion"}
                <a
                  href={translations?.webdesignLinks?.[0] ||
                    "https://www.xrvizion.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 ml-1"
                >
                  {translations?.webdesignLinks?.[0] ||
                    "https://www.xrvizion.com"}
                </a>
              </p>
            </div>

            {/* Advisors */}
            <div>
              <h3 className="text-smm font-semibold">
                {translations?.Advisors || "Advisors"}
              </h3>
              <p className="text-smm">
                {translations?.advisorsDescription ||
                  "Hitoshi Abe, Professor at UCLA, Architecture & Urban Design and Director of UCLA Terasaki Chair for Contemporary Japanese Studies; Shohei Shigematsu, Partner at OMA North America; Toyo Ito, Toyo Ito & Associates; Moises Gonzalez, Architect"}
                <span className="ml-1">
                  <a
                    href={translations?.advisorsLinks?.[0] ||
                      "https://www.oma.com/news/oma-new-york-office"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    {translations?.advisorsLinks?.[0] ||
                      "https://www.oma.com/news/oma-new-york-office"}
                  </a>
                  ,&nbsp;
                  <a
                    href={translations?.advisorsLinks?.[1] ||
                      "http://www.toyo-ito.co.jp"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    {translations?.advisorsLinks?.[1] ||
                      "http://www.toyo-ito.co.jp"}
                  </a>
                </span>
              </p>
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
