import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ChatInterface } from './pages/ChatInterface';
import { SlideGenerator } from './pages/SlideGenerator';
import { UploadAnalysis } from './pages/UploadAnalysis';
import { Quiz } from './pages/Quiz';
import { MindMap } from './pages/MindMap';
import { EssayGrader } from './pages/EssayGrader';
import { LibraryPage } from './pages/Library';
import { About } from './pages/About';
import { AppRoute } from './types';

function App() {
  // Default to dark mode for the futuristic theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>
        
        {/* Abstract Background Gradients for Futuristic feel */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow z-10 relative">
          <Routes>
            <Route path={AppRoute.HOME} element={<Home />} />
            <Route path={AppRoute.CHAT} element={<ChatInterface />} />
            <Route path={AppRoute.SLIDES} element={<SlideGenerator />} />
            <Route path={AppRoute.UPLOAD} element={<UploadAnalysis />} />
            <Route path={AppRoute.QUIZ} element={<Quiz />} />
            <Route path={AppRoute.MINDMAP} element={<MindMap />} />
            <Route path={AppRoute.ESSAY} element={<EssayGrader />} />
            <Route path={AppRoute.LIBRARY} element={<LibraryPage />} />
            <Route path={AppRoute.ABOUT} element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;