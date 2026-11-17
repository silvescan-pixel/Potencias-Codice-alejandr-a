import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { PowerInput } from '../PowerInput';
import { FormatMath, MathFraction, MathPower } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
import { cleanMathToken, validatePowerAnswer } from '../../utils/powerValidation';
import { Cpu, Zap, ArrowRight, Award, AlertCircle, HelpCircle, RefreshCw } from 'lucide-react';

interface Mission4Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

interface ComplexItem {
  id: string;
  title: string;
  numeratorDisplay: string;
  denominatorDisplay?: string;
  isFraction: boolean;
  correctBase: string;
  correctExp: string;
  stepHint: string;
}

export const Mission4Simplification: React.FC<Mission4Props> = ({ onComplete }) => {
  const complexItems = useMemo<ComplexItem[]>(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const b1 = pick([2, 3, 4, 5, 7]);
    const p1 = randInt(2, 4);
    const q1 = randInt(2, 4);
    const exp1 = p1 * q1;

    const b2 = pick([2, 3, 5]);
    const p2 = randInt(2, 3);
    const q2 = randInt(2, 3);
    const r2 = randInt(2, 4);
    const exp2 = p2 * q2 * r2;

    const b3 = pick([3, 5, 7, 10]);
    const p3 = randInt(2, 4);
    const q3 = randInt(2, 4);
    const r3 = randInt(2, 3);
    const numSum3 = p3 + q3 + r3;
    const diff3 = randInt(2, 4);
    const s3 = numSum3 - diff3 - 1;
    const exp3 = diff3;

    const b4 = pick([2, 3, 4, 5]);
    const p4 = randInt(2, 4);
    const q4 = randInt(3, 5);
    const numSum4 = p4 + 1 + q4;
    const diff4 = randInt(1, 3);
    const s4 = randInt(2, 3);
    const t4 = numSum4 - diff4 - s4;
    const exp4 = diff4;

    const b5 = pick([2, 3, 5]);
    const p5 = randInt(2, 4);
    const q5 = randInt(2, 3);
    const r5 = randInt(2, 3);
    const num5 = p5 + (q5 * r5);
    const s5 = 2;
    const t5 = randInt(2, 3);
    const u5 = randInt(1, 2);
    const den5 = (s5 * t5) + u5;
    const exp5 = num5 - den5 > 0 ? num5 - den5 : 2;
    const adjustedP5 = den5 + exp5 - (q5 * r5);

    const varLetter = pick(['a', 'x', 'y', 'm']);
    const p6 = randInt(3, 5);
    const q6 = randInt(2, 3);
    const r6 = randInt(2, 3);
    const s6 = randInt(2, 4);
    const num6 = p6 + (q6 * r6) + s6;
    const t6 = randInt(2, 3);
    const u6 = 2;
    const v6 = 2;
    const w6 = randInt(1, 2);
    const den6 = (t6 * u6) + (v6 * w6);
    const exp6 = Math.max(1, num6 - den6);
    const actualP6 = den6 + exp6 - (q6 * r6) - s6;

    return [
      {
        id: 'c1',
        title: 'Potencia de Potencia',
        numeratorDisplay: `[(-${b1})^${p1}]^${q1}`,
        isFraction: false,
        correctBase: `(-${b1})`,
        correctExp: exp1.toString(),
        stepHint: `Potencia de potencia: se multiplican los exponentes (${p1} · ${q1} = ${exp1}) manteniendo la base (-${b1}).`
      },
      {
        id: 'c2',
        title: 'Potencia Anidada Triple',
        numeratorDisplay: `[(${b2}^${p2})^${q2}]^${r2}`,
        isFraction: false,
        correctBase: b2.toString(),
        correctExp: exp2.toString(),
        stepHint: `Multiplicamos sucesivamente los tres exponentes: ${p2} · ${q2} · ${r2} = ${exp2} → ${b2}^${exp2}.`
      },
      {
        id: 'c3',
        title: 'Fracción de Potencias',
        numeratorDisplay: `${b3}^${p3} · ${b3}^${q3} · ${b3}^${r3}`,
        denominatorDisplay: `${b3}^${s3} · ${b3}`,
        isFraction: true,
        correctBase: b3.toString(),
        correctExp: exp3.toString(),
        stepHint: `Numerador: ${p3} + ${q3} + ${r3} = ${numSum3} (${b3}^${numSum3}). Denominador: ${s3} + 1 = ${s3 + 1} (${b3}^${s3 + 1}). Cociente: ${numSum3} - ${s3 + 1} = ${exp3} → ${b3}^${exp3}.`
      },
      {
        id: 'c4',
        title: 'Fracción de Base Entera Negativa',
        numeratorDisplay: `(-${b4})^${p4} · (-${b4}) · (-${b4})^${q4}`,
        denominatorDisplay: `(-${b4})^${s4} · (-${b4})^${t4}`,
        isFraction: true,
        correctBase: `(-${b4})`,
        correctExp: exp4.toString(),
        stepHint: `Numerador: ${p4} + 1 + ${q4} = ${numSum4}. Denominador: ${s4} + ${t4} = ${s4 + t4}. Cociente: ${numSum4} - ${s4 + t4} = ${exp4} → (-${b4})^${exp4}.`
      },
      {
        id: 'c5',
        title: 'Fracción con Potencia de Potencia',
        numeratorDisplay: `${b5}^${adjustedP5 > 0 ? adjustedP5 : 3} · (${b5}^${q5})^${r5}`,
        denominatorDisplay: `(${b5}^${s5})^${t5} · ${b5}^${u5}`,
        isFraction: true,
        correctBase: b5.toString(),
        correctExp: exp5.toString(),
        stepHint: `Resuelve primero las potencias de potencias, agrupa sumando en numerador y denominador y finalmente resta exponentes: ${b5}^${exp5}.`
      },
      {
        id: 'c6',
        title: 'Simplificación Algebraica Literal',
        numeratorDisplay: `${varLetter}^${actualP6 > 0 ? actualP6 : 4} · (${varLetter}^${q6})^${r6} · ${varLetter}^${s6}`,
        denominatorDisplay: `(${varLetter}^${t6})^${u6} · (${varLetter}^${v6})^${w6}`,
        isFraction: true,
        correctBase: varLetter,
        correctExp: exp6.toString(),
        stepHint: `Las leyes de potencias se aplican igual a letras (${varLetter}): multiplica exponentes en paréntesis y resta al dividir → ${varLetter}^${exp6}.`
      }
    ];
  }, []);

  const [answers, setAnswers] = useState<Record<string, { base: string; exp: string }>>({
    c1: { base: '', exp: '' },
    c2: { base: '', exp: '' },
    c3: { base: '', exp: '' },
    c4: { base: '', exp: '' },
    c5: { base: '', exp: '' },
    c6: { base: '', exp: '' },
  });

  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInputChange = (id: string, field: 'base' | 'exp', val: string) => {
    if (submitted) return;
    setShowConfirm(false);
    setAnswers(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: val }
    }));
  };

  const missingCount = complexItems.filter(item => {
    const ans = answers[item.id];
    return cleanMathToken(ans.base) === '' || cleanMathToken(ans.exp) === '';
  }).length;

  const commitValidation = () => {
    setShowConfirm(false);
    let correct = 0;
    const total = complexItems.length;

    complexItems.forEach(item => {
      const check = validatePowerAnswer(
        answers[item.id].base,
        answers[item.id].exp,
        item.correctBase,
        item.correctExp
      );
      if (check.isValid) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 600);

    setSubmitted(true);

    if (percentage >= 70) {
      sound.playSuccess();
      setFeedback(`¡Núcleo fraccionario estabilizado! Has obtenido ${percentage}% de acierto (+${xp} XP) e Insignia "Arquitecto/a de Simplificación".`);
    } else {
      sound.playError();
      setFeedback(`Se detectaron inconsistencias en la simplificación (${percentage}%). Revisa el desarrollo paso a paso de cada módulo y los paréntesis en bases negativas con exponente par.`);
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
    const total = complexItems.length;
    complexItems.forEach(item => {
      const check = validatePowerAnswer(
        answers[item.id].base,
        answers[item.id].exp,
        item.correctBase,
        item.correctExp
      );
      if (check.isValid) correct++;
    });
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 600);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Cámara 7: El Núcleo Fraccionario
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Potencia de potencia y simplificación de fracciones numéricas y algebraicas
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>6 Módulos Aleatorios</span>
        </span>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-semibold text-white text-sm">
              Simplifica cada expresión a una sola potencia (base y exponente elevado):
            </h3>
          </div>
          <span className="text-xs text-[#00E5FF]">Paso a paso</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complexItems.map((item, idx) => {
            const ans = answers[item.id];
            const check = validatePowerAnswer(ans.base, ans.exp, item.correctBase, item.correctExp);
            const isMatch = check.isValid;
            const bareNeg = item.correctBase.replace(/[()]/g, '');

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  submitted
                    ? isMatch
                      ? 'bg-[#00FF88]/10 border-[#00FF88]/50'
                      : 'bg-[#EF4444]/10 border-[#EF4444]/50'
                    : 'bg-[#120E0A] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#D4AF37]">Módulo 0{idx + 1}: {item.title}</span>
                    {!submitted && (
                      <button
                        type="button"
                        onClick={() => setActiveHint(activeHint === item.id ? null : item.id)}
                        className="text-slate-400 hover:text-[#00E5FF] text-xs flex items-center gap-1"
                        title="Ver orientación matemática"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Orientación</span>
                      </button>
                    )}
                  </div>

                  <div className="p-3.5 bg-[#1C150F] rounded-xl mb-3 text-center font-mono-math border border-[#D4AF37]/20 min-h-[76px] flex items-center justify-center">
                    {item.isFraction ? (
                      <MathFraction
                        className="text-sm sm:text-base font-bold text-white"
                        numerator={<FormatMath expr={item.numeratorDisplay} />}
                        denominator={<FormatMath expr={item.denominatorDisplay || ''} className="text-slate-200" />}
                      />
                    ) : (
                      <span className="text-lg font-bold text-white tracking-wide">
                        <FormatMath expr={item.numeratorDisplay} />
                      </span>
                    )}
                  </div>

                  {!submitted && activeHint === item.id && (
                    <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FFF0A0] text-xs mb-3 leading-relaxed">
                      <FormatMath expr={item.stepHint} className="font-sans" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-center">
                    <PowerInput
                      size="sm"
                      showLabels={true}
                      baseValue={ans.base}
                      expValue={ans.exp}
                      onBaseChange={(val) => handleInputChange(item.id, 'base', val)}
                      onExpChange={(val) => handleInputChange(item.id, 'exp', val)}
                      disabled={submitted}
                      status={submitted ? (isMatch ? 'correct' : 'wrong') : 'default'}
                    />
                  </div>

                  {submitted && (
                    <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-300">
                      <span className="text-[#00FF88] font-semibold">Respuesta correcta: </span>
                      <strong className="text-white">
                        <MathPower base={item.correctBase} exp={item.correctExp} />
                      </strong>
                      {check.missingParensError && (
                        <div className="text-[10px] text-[#FCA5A5] mt-1 leading-snug font-medium">
                          Faltaron paréntesis: con exponente par ({item.correctExp}), <FormatMath expr={`${bareNeg}^${item.correctExp}`} /> es negativo y no coincide con <FormatMath expr={`${item.correctBase}^${item.correctExp}`} /> (positivo).
                        </div>
                      )}
                      <div className="text-[10px] text-slate-300 mt-1 leading-snug">
                        <FormatMath expr={item.stepHint} className="font-sans" />
                      </div>
                    </div>
                  )}
                </div>
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
          submitted && feedback.includes('estabilizado')
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && feedback.includes('estabilizado') ? (
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
            <span>Verificar Simplificaciones (Definitivo)</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:from-[#F87171] hover:to-[#EF4444] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#EF4444]/30 active:scale-95"
          >
            <span>Acudir a la Consola Final (Cámara 8)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
