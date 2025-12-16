import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Participant } from '../types';

declare var confetti: any;

interface ResultsProps {
  winners: Participant[];
  allParticipants: Participant[]; 
  onReset: () => void;
  onContinue: () => void; 
  remainingCount: number;
}

interface WinnerCardProps {
  finalWinner: Participant;
  allParticipants: Participant[];
  delay: number;
  onReveal: () => void;
  index: number;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ 
  finalWinner, 
  allParticipants, 
  delay, 
  onReveal, 
  index 
}) => {
  const [currentName, setCurrentName] = useState("...");
  const [isFinal, setIsFinal] = useState(false);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    if (hasRevealedRef.current) return;

    let interval: any;
    const duration = 3000 + delay; 

    // Rapid shuffle effect
    interval = setInterval(() => {
      if (allParticipants.length > 0) {
        const random = allParticipants[Math.floor(Math.random() * allParticipants.length)];
        setCurrentName(random.name);
      }
    }, 60); 

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCurrentName(finalWinner.name);
      setIsFinal(true);
      hasRevealedRef.current = true; 
      onReveal(); 
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [finalWinner, allParticipants, delay, onReveal]);

  return (
    <div className="relative group perspective-1000">
      
      {/* 1. Background Glow (God Rays) - Only visible when final */}
      {isFinal && (
        <div className="absolute inset-[-20%] rounded-full conic-glow z-0 pointer-events-none mix-blend-screen transition-opacity duration-1000 opacity-100"></div>
      )}

      {/* 2. Main Card */}
      <div 
        className={`
          relative z-10 overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-700
          ${isFinal 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-black border-2 border-yellow-400/50 shadow-[0_0_50px_rgba(251,191,36,0.3)] scale-105' 
            : 'bg-slate-800/80 border border-white/10 scale-100 opacity-90'}
        `}
        style={{ minHeight: '180px' }}
      >
        {/* Badge Number */}
        <div className={`
          absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg
          ${isFinal ? 'bg-yellow-400 text-black animate-bounce' : 'bg-slate-700 text-slate-400'}
        `}>
          #{index + 1}
        </div>

        {/* Shine Overlay on finish */}
        {isFinal && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
        )}

        <div className="relative z-10 w-full">
          {isFinal && <div className="text-4xl mb-2 animate-bounce-in">👑</div>}
          
          <h3 className={`font-black tracking-tight leading-tight mb-2 transition-all duration-300 ${
            isFinal 
              ? 'text-3xl text-shine drop-shadow-sm scale-110' 
              : 'text-xl text-gray-400 blur-[1px]'
          }`}>
            {currentName}
          </h3>

          {isFinal && (
            <div className="animate-bounce-in flex flex-col items-center mt-3">
               {finalWinner.dni && (
                 <span className="inline-block bg-slate-900/80 text-yellow-100 px-3 py-1 rounded-full text-xs font-mono border border-yellow-500/30">
                   ID: {finalWinner.dni}
                 </span>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Results: React.FC<ResultsProps> = ({ winners, allParticipants, onReset, onContinue }) => {
  const [revealedCount, setRevealedCount] = useState(0);

  // --- Confetti Logic ---

  // Simple popper for individual reveals
  const fireSmallPopper = (ratio: number) => {
    if (typeof confetti !== 'undefined') {
       confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FCD34D', '#F472B6', '#22D3EE'],
        disableForReducedMotion: true,
        zIndex: 100
       });
    }
  };

  // Fireworks Effect (Efficient Loop)
  const fireFireworks = () => {
     if (typeof confetti !== 'undefined') {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const random = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          // Two bursts from different random positions to simulate fireworks
          confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
     }
  }

  const handleSingleReveal = useCallback(() => {
    setRevealedCount(prev => {
      const newCount = prev + 1;
      
      fireSmallPopper(1);

      if (newCount === winners.length) {
        setTimeout(fireFireworks, 300);
      }
      return newCount;
    });
  }, [winners.length]); 

  const gridClass = winners.length === 1 
    ? 'max-w-md mx-auto' 
    : winners.length <= 4 
      ? 'grid-cols-1 md:grid-cols-2' 
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  const allRevealed = revealedCount === winners.length;

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 min-h-[60vh]">
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className={`text-5xl font-black mb-2 transition-all duration-500 ${allRevealed ? 'scale-110 text-shine' : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500'}`}>
          {allRevealed ? "🎉 ¡TENEMOS GANADORES! 🎉" : "SORTEANDO..."}
        </h2>
        {!allRevealed && <p className="text-indigo-200 text-lg animate-pulse">La suerte está echada...</p>}
      </div>

      <div className={`w-full grid gap-8 ${gridClass} px-4`}>
        {winners.map((winner, index) => (
          <WinnerCard 
            key={winner.id}
            index={index}
            finalWinner={winner}
            allParticipants={allParticipants}
            delay={index * 1200} // Slightly faster sequence
            onReveal={handleSingleReveal}
          />
        ))}
      </div>
      
      {/* Actions Footer - Appears with a nice pop */}
      {allRevealed && (
         <div className="mt-16 animate-bounce-in z-20 flex flex-col md:flex-row gap-4 items-center">
            
            {/* Continue Drawing Button */}
            <button 
              onClick={onContinue}
              className="group relative px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transform hover:-translate-y-1 transition-all overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center gap-3 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Sortear Restantes</span>
              </div>
            </button>

             {/* New Draw Button (Secondary) */}
            <button 
              onClick={onReset}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all flex items-center gap-2 border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Nueva Lista
            </button>
         </div>
      )}
    </div>
  );
};