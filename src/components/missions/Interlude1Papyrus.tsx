import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { PowerInput } from '../PowerInput';
import { FormatMath, MathPower } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
import { Scroll, Zap, ArrowRight, Award, AlertCircle, RefreshCw } from 'lucide-react';

interface Interlude1Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Interlude1Papyrus: React.FC<Interlude1Props> = ({ onComplete }) => {
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

  const [userBase, setUserBase] = useState('');
  const [userExp, setUserExp] = useState('');
  const [userNumValue, setUserNumValue] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const clean = (s: string) => s.trim().replace(/\s/g, '');

  const isPowerMatch = clean(userBase) === '2' && clean(userExp) === targetExp.toString();
  const isNumMatch = clean(userNumValue) === targetValue.toString();

  const missingCount =
    (clean(userBase) === '' || clean(userExp) === '' ? 1 : 0) +
    (clean(userNumValue) === '' ? 1 : 0);

  const commitValidation = () => {
    setShowConfirm(false);
    setSubmitted(true);

    if (isPowerMatch && isNumMatch) {
      sound.playSuccess();
      setFeedback(`¡Caudal del acueducto calculado con precisión! Empezar con 2^${initialExpK} paquetes y duplicar durante ${minutesM} minutos equivale a 2^${initialExpK} · 2^${minutesM} = 2^${targetExp} = ${targetValue} paquetes (+150 XP).`);
    } else {
      sound.playError();
      setFeedback(`Cálculo incompleto o erróneo. Cada minuto se multiplica por 2, así que en ${minutesM} minutos multiplicamos por 2^${minutesM}. Luego aplicamos el producto de potencias de igual base: 2^${initialExpK} · 2^${minutesM} = 2^(${initialExpK}+${minutesM}) = 2^${targetExp} = ${targetValue}.`);
    }
  };

  const handleValidateClick = () => {
    sound.playClick();
    if (missingCount > 0) {
      setShowConfirm(true);
      return;
    }
    commitValidation();
  };

  const handleProceed = () => {
    const correct = (isPowerMatch ? 1 : 0) + (isNumMatch ? 1 : 0);
    const total = 2;
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 150);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Cámara 3: El Acueducto Exponencial
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Modelización de duplicación minuto a minuto con potencias de base 2
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Datos Dinámicos</span>
        </span>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/50 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4AF37]/30">
          <Scroll className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-semibold text-white text-base">
            Propagación de Datos en el Papiro de Alejandría
          </h3>
        </div>

        {/* Clear scenario with zero formula spoilers */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#120E0A] border border-[#D4AF37]/30 text-sm text-slate-200 leading-relaxed mb-6 space-y-3">
          <p>
            En el instante inicial (minuto 0), el depósito principal del acueducto contiene{' '}
            <strong className="text-[#00E5FF] text-base">
              <MathPower base="2" exp={initialExpK} />
            </strong>{' '}
            paquetes de datos.
          </p>
          <p>
            El papiro transmite información por duplicación: <strong className="text-[#D4AF37]">cada minuto que pasa, la cantidad total de paquetes se multiplica por 2</strong> (al minuto 1 habrá el doble, al minuto 2 el doble del anterior, y así sucesivamente).
          </p>
          <div className="p-3 rounded-lg bg-[#1C150F] border border-[#D4AF37]/25 text-white font-medium">
            Tras exactamente <strong className="text-[#D4AF37] font-mono-math">{minutesM} minutos</strong> de transmisión continua, ¿cuántos paquetes habrá en total?
          </div>
        </div>

        {/* Inputs: Two-box power input + numeric value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          
          <div className={`bg-[#120E0A] p-4 rounded-xl border ${
            submitted
              ? isPowerMatch ? 'border-[#00FF88]/60 bg-[#00FF88]/5' : 'border-[#EF4444]/60 bg-[#EF4444]/5'
              : 'border-[#D4AF37]/30'
          }`}>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              1. Expresa el total como una única potencia:
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Introduce la base y el exponente resultante.
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs text-slate-300 font-semibold">Total =</span>
              <PowerInput
                baseValue={userBase}
                expValue={userExp}
                onBaseChange={(v) => { setUserBase(v); setShowConfirm(false); }}
                onExpChange={(v) => { setUserExp(v); setShowConfirm(false); }}
                disabled={submitted}
                showLabels={true}
                status={submitted ? (isPowerMatch ? 'correct' : 'wrong') : 'default'}
              />
            </div>
            {submitted && (
              <div className="text-xs mt-3 pt-2 border-t border-[#D4AF37]/20 text-center text-slate-300">
                Correcto: <strong className="text-[#00FF88]"><MathPower base="2" exp={targetExp} /></strong>
              </div>
            )}
          </div>

          <div className={`bg-[#120E0A] p-4 rounded-xl border ${
            submitted
              ? isNumMatch ? 'border-[#00FF88]/60 bg-[#00FF88]/5' : 'border-[#EF4444]/60 bg-[#EF4444]/5'
              : 'border-[#D4AF37]/30'
          }`}>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              2. Calcula la cantidad exacta de paquetes:
            </label>
            <p className="text-[11px] text-slate-400 mb-4">
              Escribe el número entero final sin puntos ni espacios.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-300 font-semibold">Paquetes =</span>
              <input
                type="number"
                value={userNumValue}
                onChange={(e) => { setUserNumValue(e.target.value); setShowConfirm(false); }}
                placeholder="Total numérico"
                disabled={submitted}
                className={`w-36 border-2 rounded-lg px-3 py-2 text-center font-mono-math text-sm font-bold focus:outline-none ${
                  submitted
                    ? isNumMatch ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                    : 'bg-[#1C150F] border-[#D4AF37]/50 text-[#00E5FF] focus:border-[#D4AF37]'
                }`}
              />
            </div>
            {submitted && (
              <div className="text-xs mt-4 pt-2 border-t border-[#D4AF37]/20 text-center text-slate-300">
                Correcto: <strong className="text-[#00FF88] font-mono-math">{targetValue} paquetes</strong>
              </div>
            )}
          </div>
        </div>

        {showConfirm && !submitted && (
          <ConfirmSubmitBanner
            missingCount={missingCount}
            onCancel={() => setShowConfirm(false)}
            onConfirm={commitValidation}
          />
        )}

        {feedback && (
          <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
            submitted && isPowerMatch && isNumMatch
              ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
              : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
          }`}>
            {submitted && isPowerMatch && isNumMatch ? (
              <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-[#EF4444]" />
            )}
            <div className="leading-relaxed">
              <FormatMath expr={feedback} className="font-sans" />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          {!submitted ? (
            <button
              onClick={handleValidateClick}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              <span>Transmitir al Archivo (Definitivo)</span>
              <Zap className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleProceed}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
            >
              <span>Avanzar a la Cámara de Polaridad</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
