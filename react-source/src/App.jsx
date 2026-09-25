import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// React Bits Mock Components
const Squares = ({ className }) => {
  return (
    <div className={cn("fixed inset-0 pointer-events-none z-[-1]", className)}>
      <div className="absolute inset-0 bg-mesh opacity-30">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
    </div>
  );
};

const SplitText = ({ children, className }) => {
  const letters = typeof children === 'string' ? children.split('') : [];
  return (
    <div className={cn("inline-block", className)}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  );
};

const ShinyText = ({ children, className }) => {
  return (
    <div className={cn("inline-block relative overflow-hidden", className)}>
      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-pulse">
        {children}
      </span>
    </div>
  );
};

const Magnet = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SpotlightCard = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn("relative overflow-hidden group bg-[#111111]/80 backdrop-blur-md border border-[#333] rounded-2xl transition-all duration-300 hover:border-emerald-500/50", className)}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};

const DecryptedText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let iteration = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const interval = setInterval(() => {
      setDisplayText((prev) => 
        text.split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

// Main App Component
export default function App() {
  const [mode, setMode] = useState('modern');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/pratik0827/repos?sort=updated')
      .then(r => r.json())
      .then(data => {
        const validRepos = data.filter(r => !r.fork);
        validRepos.unshift({
          name: 'Diet Own',
          html_url: '#',
          description: 'A personalized diet tracking and meal planning application tailored specifically for my own fitness journey.',
          language: 'JavaScript',
          stargazers_count: 0
        });
        setProjects(validRepos);
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="min-h-screen text-gray-200 font-sans relative">
      <Squares className="z-[-1]" />
      
      <button 
        onClick={() => setMode(m => m === 'modern' ? 'terminal' : 'modern')}
        className="fixed bottom-6 right-6 bg-[#222] border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-full z-50 flex items-center gap-2 hover:bg-emerald-500/10 transition-colors"
      >
        <span>{mode === 'modern' ? '>_ Geek Mode' : 'UI Mode'}</span>
      </button>

      {mode === 'modern' && (
        <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-24 pb-32 grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <SpotlightCard className="col-span-1 md:col-span-4 p-8 md:p-12 text-center md:text-left flex flex-col items-center md:items-start justify-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"><SplitText>Pratik Patil</SplitText></h1>
            <h2 className="text-xl md:text-2xl mb-6 font-mono"><ShinyText>Full Stack Developer & Innovator</ShinyText></h2>
            <p className="text-gray-400 max-w-2xl mb-8 leading-relaxed">
              A Computer Science graduate building scalable backends, intuitive frontends, and intelligent desktop applications. I thrive on turning complex problems into elegant, efficient, and user-centric solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Magnet><a href="https://github.com/pratik0827" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#222] rounded-xl hover:bg-[#333] transition-colors w-full"><i className="fab fa-github"></i> GitHub</a></Magnet>
              <Magnet><a href="https://linkedin.com/in/pratik-patil-a42856409" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#222] rounded-xl hover:bg-[#333] transition-colors w-full"><i className="fab fa-linkedin"></i> LinkedIn</a></Magnet>
              <Magnet><a href="mailto:pratikpatil5846w@gmail.com" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#222] rounded-xl hover:bg-[#333] transition-colors w-full"><i className="fas fa-envelope"></i> Email</a></Magnet>
            </div>
          </SpotlightCard>

          <SpotlightCard className="col-span-1 md:col-span-2 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">Technical Arsenal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><h4 className="font-bold text-white mb-2">Languages</h4><p className="text-gray-400 text-sm">Java, Python, JS, Rust, C/C++</p></div>
              <div><h4 className="font-bold text-white mb-2">Backend</h4><p className="text-gray-400 text-sm">Node.js, .NET, Tauri, FastAPI</p></div>
              <div><h4 className="font-bold text-white mb-2">Frontend</h4><p className="text-gray-400 text-sm">React, HTML5, CSS3, Tailwind</p></div>
              <div><h4 className="font-bold text-white mb-2">Database / Tools</h4><p className="text-gray-400 text-sm">SQL, TimescaleDB, Git, Docker</p></div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="col-span-1 md:col-span-2 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">Experience</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-500/50 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#111] bg-emerald-500 text-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10"><i className="fas fa-briefcase text-xs"></i></div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[#333] bg-[#222]/50 backdrop-blur-sm shadow-xl">
                  <div className="text-emerald-400 text-xs font-mono mb-1">Jun 2026</div>
                  <h4 className="font-bold text-white">Python Developer Intern</h4>
                  <p className="text-gray-400 text-sm">Infotact Solutions</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#111] bg-emerald-500 text-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10"><i className="fas fa-briefcase text-xs"></i></div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[#333] bg-[#222]/50 backdrop-blur-sm shadow-xl">
                  <div className="text-emerald-400 text-xs font-mono mb-1">Jul 2026</div>
                  <h4 className="font-bold text-white">Software Engineering Virtual Experience</h4>
                  <p className="text-gray-400 text-sm">Walmart USA</p>
                </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="col-span-1 md:col-span-4 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">Featured Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(repo => (
                <a key={repo.name} href={repo.html_url} target="_blank" rel="noreferrer" className="block p-6 bg-[#222]/50 border border-[#333] rounded-xl hover:border-emerald-500/50 transition-colors group h-full flex flex-col">
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{repo.name}</h4>
                  <p className="text-gray-400 text-sm mb-4 flex-grow">{repo.description || 'A cool project by Pratik'}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">{repo.language || 'Code'}</span>
                    <span className="text-xs text-gray-500"><i className="fas fa-star text-yellow-500/70 mr-1"></i> {repo.stargazers_count}</span>
                  </div>
                </a>
              ))}
            </div>
          </SpotlightCard>

        </div>
      )}

      {mode === 'terminal' && (
        <div className="h-screen w-full flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[600px] bg-[#1e1e1e] rounded-xl border border-[#333] shadow-2xl flex flex-col overflow-hidden font-mono">
            <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-[#111]">
              <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-sm flex-1 text-center"><DecryptedText text="pratik-patil@portfolio:~" /></div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-64 bg-[#252526] border-r border-[#333] p-4 hidden md:block">
                <div className="text-gray-400 text-xs mb-4 uppercase tracking-wider"><DecryptedText text="Explorer" /></div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2 cursor-pointer hover:text-white"><i className="fab fa-markdown text-blue-400"></i> <DecryptedText text="readme.md" /></li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-white"><i className="fas fa-file-alt text-gray-400"></i> <DecryptedText text="about.txt" /></li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-white"><i className="fas fa-code text-yellow-400"></i> <DecryptedText text="projects.json" /></li>
                </ul>
              </div>
              <div className="flex-1 bg-[#1e1e1e] p-6 text-green-400 font-mono text-sm overflow-y-auto">
                <div className="mb-4">
                  <DecryptedText text="Welcome to PratikOS v2.0." />
                  <br/>
                  <DecryptedText text="Type 'help' to see available commands." />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-blue-400"><DecryptedText text="guest@pratik-os:~$" /></span>
                  <div className="w-2 h-4 bg-gray-400 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
