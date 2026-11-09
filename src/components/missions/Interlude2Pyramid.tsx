import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { Sparkles, Zap, ArrowRight, Award, ShieldAlert, RefreshCw } from 'lucide-react';

interface Interlude2Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Interlude2Pyramid: React.FC<Interlude2Props> = ({ onComplete }) => {
  // Random parameters each run
  const { b1, p1, q1, k1, b2, m2, n2 } = useMemo(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    return {
      b1: pick([5, 6, 7, 8, 9, 11]),
      p1: pick([3, 4, 5]),
      q1: pick([8, 12, 15, 20]),
      k1: pick([6, 7, 8, 9, 10]),
      b2: pick([3, 5, 7, 9]),
      m2: pick([11, 13, 17, 19]),
      n2: pick([8, 12, 14, 16])
    };
  }, []);

  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [q2Value, setQ2Value] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleValidate = () => {
    sound.playClick();
    const isStrategyCorrect = selectedStrategy === 'opt_zero';
    const isQ2Correct = q2Value.trim() === '1';

    setSubmitted(true);

    if (isStrategyCorrect && isQ2Correct) {
      sound.playSuccess();
      setFeedback(`¡Servidor salvado del colapso! Has optimizado la carga aplicando la propiedad a⁰ = 1. [(${b1}^${p1})^${q1}]⁰ · (-${k1})⁰ = 1 · 1 = 1. (+150 XP e Insignia "Guardián/a de la Pirámide").`);
    } else {
      sound.playError();
      setFeedback(`¡Cuidado! Calcular ${b1}^(${p1 * q1}) bloquearía el procesador. Observa el exponente exterior 0: cualquier número no nulo elevado a 0 es exactamente 1.`);
    }
  };

  const handleProceed = () => {
    const isStrategyCorrect = selectedStrategy === 'opt_zero';
    const isQ2Correct = q2Value.trim() === '1';
    const correct = (isStrategyCorrect ? 1 : 0) + (isQ2Correct ? 1 : 0);
    const total = 2;
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 150);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Interludio 2: El Enigma de la Pirámide de Datos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimización Algorítmica con la Propiedad del Exponente Cero (a⁰ = 1)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aleatorio</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            a⁰ = 1
          </span>
        </div>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/50 rounded-2xl p-6 mb-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4AF37]/30">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-semibold text-white text-base">
            Desafío de Reducción en el Vórtice Central
          </h3>
        </div>

        {/* Massive Expression */}
        <div className="bg-[#120E0A] rounded-xl p-5 border border-[#D4AF37]/30 mb-6 text-center">
          <div className="text-xs text-slate-400 mb-1">Carga Computacional Masiva:</div>
          <div className="font-mono-math text-2xl text-[#D4AF37] font-bold tracking-wider mb-2">
            [ ( {b1}^{p1} )^{q1} ]⁰ · ( -{k1} )⁰
          </div>
          <div className="text-xs text-[#00E5FF]">
            ¿Qué estrategia matemática permite resolverlo sin colapsar el sistema?
          </div>
        </div>

        {/* Decision Strategy */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              1. Selección de Estrategia de Optimización:
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'opt_zero',
                  title: 'Estrategia de Exponente Cero: a⁰ = 1',
                  desc: `Como el exponente más externo es 0, [(${b1}^${p1})^${q1}]⁰ = 1 y (-${k1})⁰ = 1. Por tanto 1 · 1 = 1.`
                },
                {
                  id: 'brute_force',
                  title: 'Fuerza Bruta Exponencial',
                  desc: `Multiplicar ${p1} · ${q1} = ${p1 * q1}, calcular ${b1}^${p1 * q1} y luego multiplicar por (-${k1})⁰.`
                },
                {
                  id: 'zero_result',
                  title: 'Absorción por Cero',
                  desc: 'Como hay ceros en los exponentes, el resultado numérico total es 0.'
                }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedStrategy === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md'
                      : 'bg-[#120E0A] border-[#D4AF37]/25 hover:bg-[#251C14]'
                  }`}
                >
                  <input
                    type="radio"
                    name="interlude2"
                    value={opt.id}
                    checked={selectedStrategy === opt.id}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    disabled={submitted}
                    className="accent-[#D4AF37] mt-1"
                  />
                  <div>
                    <div className="text-xs font-bold text-white font-mono-math">{opt.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2 from PDF (Ficha pág. 3 Ej. 10b) */}
          <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. Enigma de la Ficha (Pág. 3 Ej. 10b): ¿Cuánto vale ([{b2}^{m2}]^{n2})⁰?
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono-math">([{b2}^{m2}]^{n2})⁰ =</span>
              <input
                type="text"
                value={q2Value}
                onChange={(e) => setQ2Value(e.target.value)}
                placeholder="Valor"
                disabled={submitted}
                className="w-20 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1 text-center font-mono-math text-white text-sm focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
            submitted && feedback.includes('salvado')
              ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
              : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
          }`}>
            {submitted && feedback.includes('salvado') ? (
              <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0 text-[#EF4444]" />
            )}
            <div>{feedback}</div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!submitted ? (
            <button
              onClick={handleValidate}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              <span>Aplicar Regla a⁰ = 1</span>
              <Zap className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleProceed}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
            >
              <span>Avanzar a la Misión 4</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
