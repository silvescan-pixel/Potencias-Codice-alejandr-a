import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { FormatMath, MathFraction, MathPower } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
import { Zap, ArrowRight, Award, AlertTriangle, Flame, RefreshCw } from 'lucide-react';

interface Mission5Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Mission5Constants: React.FC<Mission5Props> = ({ onComplete }) => {
  const {
    eq1, eq2, eq3,
    neg1, neg2, neg3
  } = useMemo(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const b1 = pick([3, 5, 6, 7, 9]);
    const k1 = pick([4, 6, 7, 8, 9]);

    const b2 = pick([2, 3]);
    const m2 = randInt(3, 5);
    const x2 = randInt(2, 4);
    const p2 = m2 + x2;

    const b3 = pick([3, 4, 5, 6]);
    const m3 = randInt(2, 3);
    const p3 = randInt(2, 3);
    const x3 = m3 + p3;

    const b4 = pick([4, 5, 6, 7, 8]);

    const b5 = pick([2, 3, 4]);
    const b5Cubed = Math.pow(b5, 3);

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

  const [eq1X, setEq1X] = useState('');
  const [eq2X, setEq2X] = useState('');
  const [eq3X, setEq3X] = useState('');

  const [neg1Choice, setNeg1Choice] = useState('');
  const [neg2Choice, setNeg2Choice] = useState('');
  const [neg3Val, setNeg3Val] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const missingCount = [
    eq1X.trim(), eq2X.trim(), eq3X.trim(),
    neg1Choice, neg2Choice, neg3Val.trim()
  ].filter(v => v === '').length;

  const evaluate = () => {
    const ok1 = eq1X.trim() === eq1.correctX;
    const ok2 = eq2X.trim() === eq2.correctX;
    const ok3 = eq3X.trim() === eq3.correctX;
    const ok4 = neg1Choice === neg1.correctChoice;
    const ok5 = neg2Choice === neg2.correctChoice;
    const ok6 = neg3Val.trim() === neg3.correctVal;

    const correct = [ok1, ok2, ok3, ok4, ok5, ok6].filter(Boolean).length;
    const total = 6;
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 750);

    return { ok1, ok2, ok3, ok4, ok5, ok6, correct, total, percentage, xp };
  };

  const commitValidation = () => {
    setShowConfirm(false);
    const { percentage, xp } = evaluate();
    setSubmitted(true);

    if (percentage >= 70) {
      sound.playVictory();
      setFeedback(`¡Núcleo estabilizado! Has restaurado las constantes perdidas con un ${percentage}% de acierto (+${xp} XP). Insignia "Salvador/a de la Memoria" desbloqueada.`);
    } else {
      sound.playError();
      setFeedback(`Alerta crítica: ${percentage}% de acierto. Recuerda que todo número elevado a 0 vale 1 y que a^-n = 1 / a^n.`);
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
    const { correct, total, percentage, xp } = evaluate();
    onComplete({ correct, total, percentage, xp });
  };

  const status = evaluate();

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EF4444]/40">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Cámara 8: La Gran Consola de las Constantes Perdidas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ecuaciones exponenciales con incógnita x y potencias de exponente negativo
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aleatorio</span>
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#EF4444]/20 text-[#FCA5A5] border border-[#EF4444]/40">
            Última Cámara
          </span>
        </div>
      </div>

      <div className="bg-[#1C150F]/95 border-2 border-[#EF4444]/60 rounded-2xl p-5 sm:p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-[#EF4444]/30">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#EF4444]" />
            <h3 className="font-semibold text-white text-base">
              Consola de Emergencia: Ecuaciones e Inversos Negativos
            </h3>
          </div>
          <span className="text-xs text-[#FCA5A5]">Sobrecarga de Servidor</span>
        </div>

        {/* Section 1: Ecuaciones con potencias */}
        <div className="mb-7">
          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
            Parte 1: Descifra el valor de la incógnita x
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Eq 1 */}
            <div className={`p-4 rounded-xl border ${
              submitted ? (status.ok1 ? 'bg-[#00FF88]/10 border-[#00FF88]/60' : 'bg-[#EF4444]/10 border-[#EF4444]/60') : 'bg-[#120E0A] border-[#D4AF37]/30'
            }`}>
              <div className="text-xs text-slate-400 mb-1">Ecuación Alfa:</div>
              <div className="font-mono-math text-lg font-bold text-white mb-2 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                (<MathPower base={eq1.b} exp={<span className="text-[#00E5FF]">x</span>} />)<sup className="text-[0.72em] ml-[1px] font-bold relative -top-[0.42em]">{eq1.k}</sup> = 1
              </div>
              <div className="text-[11px] text-slate-300 mb-3">
                ¿Qué valor debe tomar x para que la potencia completa sea igual a 1?
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">x =</span>
                <input
                  type="text"
                  value={eq1X}
                  onChange={(e) => { setEq1X(e.target.value); setShowConfirm(false); }}
                  placeholder="?"
                  disabled={submitted}
                  className="w-20 bg-[#1C150F] border-2 border-[#D4AF37]/50 rounded-lg px-2 py-1 text-center font-mono-math text-white text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-200">
                  Solución: <strong className="text-[#00FF88]">x = {eq1.correctX}</strong> (pues {eq1.b}<sup className="text-[0.75em]">0</sup> = 1)
                </div>
              )}
            </div>

            {/* Eq 2 */}
            <div className={`p-4 rounded-xl border ${
              submitted ? (status.ok2 ? 'bg-[#00FF88]/10 border-[#00FF88]/60' : 'bg-[#EF4444]/10 border-[#EF4444]/60') : 'bg-[#120E0A] border-[#D4AF37]/30'
            }`}>
              <div className="text-xs text-slate-400 mb-1">Ecuación Beta:</div>
              <div className="font-mono-math text-base sm:text-lg font-bold text-white mb-2 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                <MathPower base={`(-${eq2.b})`} exp={<span className="text-[#00E5FF]">x</span>} /> · <MathPower base={`(-${eq2.b})`} exp={eq2.m} /> = <MathPower base={eq2.b} exp={eq2.p} />
              </div>
              <div className="text-[11px] text-slate-300 mb-3">
                Fíjate en la suma de exponentes para igualar el resultado positivo.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">x =</span>
                <input
                  type="text"
                  value={eq2X}
                  onChange={(e) => { setEq2X(e.target.value); setShowConfirm(false); }}
                  placeholder="?"
                  disabled={submitted}
                  className="w-20 bg-[#1C150F] border-2 border-[#D4AF37]/50 rounded-lg px-2 py-1 text-center font-mono-math text-white text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-200">
                  Solución: <strong className="text-[#00FF88]">x = {eq2.correctX}</strong> (x + {eq2.m} = {eq2.p}, exponente par positivo)
                </div>
              )}
            </div>

            {/* Eq 3 */}
            <div className={`p-4 rounded-xl border ${
              submitted ? (status.ok3 ? 'bg-[#00FF88]/10 border-[#00FF88]/60' : 'bg-[#EF4444]/10 border-[#EF4444]/60') : 'bg-[#120E0A] border-[#D4AF37]/30'
            }`}>
              <div className="text-xs text-slate-400 mb-1">Ecuación Gamma:</div>
              <div className="font-mono-math text-base sm:text-lg font-bold text-white mb-2 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                <MathPower base={`(-${eq3.b})`} exp={<span className="text-[#00E5FF]">x</span>} /> : <MathPower base={eq3.b} exp={eq3.m} /> = <MathPower base={`(-${eq3.b})`} exp={eq3.p} />
              </div>
              <div className="text-[11px] text-slate-300 mb-3">
                En el cociente se restan los exponentes: <span className="font-mono-math">x − {eq3.m} = {eq3.p}</span>.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">x =</span>
                <input
                  type="text"
                  value={eq3X}
                  onChange={(e) => { setEq3X(e.target.value); setShowConfirm(false); }}
                  placeholder="?"
                  disabled={submitted}
                  className="w-20 bg-[#1C150F] border-2 border-[#D4AF37]/50 rounded-lg px-2 py-1 text-center font-mono-math text-white text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-200">
                  Solución: <strong className="text-[#00FF88]">x = {eq3.correctX}</strong> ({eq3.correctX} − {eq3.m} = {eq3.p})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Exponentes Negativos */}
        <div>
          <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3 flex flex-wrap items-center gap-2">
            <span>Parte 2: Exponentes Negativos</span>
            <span className="text-slate-300 font-normal normal-case flex items-center gap-1.5">
              (<MathPower base="a" exp="-n" /> = <MathFraction className="text-xs" numerator="1" denominator={<MathPower base="a" exp="n" />} />)
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Neg 1 */}
            <div className={`p-4 rounded-xl border ${
              submitted ? (status.ok4 ? 'bg-[#00FF88]/10 border-[#00FF88]/60' : 'bg-[#EF4444]/10 border-[#EF4444]/60') : 'bg-[#120E0A] border-[#D4AF37]/30'
            }`}>
              <div className="text-xs text-slate-400 mb-1">Terminal Inverso 1:</div>
              <div className="font-mono-math text-xl font-bold text-white mb-3 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                <MathPower base={neg1.b} exp="-1" />
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { id: `1/${neg1.b}`, node: <MathFraction numerator="1" denominator={neg1.b} /> },
                  { id: `-${neg1.b}`, node: <span className="font-mono-math">-{neg1.b}</span> },
                  { id: '1', node: <span className="font-mono-math">1</span> },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#251C14] cursor-pointer border border-[#D4AF37]/15">
                    <input
                      type="radio"
                      name="neg1"
                      value={opt.id}
                      checked={neg1Choice === opt.id}
                      onChange={(e) => { setNeg1Choice(e.target.value); setShowConfirm(false); }}
                      disabled={submitted}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-slate-200">{opt.node}</span>
                  </label>
                ))}
              </div>
              {submitted && (
                <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-200">
                  Solución: <strong className="text-[#00FF88]">1 / {neg1.b}</strong> (un exponente negativo invierte la base, no la vuelve negativa)
                </div>
              )}
            </div>

            {/* Neg 2 */}
            <div className={`p-4 rounded-xl border ${
              submitted ? (status.ok5 ? 'bg-[#00FF88]/10 border-[#00FF88]/60' : 'bg-[#EF4444]/10 border-[#EF4444]/60') : 'bg-[#120E0A] border-[#D4AF37]/30'
            }`}>
              <div className="text-xs text-slate-400 mb-1">Terminal Inverso 2:</div>
              <div className="font-mono-math text-xl font-bold text-white mb-3 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                <MathPower base={`(-${neg2.b})`} exp="-3" />
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { id: `-1/${neg2.bCubed}`, node: <MathFraction numerator="-1" denominator={neg2.bCubed} /> },
                  { id: `1/${neg2.bCubed}`, node: <MathFraction numerator="+1" denominator={neg2.bCubed} /> },
                  { id: `+${neg2.b * 3}`, node: <span className="font-mono-math">+{neg2.b * 3}</span> },
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#251C14] cursor-pointer border border-[#D4AF37]/15">
                    <input
                      type="radio"
                      name="neg2"
                      value={opt.id}
                      checked={neg2Choice === opt.id}
                      onChange={(e) => { setNeg2Choice(e.target.value); setShowConfirm(false); }}
                      disabled={submitted}
                      className="accent-[#D4AF37]"
                    />
                    <span className="text-slate-200">{opt.node}</span>
                  </label>
                ))}
              </div>
              {submitted && (
                <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-200">
                  Solución: <strong className="text-[#00FF88]">-1 / {neg2.bCubed}</strong>, pues <FormatMath expr={`(-${neg2.b})^3 = -${neg2.bCubed}`} />
                </div>
              )}
            </div>

            {/* Neg 3 */}
            <div className={`p-4 rounded-xl border ${
              submitted ? (status.ok6 ? 'bg-[#00FF88]/10 border-[#00FF88]/60' : 'bg-[#EF4444]/10 border-[#EF4444]/60') : 'bg-[#120E0A] border-[#D4AF37]/30'
            }`}>
              <div className="text-xs text-slate-400 mb-1">Terminal Inverso 3:</div>
              <div className="font-mono-math text-lg font-bold text-white mb-3 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                <MathFraction
                  numerator="1"
                  denominator={<MathPower base={neg3.b} exp={`-${neg3.n}`} />}
                />
              </div>
              <div className="text-[11px] text-slate-300 mb-3">
                Invierte el exponente negativo del denominador para calcular su valor entero exacto:
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#00E5FF] font-mono-math font-bold">Valor =</span>
                <input
                  type="text"
                  value={neg3Val}
                  onChange={(e) => { setNeg3Val(e.target.value); setShowConfirm(false); }}
                  placeholder="Número"
                  disabled={submitted}
                  className="w-24 bg-[#1C150F] border-2 border-[#D4AF37]/50 rounded-lg px-2 py-1 text-center font-mono-math text-white text-sm font-bold focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              {submitted && (
                <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-200">
                  Solución: <strong className="text-[#00FF88]">{neg3.correctVal}</strong> (<MathPower base={neg3.b} exp={neg3.n} /> = {neg3.correctVal})
                </div>
              )}
            </div>
          </div>
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
          submitted && feedback.includes('estabilizado')
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && feedback.includes('estabilizado') ? (
            <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#EF4444]" />
          )}
          <div>
            <FormatMath expr={feedback} className="font-sans" />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!submitted ? (
          <button
            onClick={handleValidateClick}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:from-[#F87171] hover:to-[#EF4444] text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-[#EF4444]/30 active:scale-95"
          >
            <span>RESTAURAR CONSTANTES Y SALVAR A ALEX-A (Definitivo)</span>
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
