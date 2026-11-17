import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { PowerInput } from '../PowerInput';
import { FormatMath, MathPower } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
import { cleanMathToken, validatePowerAnswer } from '../../utils/powerValidation';
import { Zap, ArrowRight, Award, AlertCircle, Radio, RefreshCw } from 'lucide-react';

interface Mission3Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

interface ChannelItem {
  id: string;
  operation: string;
  correctBase: string;
  correctExp: string;
  ruleHint: string;
}

export const Mission3Channels: React.FC<Mission3Props> = ({ onComplete }) => {
  const channels = useMemo<ChannelItem[]>(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const b1 = pick([3, 4, 5, 6, 7]);
    const p1 = randInt(2, 4);
    const q1 = randInt(2, 5);

    const b2 = pick([2, 3, 5, 6]);
    const p2 = randInt(2, 5);

    const b3 = pick([3, 4, 7, 8]);
    const p3 = randInt(2, 4);
    const q3 = randInt(3, 6);

    const b4 = pick([2, 3, 5, 7]);
    const q4 = randInt(2, 3);
    const p4 = q4 + randInt(3, 5) + 1;

    const b5 = pick([2, 4, 5, 6, 9]);
    const q5 = randInt(2, 4);
    const p5 = q5 + randInt(2, 4);

    const b6 = pick([2, 3, 5, 10]);
    const p6 = randInt(2, 4);
    const q6 = randInt(2, 4);

    return [
      {
        id: 'ch1',
        operation: `${b1}^${p1} · ${b1}^${q1}`,
        correctBase: b1.toString(),
        correctExp: (p1 + q1).toString(),
        ruleHint: `Producto de la misma base: se suman exponentes (${p1} + ${q1} = ${p1 + q1}) → ${b1}^${p1 + q1}`
      },
      {
        id: 'ch2',
        operation: `(-${b2})^${p2} · (-${b2})`,
        correctBase: `(-${b2})`,
        correctExp: (p2 + 1).toString(),
        ruleHint: `El factor (-${b2}) tiene exponente 1 implícito: ${p2} + 1 = ${p2 + 1} → (-${b2})^${p2 + 1}`
      },
      {
        id: 'ch3',
        operation: `(-${b3})^${p3} · (-${b3})^${q3}`,
        correctBase: `(-${b3})`,
        correctExp: (p3 + q3).toString(),
        ruleHint: `Base común (-${b3}): suma de exponentes ${p3} + ${q3} = ${p3 + q3} → (-${b3})^${p3 + q3}`
      },
      {
        id: 'ch4',
        operation: `${b4}^${p4} : ${b4} : ${b4}^${q4}`,
        correctBase: b4.toString(),
        correctExp: (p4 - 1 - q4).toString(),
        ruleHint: `Cocientes sucesivos: se restan los exponentes ${p4} - 1 - ${q4} = ${p4 - 1 - q4} → ${b4}^${p4 - 1 - q4}`
      },
      {
        id: 'ch5',
        operation: `(-${b5})^${p5} : (-${b5})^${q5}`,
        correctBase: `(-${b5})`,
        correctExp: (p5 - q5).toString(),
        ruleHint: `Cociente con base (-${b5}): se restan exponentes ${p5} - ${q5} = ${p5 - q5} → (-${b5})^${p5 - q5}`
      },
      {
        id: 'ch6',
        operation: `${b6}^${p6} · ${b6} · ${b6}^${q6}`,
        correctBase: b6.toString(),
        correctExp: (p6 + 1 + q6).toString(),
        ruleHint: `Producto triple: ${p6} + 1 + ${q6} = ${p6 + 1 + q6} → ${b6}^${p6 + 1 + q6}`
      }
    ];
  }, []);

  const [inputs, setInputs] = useState<Record<string, { base: string; exp: string }>>({
    ch1: { base: '', exp: '' },
    ch2: { base: '', exp: '' },
    ch3: { base: '', exp: '' },
    ch4: { base: '', exp: '' },
    ch5: { base: '', exp: '' },
    ch6: { base: '', exp: '' },
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInputChange = (id: string, field: 'base' | 'exp', val: string) => {
    if (submitted) return;
    setShowConfirm(false);
    setInputs(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: val }
    }));
  };

  const missingCount = channels.filter(item => {
    const cur = inputs[item.id];
    return cleanMathToken(cur.base) === '' || cleanMathToken(cur.exp) === '';
  }).length;

  const commitValidation = () => {
    setShowConfirm(false);
    let correct = 0;
    const total = channels.length;

    channels.forEach(item => {
      const check = validatePowerAnswer(
        inputs[item.id].base,
        inputs[item.id].exp,
        item.correctBase,
        item.correctExp
      );
      if (check.isValid) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 200);

    setSubmitted(true);

    if (percentage >= 70) {
      sound.playSuccess();
      setFeedback(`¡Canales sintonizados! Has condensado las frecuencias en una sola potencia con un ${percentage}% de acierto (+${xp} XP) e Insignia "Sintonizador/a de Canales".`);
    } else {
      sound.playError();
      setFeedback(`Interferencias detectadas (${percentage}%). Recuerda sumar exponentes al multiplicar, restar al dividir y usar paréntesis en bases negativas con exponente par.`);
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
    let correct = 0;
    const total = channels.length;
    channels.forEach(item => {
      const check = validatePowerAnswer(
        inputs[item.id].base,
        inputs[item.id].exp,
        item.correctBase,
        item.correctExp
      );
      if (check.isValid) correct++;
    });
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 200);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Cámara 5: Sintonización de los Canales Primarios
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Producto y cociente de potencias con la misma base en una única potencia
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>6 Canales Aleatorios</span>
        </span>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-semibold text-white text-sm">
              Condensa cada operación en una sola potencia (base y exponente elevado):
            </h3>
          </div>
          <span className="text-xs text-[#00E5FF]">Sin desarrollar resultados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((item, idx) => {
            const cur = inputs[item.id];
            const check = validatePowerAnswer(cur.base, cur.exp, item.correctBase, item.correctExp);
            const isMatch = check.isValid;
            const bareNeg = item.correctBase.replace(/[()]/g, '');

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  submitted
                    ? isMatch
                      ? 'bg-[#00FF88]/10 border-[#00FF88]/50'
                      : 'bg-[#EF4444]/10 border-[#EF4444]/50'
                    : 'bg-[#120E0A] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                }`}
              >
                <div className="text-[11px] text-[#D4AF37] mb-1 font-semibold">Canal 0{idx + 1}</div>
                <div className="font-mono-math font-bold text-lg text-white mb-3 text-center py-2.5 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                  <FormatMath expr={item.operation} />
                </div>

                <div className="flex items-center justify-center mb-2">
                  <PowerInput
                    size="sm"
                    showLabels={true}
                    baseValue={cur.base}
                    expValue={cur.exp}
                    onBaseChange={(val) => handleInputChange(item.id, 'base', val)}
                    onExpChange={(val) => handleInputChange(item.id, 'exp', val)}
                    disabled={submitted}
                    status={submitted ? (isMatch ? 'correct' : 'wrong') : 'default'}
                  />
                </div>

                {submitted && (
                  <div className="text-[11px] mt-2 pt-2 border-t border-[#D4AF37]/20 text-slate-300">
                    <span className="text-[#D4AF37] font-semibold">Solución: </span>
                    <strong className="text-[#00FF88]">
                      <MathPower base={item.correctBase} exp={item.correctExp} />
                    </strong>
                    {check.missingParensError && (
                      <div className="text-[10px] text-[#FCA5A5] mt-1 leading-snug font-medium">
                        Faltaron paréntesis: con exponente par ({item.correctExp}), <FormatMath expr={`${bareNeg}^${item.correctExp}`} /> es negativo y no equivale a <FormatMath expr={`${item.correctBase}^${item.correctExp}`} /> (positivo).
                      </div>
                    )}
                    <div className="text-[10px] text-slate-300 mt-1 leading-snug">
                      <FormatMath expr={item.ruleHint} className="font-sans" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
          submitted && feedback.includes('sintonizados')
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && feedback.includes('sintonizados') ? (
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
            onClick={handleValidateClick}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Unificar Canales (Definitivo)</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Avanzar al Vórtice de la Pirámide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
