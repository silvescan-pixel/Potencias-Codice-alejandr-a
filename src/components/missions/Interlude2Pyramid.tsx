import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { FormatMath } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
import { Sparkles, Zap, ArrowRight, Award, ShieldAlert, RefreshCw } from 'lucide-react';

interface Interlude2Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Interlude2Pyramid: React.FC<Interlude2Props> = ({ onComplete }) => {
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isStrategyCorrect = selectedStrategy === 'opt_zero';
  const isQ2Correct = q2Value.trim() === '1';

  const missingCount = (selectedStrategy === '' ? 1 : 0) + (q2Value.trim() === '' ? 1 : 0);

  const commitValidation = () => {
    setShowConfirm(false);
    setSubmitted(true);

    if (isStrategyCorrect && isQ2Correct) {
      sound.playSuccess();
      setFeedback(`¡Vórtice estabilizado! Has evitado el colapso aplicando la propiedad del exponente cero: [(${b1}^${p1})^${q1}]^0 · (-${k1})^0 = 1 · 1 = 1, y el Segundo Sello también vale 1 (+150 XP).`);
    } else {
      sound.playError();
      setFeedback(`¡Cuidado! Calcular ${b1}^${p1 * q1} saturaría el procesador. Al haber un exponente exterior 0, cualquier base distinta de cero elevada a 0 vale exactamente 1.`);
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
    const correct = (isStrategyCorrect ? 1 : 0) + (isQ2Correct ? 1 : 0);
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
            Cámara 6: El Vórtice de la Pirámide de Datos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimización térmica con la propiedad del exponente cero (<FormatMath expr="a^0 = 1" />)
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Datos Aleatorios</span>
        </span>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/50 rounded-2xl p-6 mb-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D4AF37]/30">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-semibold text-white text-base">
            Primer Sello: Sobrecarga en el Vórtice Central
          </h3>
        </div>

        <div className="bg-[#120E0A] rounded-xl p-5 border border-[#D4AF37]/30 mb-6 text-center">
          <div className="text-xs text-slate-400 mb-2">Carga computacional detectada en la cámara:</div>
          <div className="font-mono-math text-2xl sm:text-3xl text-[#D4AF37] font-bold tracking-wider mb-3">
            <FormatMath expr={`[(${b1}^${p1})^${q1}]^0 · (-${k1})^0`} />
          </div>
          <div className="text-xs text-[#00E5FF]">
            ¿Qué estrategia matemática permite resolverlo al instante sin fundir los procesadores?
          </div>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              1. Selecciona la estrategia de optimización:
            </label>
            <div className="space-y-2.5">
              {[
                {
                  id: 'opt_zero',
                  title: 'Estrategia del Exponente Cero (a^0 = 1)',
                  desc: `Como el exponente exterior de cada bloque es 0, [(${b1}^${p1})^${q1}]^0 = 1 y (-${k1})^0 = 1. Por tanto, 1 · 1 = 1.`
                },
                {
                  id: 'brute_force',
                  title: 'Expansión por Fuerza Bruta',
                  desc: `Multiplicar ${p1} · ${q1} = ${p1 * q1}, calcular el número gigante ${b1}^${p1 * q1} y después aplicar (-${k1})^0.`
                },
                {
                  id: 'zero_result',
                  title: 'Anulación Total por Cero',
                  desc: 'Como aparecen ceros en los exponentes, el resultado numérico completo se convierte en 0.'
                }
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    submitted
                      ? opt.id === 'opt_zero'
                        ? 'bg-[#00FF88]/10 border-[#00FF88]'
                        : selectedStrategy === opt.id
                        ? 'bg-[#EF4444]/10 border-[#EF4444]'
                        : 'bg-[#120E0A] border-[#D4AF37]/20 opacity-70'
                      : selectedStrategy === opt.id
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-md'
                      : 'bg-[#120E0A] border-[#D4AF37]/25 hover:bg-[#251C14]'
                  }`}
                >
                  <input
                    type="radio"
                    name="interlude2"
                    value={opt.id}
                    checked={selectedStrategy === opt.id}
                    onChange={(e) => { setSelectedStrategy(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    className="accent-[#D4AF37] mt-1"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">
                      <FormatMath expr={opt.title} className="font-sans" />
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      <FormatMath expr={opt.desc} className="font-sans" />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Immersive Second Containment Seal (Zero worksheet mentions) */}
          <div className={`bg-[#120E0A] p-4 rounded-xl border ${
            submitted
              ? isQ2Correct ? 'border-[#00FF88]/60 bg-[#00FF88]/5' : 'border-[#EF4444]/60 bg-[#EF4444]/5'
              : 'border-[#D4AF37]/30'
          }`}>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              2. Segundo Sello de Contención de la Pirámide: calcula el valor exacto para cerrar la compuerta térmica
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg text-white font-bold font-mono-math">
                <FormatMath expr={`([${b2}^${m2}]^${n2})^0 =`} />
              </span>
              <input
                type="text"
                value={q2Value}
                onChange={(e) => { setQ2Value(e.target.value); setShowConfirm(false); }}
                placeholder="Valor"
                disabled={submitted}
                className="w-24 bg-[#1C150F] border-2 border-[#D4AF37]/50 rounded-lg px-3 py-1.5 text-center font-mono-math text-white text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
              />
              {submitted && (
                <span className="text-xs font-semibold text-[#00FF88]">
                  Respuesta correcta: 1
                </span>
              )}
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
            submitted && isStrategyCorrect && isQ2Correct
              ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
              : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
          }`}>
            {submitted && isStrategyCorrect && isQ2Correct ? (
              <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
            ) : (
              <ShieldAlert className="w-5 h-5 shrink-0 text-[#EF4444]" />
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
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              <span>Desactivar Sobrecarga (Definitivo)</span>
              <Zap className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleProceed}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
            >
              <span>Avanzar al Núcleo Fraccionario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
