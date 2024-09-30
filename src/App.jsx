import Home from "./components/pages/Home.jsx";
import About from "./components/pages/About.jsx";
import Faqs from "./components/pages/FAQs.jsx";
import Navbar from "./components/Features/navbar.jsx";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import HavenOne from "./components/PTS/HavenOne.jsx";
import Materials from "./components/PTS/instructions.jsx";
import MaterialsList from "./components/PTS/MaterialsList.jsx";
import { MuteProvider } from "./components/Features/muteContext.jsx";

export default function App() {
  return (
    <>
      <MuteProvider>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/haven/:id" element={<HavenOne />} />
          <Route path="/haven/:id/materials" element={<Materials />} />
          <Route path="/haven/:id/list" element={<MaterialsList />} />
        </Routes>
      </MuteProvider>
    </>
  );
}
