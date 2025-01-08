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
import Credits from "./components/pages/Credits.jsx";
import Jsontest from "./components/pages/adminlogin.jsx";
import { LanguageProvider } from "./components/Features/languageContext.jsx";
import Dashhomes from './components/pages/dashhomes.jsx'
import Signup from "./components/pages/usersignup.jsx";
import UserLogin from './components/pages/userlogin.jsx'
import CreateProject from "./components/pages/createproject.jsx";
import PreviewShelter from "./components/pages/previewshelter.jsx";
import Preview from "./components/Features/preview.jsx";
export default function App() {
  return (
    <>
      <MuteProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/admin/login" element={<Jsontest/>}/>
          <Route path="/user/login" element={<UserLogin/>}/>
          
          <Route path="/user/username/createproject/preview" element={<PreviewShelter />} />

          <Route path="/user/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<Dashhomes/>}/>

          <Route path="/user/username/createproject" element={<CreateProject/>}/>


          <Route path="/preview" element={<Preview />} />

          
      
          <Route path="/haven/:id" element={<HavenOne />} />
          <Route path="/haven/:id/materials" element={<Materials />} />
          <Route path="/haven/:id/list" element={<MaterialsList />} />
        </Routes>
      </MuteProvider>
    </>
  );
}
