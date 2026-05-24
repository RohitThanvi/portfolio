import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Research from './pages/Research';
import Contact from './pages/Contact';
import './styles/globals.css';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/research" element={<Research />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <div className="app">
          <div className="noise-overlay" />
          <div className="grid-bg" />
          <Cursor />
          <Navbar />
          <main className="main-content">
            <AnimatedRoutes />
          </main>
          <LoginModal />
          <AdminPanel />
        </div>
      </BrowserRouter>
    </AdminProvider>
  );
}
