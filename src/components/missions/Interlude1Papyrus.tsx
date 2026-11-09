import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { Scroll, Zap, ArrowRight, Award, AlertCircle, RefreshCw } from 'lucide-react';

interface Interlude1Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Interlude1Papyrus: React.FC<Interlude1Props> = ({ onComplete }) => {
  // Generate dynamic parameters on every execution
  const { initialExpK, minutesM, targetExp, targetValue } = useMemo(() => {
    const kList = [2, 3, 4];
    const mList = [3, 4, 5];
    const k = kList[Math.floor(Math.random() * kList.length)];
    const m = mList[Math.floor(Math.random() * mList.length)];
    const totalExp = k + m;
    const val = Math.pow(2, totalExp);
    return {
      initialExpK: k,
      minutesM: m,
      targetExp: totalExp,
      targetValue: val
    };
  }, []);

  const [userPower, setUserPower] = useState('');
  const [userNumValue, setUserNumValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const clean = (s: string) => s.trim().replace(/\s/g, '');

  const handleValidate = () => {
    sound.playClick();
    const correctPower = `2^${targetExp}`;
    const isPowerMatch = clean(userPower) === correctPower;
    const isNumMatch = clean(userNumValue) === targetValue.toString();

    setSubmitted(true);

    if (isPowerMatch && isNumMatch) {
      sound.playSuccess();
      setFeedback(`¡Cálculo de flujo exponencial verificado! 2^${initialExpK} · 2^${minutesM} = 2^(${initialExpK}+${minutesM}) = 2^${targetExp} = ${targetValue} paquetes de datos. (+150 XP).`);
    } else {
      sound.playError();
      setFeedback(`Error en la emisión. Aplicando la fórmula 2ⁿ con n=${minutesM} minutos: multiplicamos 2^${initialExpK} · 2^${minutesM}. Al tener la misma base, se SUMAN los exponentes (${initialExpK} + ${minutesM} = ${targetExp}), dando 2^${targetExp} = ${targetValue}.`);
    }
  };

  const handleProceed = () => {
    const correctPower = `2^${targetExp}`;
    const isPowerMatch = clean(userPower) === correctPower;
    const isNumMatch = clean(userNumValue) === targetValue.toString();
    const correct = (isPowerMatch ? 1 : 0) + (isNumMatch ? 1 : 0);
    const total = 2;
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 150);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Clean Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Interludio 1: El Cifrado del Papyrus Variable
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Modelización de Transmisión Cuántica · Parámetros Aleatorios
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Datos Dinámicos</span>
        </span>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/50 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4AF37]/30">
          <Scroll className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-semibold text-white text-base">
            Ley de Propagación del Papiro de Alejandría
          </h3>
        </div>

        {/* Narrative & Equation Definition */}
        <div className="p-4 rounded-xl bg-[#120E0A] border border-[#D4AF37]/30 text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
          <p className="mb-2">
            Las emisiones del papiro digital ancestral se rigen por la ley matemática exponencial:
          </p>
          <div className="text-center font-mono-math text-base text-[#D4AF37] font-bold py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20 mb-2">
            E(n) = 2ⁿ (donde n es el número de minutos transcurridos)
          </div>
          <p>
            Si en el instante inicial el nodo almacena <span className="font-mono-math text-[#00E5FF] font-bold">2^{initialExpK}</span> paquetes de datos, ¿cuántos paquetes habrá en total tras una emisión continuada de <span className="font-mono-math text-[#FFD700] font-bold">{minutesM} minutos</span>?
          </p>
        </div>

        {/* Math Calculation Interface */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 font-mono-math">
          
          {/* Step 1: Potencia unificada */}
          <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
            <label className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
              1. Expresa como potencia única:
            </label>
            <div className="text-xs text-slate-400 mb-2">
              Multiplica 2^{initialExpK} · 2^{minutesM}:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-sans">Potencia =</span>
              <input
                type="text"
                value={userPower}
                onChange={(e) => setUserPower(e.target.value)}
                placeholder={`Ej. 2^${targetExp}`}
                disabled={submitted}
                className="w-28 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-3 py-2 text-white text-center text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
              />
            </div>
          </div>

          {/* Step 2: Valor numérico */}
          <div className="bg-[#120E0A] p-4 rounded-xl border border-[#D4AF37]/30">
            <label className="block text-xs font-semibold text-slate-300 mb-2 font-sans">
              2. Valor numérico exacto:
            </label>
            <div className="text-xs text-slate-400 mb-2">
              Calcula el valor entero de la potencia:
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-sans">Total paquetes =</span>
              <input
                type="number"
                value={userNumValue}
                onChange={(e) => setUserNumValue(e.target.value)}
                placeholder="Número"
                disabled={submitted}
                className="w-32 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-3 py-2 text-[#00E5FF] text-center text-sm font-bold focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
            submitted && feedback.includes('verificado')
              ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
              : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
          }`}>
            {submitted && feedback.includes('verificado') ? (
              <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-[#EF4444]" />
            )}
            <div>{feedback}</div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!submitted ? (
            <button
              onClick={handleValidate}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              <span>Transmitir al Archivo</span>
              <Zap className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleProceed}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
            >
              <span>Avanzar a la Misión 2.C</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
