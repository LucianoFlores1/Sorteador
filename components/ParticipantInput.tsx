import React, { useState } from 'react';

interface ParticipantInputProps {
  onParse: (text: string) => void;
  isParsing: boolean;
}

const DEMO_DATA = `Aldana Camila 392
Adriihaniihta Alvarez - 990
Leila Elizabeth (544)
Gaby Cn
Sadako Yoshiko - Legajo 212
1. Juan Perez
2. Maria Gonzalez
Carlos Rodriguez
Ana Lopez 444
Pedro Martinez`;

export const ParticipantInput: React.FC<ParticipantInputProps> = ({ onParse, isParsing }) => {
  const [text, setText] = useState('');

  const handleDemo = () => {
    setText(DEMO_DATA);
  };

  return (
    <div className="glass rounded-3xl p-8 animate-fade-in-up max-w-4xl mx-auto border border-white/10 shadow-2xl shadow-indigo-500/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
          Cargar Participantes
        </h2>
        <button 
          onClick={handleDemo}
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 uppercase tracking-wider hover:underline transition-all"
        >
          + Cargar Ejemplo
        </button>
      </div>

      <p className="text-indigo-200 mb-6 text-sm">
        Pega tu lista aquí. <strong className="text-white">Cada línea cuenta como un participante.</strong><br/>
        <span className="opacity-70">Acepta cualquier formato (Excel, listas numeradas, texto simple).</span>
      </p>
      
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
        <textarea
          className="relative w-full h-64 p-6 bg-slate-900/80 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-mono text-sm resize-none placeholder-gray-600 outline-none"
          placeholder="Ejemplo:&#10;Juan Perez&#10;Maria Gonzalez - 123&#10;3. Pedro..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isParsing}
        ></textarea>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => onParse(text)}
          disabled={!text.trim() || isParsing}
          className={`
            relative px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0
            ${!text.trim() || isParsing 
              ? 'bg-slate-700 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-pink-500/25'}
          `}
        >
          <div className="flex items-center gap-3">
             {isParsing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span className="text-lg">Analizar Lista</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};