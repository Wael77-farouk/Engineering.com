import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Upload from "./pages/Upload";
import Search from "./components/Search";
import Profile from "./pages/Profile";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/projects/" element={<Projects/>} />     
        <Route path="/about/" element={<About/>} />     
        <Route path="/contact/" element={<Contact/>} />     
        <Route path="/upload/" element={<Upload/>} />     
        <Route path="/search/" element={<Search/>} />     
        <Route path="/profile/" element={<Profile/>} />     
        </Routes>
       <ToastContainer />

        <Footer />
    </>
  );
}

export default App;
