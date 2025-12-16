import React, { useState } from 'react';
import { Participant } from '../types';

interface ParticipantVerificationProps {
  participants: Participant[];
  onConfirm: (winnersCount: number) => void;
  onReset: () => void;
}

export const ParticipantVerification: React.FC<ParticipantVerificationProps> = ({ participants, onConfirm, onReset }) => {
  const [winnersCount, setWinnersCount] = useState<number>(1);

  // Determine max winners (ensure we don't try to select more unique people than exist)
  const maxWinners = Math.min(participants.length, 50);

  const presets = [1, 3, 5, 10];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      {/* Configuration Header */}
      <div className="glass rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
           
           {/* Info Section */}
           <div className="text-center lg:text-left flex-1">
             <h2 className="text-2xl font-bold text-white mb-2">Configuración del Sorteo</h2>
             <p className="text-indigo-200 text-sm mb-2">
               Participantes cargados: <span className="font-bold text-cyan-400 text-lg">{participants.length}</span>
             </p>
           </div>

           {/* Controls Section */}
           <div className="flex flex-col items-center w-full lg:w-auto gap-4">
              
              {/* Main Selector */}
              <div className="flex flex-col items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5 w-full">
                <label className="text-indigo-300 font-semibold text-sm uppercase tracking-wide">
                  Ganadores a elegir
                </label>
                
                <div className="flex items-center gap-6">
                   <button 
                    onClick={() => setWinnersCount(Math.max(1, winnersCount - 1))}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition"
                   >-</button>
                   
                   <div className="w-20 h-14 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-indigo-500/30 text-3xl font-bold text-white shadow-inner font-mono">
                     {winnersCount}
                   </div>

                   <button 
                    onClick={() => setWinnersCount(Math.min(maxWinners, winnersCount + 1))}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition"
                   >+</button>
                </div>
                
                {/* Range Slider */}
                <input 
                  type="range" 
                  min="1" 
                  max={maxWinners} 
                  value={winnersCount} 
                  onChange={(e) => setWinnersCount(parseInt(e.target.value))}
                  className="w-full max-w-xs h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />

                {/* Quick Presets */}
                <div className="flex gap-2 mt-1">
                  {presets.map(val => (
                    val <= maxWinners && (
                      <button
                        key={val}
                        onClick={() => setWinnersCount(val)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${winnersCount === val ? 'bg-pink-500 border-pink-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {val}
                      </button>
                    )
                  ))}
                </div>
              </div>
           </div>

           {/* Action Button */}
           <button
            onClick={() => onConfirm(winnersCount)}
            className="w-full lg:w-auto px-10 py-6 bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white text-xl font-extrabold rounded-2xl shadow-xl shadow-pink-500/20 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 border border-white/10 group"
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 group-hover:rotate-12 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
            </div>
            <div className="text-left leading-tight">
              <span className="block text-xs font-medium opacity-80 uppercase tracking-widest">Iniciar Sorteo</span>
              <span>¡TIRAR AHORA!</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid of Participants */}
      <div className="flex justify-between items-end mb-4 px-2">
        <h3 className="text-white font-semibold text-lg opacity-80">Vista Previa de Participantes</h3>
        <button onClick={onReset} className="text-xs text-red-400 hover:text-red-300 font-medium hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Cancelar y volver
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {participants.map((p, idx) => (
          <div key={`${p.id}-${idx}`} className="bg-slate-800/50 hover:bg-slate-700/80 border border-white/5 p-3 rounded-xl transition-colors flex flex-col group relative overflow-hidden">
             {/* Simple visual indicator for potential duplicates if needed, relying on data */}
            <span className="font-bold text-gray-200 truncate group-hover:text-cyan-300 transition-colors relative z-10">{p.name}</span>
            {p.dni && <span className="text-xs text-gray-500 font-mono mt-1 relative z-10">{p.dni}</span>}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        ))}
      </div>
    </div>
  );
};