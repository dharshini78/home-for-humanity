import Navbar from "../Features/navbar.jsx";

const Credits = () => {
  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8 mini flex flex-col items-start justify-start min-h-screen">
        <h1 className="ff-xl font-bold mb-6 text-left">Credits</h1>

        <section className="mb-8 w-full max-w-3xl">
          <h2 className="ff-xl font-bold mb-4 text-left">TEAM</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Founders</h3>
              <p>Miki Higasa, Julie Gilhart, Tomoko Ogura and Kikka Hanazawa, Fashion Girls for Humanity, <a href="https://www.fashiongirlsforhumanity.org/" className="text-blue-500">https://www.fashiongirlsforhumanity.org/</a></p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Project Leader</h3>
              <p>Kai Dal Bello, Home for Humanity Project, Fashion Girls for Humanity</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Curators</h3>
              <p>Prof. Momoyo Kaijima, Chair of Architectural Behaviorology, Institute for Architectural Design (iea), ETH Zurich, <a href="http://www.kaijima.arch.ethz.ch" className="text-blue-500">www.kaijima.arch.ethz.ch</a></p>
              <p>Prof. Laurent Stalder, Chair of the Theory of Architecture, Institute for the History and Theory of Architecture (gta), ETH Zurich, <a href="http://www.stalder.arch.ethz.ch" className="text-blue-500">www.stalder.arch.ethz.ch</a></p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Collaborators</h3>
              <p>Christoph Danuser, Architect at Atelier Danuser & Teaching and Research Assistant, ETH Zurich, Davide Spina, Postdoctoral Researcher, ETH Zurich, Federico Bertagna, Postdoctoral Researcher and Lecturer, ETH Zurich</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Drawings by</h3>
              <p>Christoph Danuser, ETH Zurich, Jan Aebi, Student Assistant, ETH Zurich, Dimitri Bleichenbacher, Student Assistant, ETH Zurich, Matthias Bisig, Student Assistant, ETH Zurich, Miriam Gabour, Student Assistant, ETH Zurich</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Webdesign</h3>
              <p>Subham Jain, XR Vizion, <a href="http://www.xrvizion.com" className="text-blue-500">www.xrvizion.com</a></p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Advisors</h3>
              <p>Hitoshi Abe, UCLA Professor, Architecture & Urban Design and Director of UCLA Terasaki Chair for Contemporary Japanese Studies, Shohei Shigematsu, Partner at OMA North America, <a href="https://www.oma.com/news/oma-new-york-office" className="text-blue-500">https://www.oma.com/news/oma-new-york-office</a>, Toyo Ito, Toyo Ito & Associates, <a href="http://www.toyo-ito.co.jp" className="text-blue-500">http://www.toyo-ito.co.jp</a>, Moises Gonzalez, Architect</p>
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
