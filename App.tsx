import React, { useState } from 'react';
import { Header } from './components/Header';
import { ParticipantInput } from './components/ParticipantInput';
import { ParticipantVerification } from './components/ParticipantVerification';
import { Results } from './components/Results';
import { AppStep, Participant } from './types';
import { parseParticipantsLocal } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Parse Data using Local Parser (Instant)
  const handleParse = (rawText: string) => {
    setIsParsing(true);
    // Add small artificial delay just for UX (so user sees "processing")
    setTimeout(() => {
      try {
        const parsed = parseParticipantsLocal(rawText);
        if (parsed.length > 0) {
          setParticipants(parsed);
          setStep(AppStep.VERIFICATION);
        } else {
          alert("No se encontraron participantes válidos. Asegúrate de usar un participante por línea.");
        }
      } catch (error) {
        console.error(error);
        alert("Hubo un error al procesar la lista.");
      } finally {
        setIsParsing(false);
      }
    }, 600);
  };

  /**
   * Selects winners ensuring one person cannot win twice in the same draw.
   */
  const selectWinners = (count: number) => {
    const shuffled = [...participants];
    
    // Fisher-Yates Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const uniqueWinners: Participant[] = [];
    const seenKeys = new Set<string>();

    for (const p of shuffled) {
      // Normalize key
      const key = p.dni && p.dni !== 'S/D' 
        ? p.dni.trim().toLowerCase().replace(/\./g, '') 
        : p.name.trim().toLowerCase();

      if (!seenKeys.has(key)) {
        uniqueWinners.push(p);
        seenKeys.add(key);
      }

      if (uniqueWinners.length >= count) {
        break;
      }
    }

    setWinners(uniqueWinners);
    setStep(AppStep.RESULTS);
  };

  // Logic to continue drawing excluding ONLY the winners
  const handleContinueDrawing = () => {
    // 1. Identify winners to remove
    const winnerKeys = new Set(winners.map(w => 
       w.dni && w.dni !== 'S/D' ? w.dni.replace(/\./g, '') : w.name.trim().toLowerCase()
    ));

    // 2. Filter remaining participants
    // We remove ALL instances of the winner (even if they had duplicate chances)
    const remaining = participants.filter(p => {
        const key = p.dni && p.dni !== 'S/D' ? p.dni.replace(/\./g, '') : p.name.trim().toLowerCase();
        return !winnerKeys.has(key);
    });

    if (remaining.length === 0) {
      alert("¡Ya no quedan participantes para sortear!");
      return;
    }

    setParticipants(remaining);
    setWinners([]); // Clear current winners
    setStep(AppStep.VERIFICATION); // Go back to verify/config screen
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setParticipants([]);
    setWinners([]);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />
      
      <main className="w-full">
        {step === AppStep.INPUT && (
          <div className="px-4">
             <ParticipantInput onParse={handleParse} isParsing={isParsing} />
          </div>
        )}

        {step === AppStep.VERIFICATION && (
          <div className="px-4">
            <ParticipantVerification 
              participants={participants} 
              onConfirm={selectWinners}
              onReset={handleReset}
            />
          </div>
        )}

        {step === AppStep.RESULTS && (
          <Results 
            winners={winners} 
            allParticipants={participants}
            onReset={handleReset}
            onContinue={handleContinueDrawing}
            remainingCount={participants.length - winners.length} /* Approx for display logic if needed */
          />
        )}
      </main>
      
      <footer className="text-center text-slate-500 text-sm mt-12 mb-6 opacity-60">
        <p>© {new Date().getFullYear()} SorteoGenius.</p>
      </footer>
    </div>
  );
};

export default App;