import React, { useState } from 'react';
import { StudentProgress } from '../../types/game';
import { ALEXA_PORTRAITS } from '../../data/assets';
import { generatePdfDiploma } from '../../utils/pdfCertificate';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Zap, ShieldCheck, FileText } from 'lucide-react';

interface SecretTetrationProps {
  progress: StudentProgress;
  onVictory: () => void;
}

export const SecretTetration: React.FC<SecretTetrationProps> = ({ progress, onVictory }) => {
  const challenge2 = React.useMemo(() => {
    const list = [
      { base: 3, exp: 2, powerDisplay: '3³ = 3 · 3 · 3', val: '27' },
      { base: 4, exp: 2, powerDisplay: '4⁴ = 4 · 4 · 4 · 4', val: '256' },
      { base: 2, exp: 3, powerDisplay: '2⁴ = 16', val: '16' },
      { base: 5, exp: 2, powerDisplay: '5⁵ = 3125', val: '3125' },
    ];
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  const [ans1, setAns1] = useState(''); // 2 ↑↑ 3 = 2^(2^2) = 2^4 = 16
  const [ans2, setAns2] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleValidate = () => {
    sound.playClick();
    const isAns1Correct = ans1.trim() === '16';
    const isAns2Correct = ans2.trim() === challenge2.val;

    setSubmitted(true);

    if (isAns1Correct && isAns2Correct) {
      sound.playVictory();
      try {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 }
        });
      } catch (e) {}

      setFeedback('¡CÓDICE INFINITO ACTIVADO! Has resuelto la Tetración de Alejandría. +1.000 XP y Medalla Legendaria "Héroe/Conquistador del Infinito" otorgada a tu expediente.');
      onVictory();
    } else {
      sound.playError();
      setFeedback(`Cálculo cuántico incompleto. Recuerda: en una torre de potencias se resuelve de arriba hacia abajo: 2 ↑↑ 3 = 2^(2²) = 2⁴ = 16, y ${challenge2.base} ↑↑ 2 = ${challenge2.powerDisplay} = ${challenge2.val}.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-[#1C150F] border border-[#D4AF37]/50 mb-4 shadow-xl">
          <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#D4AF37] to-[#FFF0A0] font-display mb-2">
          La Fase Secreta de Tetración: Más Allá de la Potenciación
        </h1>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Protocolo Arqueo-Matemático Oculto de Alejandría (a ↑↑ b). Operación de orden superior en la jerarquía hiperoperacional.
        </p>
      </div>

      {/* ALEX-A Special Dialogue */}
      <div className="rounded-3xl p-6 mb-6 bg-[#1C150F]/95 border-2 border-[#D4AF37]/50 flex flex-col sm:flex-row items-center gap-5 shadow-2xl">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#D4AF37] shrink-0 bg-[#120E0A]">
          <img
            src={ALEXA_PORTRAITS.enthusiastic}
            alt="ALEX-A Salvada"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-xs text-slate-200 leading-relaxed text-center sm:text-left">
          <span className="font-bold text-[#D4AF37] block text-sm mb-1">ALEX-A: "¡Bienvenidos al Reino de la Hiperoperación!"</span>
          "La suma iterada crea la multiplicación (3 + 3 + 3 = 3 · 3). La multiplicación iterada crea la potencia (3 · 3 · 3 = 3³). Pero... ¿qué crea la potenciación iterada? ¡La **Tetración** (notación de flecha de Knuth: a ↑↑ b)! Una torre vertical de potencias que se calcula **de arriba hacia abajo**."
        </div>
      </div>

      {/* Interactive Enigma Box */}
      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-6 mb-6 shadow-xl">
        <h3 className="font-semibold text-white text-sm mb-4 pb-2 border-b border-[#D4AF37]/30 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#D4AF37]" />
          <span>Los Dos Desafíos de la Tetración Alejandrina</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {/* Challenge 1: 2 ↑↑ 3 */}
          <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
            <div className="text-xs text-slate-400 mb-1">Enigma Alfa:</div>
            <div className="font-mono-math text-xl text-[#00E5FF] font-bold mb-2 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
              2 ↑↑ 3
            </div>
            <div className="text-[11px] text-slate-400 mb-3 leading-tight">
              Torre de 3 doses: 2<sup className="text-[#D4AF37]">2²</sup>. Primero se calcula 2² = 4, y luego 2⁴:
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-slate-300 font-mono-math">Resultado =</span>
              <input
                type="text"
                value={ans1}
                onChange={(e) => setAns1(e.target.value)}
                placeholder="Valor"
                disabled={submitted}
                className="w-20 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1 text-center font-mono-math text-white text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          {/* Challenge 2: Dynamic Tetration */}
          <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
            <div className="text-xs text-slate-400 mb-1">Enigma Beta:</div>
            <div className="font-mono-math text-xl text-[#D4AF37] font-bold mb-2 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
              {challenge2.base} ↑↑ {challenge2.exp}
            </div>
            <div className="text-[11px] text-slate-400 mb-3 leading-tight">
              Torre de 2 pisos: {challenge2.base}^{challenge2.base}. Calcula el valor de la potencia:
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-slate-300 font-mono-math">Resultado =</span>
              <input
                type="text"
                value={ans2}
                onChange={(e) => setAns2(e.target.value)}
                placeholder="Valor"
                disabled={submitted}
                className="w-20 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1 text-center font-mono-math text-white text-sm font-bold focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
            submitted && feedback.includes('ACTIVADO')
              ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
              : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
          }`}>
            <ShieldCheck className="w-5 h-5 shrink-0 text-[#D4AF37]" />
            <div>{feedback}</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          {!submitted ? (
            <button
              onClick={handleValidate}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              <span>Resolver Tetración (+1.000 XP)</span>
              <Zap className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                generatePdfDiploma({
                  ...progress,
                  totalXp: progress.totalXp + 1000,
                  badges: [...progress.badges, 'Héroe/Conquistador del Infinito']
                });
              }}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Descargar Diploma Supremo con Medalla de Tetración</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
