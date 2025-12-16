import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 mb-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-pink-500 to-violet-600 p-3 rounded-2xl shadow-lg shadow-pink-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              Sorteo<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">Genius</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-400 font-bold text-xs tracking-widest uppercase">Live Mode</span>
        </div>
      </div>
    </header>
  );
};