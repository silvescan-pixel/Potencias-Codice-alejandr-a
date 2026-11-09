import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { ShieldAlert, Zap, ArrowRight, Award, AlertTriangle, Flame, RefreshCw } from 'lucide-react';

interface Mission5Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Mission5Constants: React.FC<Mission5Props> = ({ onComplete }) => {
  // Procedural dynamic generation of equations and negative exponents each run
  const {
    eq1, eq2, eq3,
    neg1, neg2, neg3
  } = useMemo(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Eq 1: (b^x)^k = 1 -> x = 0
    const b1 = pick([3, 5, 6, 7, 9]);
    const k1 = pick([4, 6, 7, 8, 9]);

    // Eq 2: (-b2)^x · (-b2)^m = b2^p -> x = p - m
    const b2 = pick([2, 3]);
    const m2 = randInt(3, 5);
    const x2 = randInt(2, 4);
    const p2 = m2 + x2;

    // Eq 3: (-b3)^x : b3^m = (-b3)^p -> x = m + p
    const b3 = pick([3, 4, 5, 6]);
    const m3 = randInt(2, 3);
    const p3 = randInt(2, 3);
    const x3 = m3 + p3;

    // Neg 1: b4^-1 -> 1/b4
    const b4 = pick([4, 5, 6, 7, 8]);

    // Neg 2: (-b5)^-3 -> -1 / b5^3
    const b5 = pick([2, 3, 4]);
    const b5Cubed = Math.pow(b5, 3);

    // Neg 3: 1 / (b6^-n) = b6^n
    const neg3Pairs = [
      { b: 3, n: 4, val: 81 },
      { b: 2, n: 5, val: 32 },
      { b: 2, n: 4, val: 16 },
      { b: 5, n: 2, val: 25 },
      { b: 4, n: 3, val: 64 },
    ];
    const n3 = pick(neg3Pairs);

    return {
      eq1: { b: b1, k: k1, correctX: '0' },
      eq2: { b: b2, m: m2, p: p2, correctX: x2.toString() },
      eq3: { b: b3, m: m3, p: p3, correctX: x3.toString() },
      neg1: { b: b4, correctChoice: `1/${b4}` },
      neg2: { b: b5, correctChoice: `-1/${b5Cubed}`, bCubed: b5Cubed },
      neg3: { b: n3.b, n: n3.n, correctVal: n3.val.toString() }
    };
  }, []);

  // Equation x answers
  const [eq1X, setEq1X] = useState('');
  const [eq2X, setEq2X] = useState('');
  const [eq3X, setEq3X] = useState('');

  // Negative Exponents answers
  const [neg1Choice, setNeg1Choice] = useState('');
  const [neg2Choice, setNeg2Choice] = useState('');
  const [neg3Val, setNeg3Val] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleValidate = () => {
    sound.playClick();
    let correct = 0;
    const total = 6;

    if (eq1X.trim() === eq1.correctX) correct++;
    if (eq2X.trim() === eq2.correctX) correct++;
    if (eq3X.trim() === eq3.correctX) correct++;

    if (neg1Choice === neg1.correctChoice) correct++;
    if (neg2Choice === neg2.correctChoice) correct++;
    if (neg3Val.trim() === neg3.correctVal) correct++;

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 750);

    setSubmitted(true);

    if (percentage >= 70) {
      sound.playVictory();
      setFeedback(`¡NÚCLEO ESTABILIZADO! Has restaurado las constantes perdidas con ${percentage}% de acierto (+${xp} XP). Insignia "Salvador/a de la Memoria" desbloqueada.`);
    } else {
      sound.playError();
      setFeedback(`Alerta crítica: ${percentage}% de acierto. Recuerda: a⁻ⁿ = 1 / aⁿ, y para que una potencia dé 1 el exponente final debe ser 0.`);
    }
  };

  const handleProceed = () => {
    let correct = 0;
    const total = 6;
    if (eq1X.trim() === eq1.correctX) correct++;
    if (eq2X.trim() === eq2.correctX) correct++;
    if (eq3X.trim() === eq3.correctX) correct++;
    if (neg1Choice === neg1.correctChoice) correct++;
    if (neg2Choice === neg2.correctChoice) correct++;
    if (neg3Val.trim() === neg3.correctVal) correct++;

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 750);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EF4444]/40">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Misión 5: La Gran Consola de las Constantes Perdidas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ecuaciones de Potencias e Inversos Negativos · Ficha Pág. 3
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aleatorio</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 font-bold animate-pulse">
            CLÍMAX DE ABSORCIÓN
          </span>
        </div>
      </div>

      <div className="bg-[#1C150F]/95 border-2 border-[#EF4444]/60 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EF4444]/30">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#EF4444] animate-pulse" />
            <h3 className="font-semibold text-white text-base">
              Consola de Emergencia: Ecuaciones con Incógnita x y Exponentes Negativos
            </h3>
          </div>
          <span className="text-xs text-[#EF4444] font-mono-math">Sobrecarga de Servidor</span>
        </div>

        {/* Section 1: Ecuaciones con potencias (Ficha Ej. 9) */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
            Parte 1: Descifra el valor de la incógnita x (Ficha Ej. 9)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Eq 1: (b^x)^k = 1 */}
            <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
              <div className="text-xs text-slate-400 mb-1">Ecuación Alfa:</div>
              <div className="font-mono-math text-base font-bold text-white mb-2">
                ( {eq1.b}<sup className="text-[#00E5FF]">x</sup> )^{eq1.k} = 1
              </div>
              <div className="text-[11px] text-slate-400 mb-2">
                Como cualquier número elevado a 0 es 1, {eq1.k}·x debe ser 0:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">x =</span>
                <input
                  type="text"
                  value={eq1X}
                  onChange={(e) => setEq1X(e.target.value)}
                  placeholder="0"
                  disabled={submitted}
                  className="w-16 bg-[#1C150F] border border-[#D4AF37]/50 rounded px-2 py-1 text-center font-mono-math text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2 text-slate-300">
                  Respuesta correcta: <span className="text-[#00FF88] font-bold">x = {eq1.correctX}</span>
                </div>
              )}
            </div>

            {/* Eq 2: (-b)^x · (-b)^m = b^p */}
            <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
              <div className="text-xs text-slate-400 mb-1">Ecuación Beta:</div>
              <div className="font-mono-math text-base font-bold text-white mb-2">
                (-{eq2.b})<sup className="text-[#00E5FF]">x</sup> · (-{eq2.b})^{eq2.m} = {eq2.b}^{eq2.p}
              </div>
              <div className="text-[11px] text-slate-400 mb-2">
                Sumando exponentes x + {eq2.m} = {eq2.p}:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">x =</span>
                <input
                  type="text"
                  value={eq2X}
                  onChange={(e) => setEq2X(e.target.value)}
                  placeholder="?"
                  disabled={submitted}
                  className="w-16 bg-[#1C150F] border border-[#D4AF37]/50 rounded px-2 py-1 text-center font-mono-math text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2 text-slate-300">
                  Respuesta correcta: <span className="text-[#00FF88] font-bold">x = {eq2.correctX}</span>
                </div>
              )}
            </div>

            {/* Eq 3: (-b)^x : b^m = (-b)^p */}
            <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
              <div className="text-xs text-slate-400 mb-1">Ecuación Gamma:</div>
              <div className="font-mono-math text-base font-bold text-white mb-2">
                (-{eq3.b})<sup className="text-[#00E5FF]">x</sup> : {eq3.b}^{eq3.m} = (-{eq3.b})^{eq3.p}
              </div>
              <div className="text-[11px] text-slate-400 mb-2">
                Restando exponentes x - {eq3.m} = {eq3.p}:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">x =</span>
                <input
                  type="text"
                  value={eq3X}
                  onChange={(e) => setEq3X(e.target.value)}
                  placeholder="?"
                  disabled={submitted}
                  className="w-16 bg-[#1C150F] border border-[#D4AF37]/50 rounded px-2 py-1 text-center font-mono-math text-white text-sm focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2 text-slate-300">
                  Respuesta correcta: <span className="text-[#00FF88] font-bold">x = {eq3.correctX}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Exponentes Negativos (Ficha Ej. 12) */}
        <div>
          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
            Parte 2: Desafío de Exponentes Negativos (a⁻ⁿ = 1 / aⁿ) (Ficha Ej. 12)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Neg 1: b^-1 */}
            <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
              <div className="text-xs text-slate-400 mb-1">Terminal Inverso 1:</div>
              <div className="font-mono-math text-base font-bold text-white mb-2">
                {neg1.b}⁻¹
              </div>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: `1/${neg1.b}`, label: `1 / ${neg1.b}` },
                  { id: `-${neg1.b}`, label: `-${neg1.b}` },
                  { id: '1', label: '1' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#251C14] cursor-pointer">
                    <input
                      type="radio"
                      name="neg1"
                      value={opt.id}
                      checked={neg1Choice === opt.id}
                      onChange={(e) => setNeg1Choice(e.target.value)}
                      disabled={submitted}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-slate-300 font-mono-math">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Neg 2: (-b)^-3 */}
            <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
              <div className="text-xs text-slate-400 mb-1">Terminal Inverso 2:</div>
              <div className="font-mono-math text-base font-bold text-white mb-2">
                (-{neg2.b})⁻³
              </div>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: `-1/${neg2.bCubed}`, label: `-1 / ${neg2.bCubed} (porque (-${neg2.b})³ = -${neg2.bCubed})` },
                  { id: `1/${neg2.bCubed}`, label: `+1 / ${neg2.bCubed}` },
                  { id: `+${neg2.b * 3}`, label: `+${neg2.b * 3}` },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#251C14] cursor-pointer">
                    <input
                      type="radio"
                      name="neg2"
                      value={opt.id}
                      checked={neg2Choice === opt.id}
                      onChange={(e) => setNeg2Choice(e.target.value)}
                      disabled={submitted}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-slate-300 font-mono-math">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Neg 3: 1 / (b^-n) */}
            <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
              <div className="text-xs text-slate-400 mb-1">Terminal Inverso 3:</div>
              <div className="font-mono-math text-base font-bold text-white mb-2">
                1 / ({neg3.b}⁻^{neg3.n}) = {neg3.b}^{neg3.n}
              </div>
              <div className="text-[11px] text-slate-400 mb-2">
                El inverso del denominador sube como {neg3.b}^{neg3.n}. Calcula el número:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">Valor =</span>
                <input
                  type="text"
                  value={neg3Val}
                  onChange={(e) => setNeg3Val(e.target.value)}
                  placeholder="Número"
                  disabled={submitted}
                  className="w-20 bg-[#1C150F] border border-[#D4AF37]/50 rounded px-2 py-1 text-center font-mono-math text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2 text-slate-300">
                  Respuesta: <span className="text-[#00FF88] font-bold">{neg3.correctVal}</span> ({neg3.b}^{neg3.n} = {neg3.correctVal})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
          submitted && feedback.includes('ESTABILIZADO')
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && feedback.includes('ESTABILIZADO') ? (
            <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#EF4444]" />
          )}
          <div>{feedback}</div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!submitted ? (
          <button
            onClick={handleValidate}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:from-[#F87171] hover:to-[#EF4444] text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-[#EF4444]/30 active:scale-95 animate-pulse"
          >
            <span>RESTAURAR CONSTANTES Y SALVAR A ALEX-A</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-xl shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Descubrir el Desenlace Final</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
