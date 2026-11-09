import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
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
  // Procedural generator that creates 6 dynamic modules with fresh bases and exponents on each run
  const complexItems = useMemo<ComplexItem[]>(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Mod 1: [(-b)^p]^q
    const b1 = pick([2, 3, 4, 5, 7]);
    const p1 = randInt(2, 4);
    const q1 = randInt(2, 4);
    const exp1 = p1 * q1;

    // Mod 2: [(b^p)^q]^r
    const b2 = pick([2, 3, 5]);
    const p2 = randInt(2, 3);
    const q2 = randInt(2, 3);
    const r2 = randInt(2, 4);
    const exp2 = p2 * q2 * r2;

    // Mod 3: Fracción Numérica: (b^p · b^q · b^r) / (b^s · b)
    const b3 = pick([3, 5, 7, 10]);
    const p3 = randInt(2, 4);
    const q3 = randInt(2, 4);
    const r3 = randInt(2, 3);
    const numSum3 = p3 + q3 + r3;
    const diff3 = randInt(2, 4);
    const s3 = numSum3 - diff3 - 1; // denominator is b^s · b => sum s + 1
    const exp3 = diff3;

    // Mod 4: Fracción Negativa: ((-b)^p · (-b) · (-b)^q) / ((-b)^s · (-b)^t)
    const b4 = pick([2, 3, 4, 5]);
    const p4 = randInt(2, 4);
    const q4 = randInt(3, 5);
    const numSum4 = p4 + 1 + q4;
    const diff4 = randInt(1, 3);
    const s4 = randInt(2, 3);
    const t4 = numSum4 - diff4 - s4;
    const exp4 = diff4;

    // Mod 5: Fracción con Potencia de Potencia: (b^p · (b^q)^r) / ((b^s)^t · b^u)
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

    // Mod 6: Fracción con variable literal (a, x, y, m)
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
        stepHint: `Multiplicamos sucesivamente los tres exponentes: ${p2} · ${q2} · ${r2} = ${exp2} ⟹ ${b2}^${exp2}.`
      },
      {
        id: 'c3',
        title: 'Fracción de Potencias',
        numeratorDisplay: `${b3}^${p3} · ${b3}^${q3} · ${b3}^${r3}`,
        denominatorDisplay: `${b3}^${s3} · ${b3}`,
        isFraction: true,
        correctBase: b3.toString(),
        correctExp: exp3.toString(),
        stepHint: `Numerador: ${p3} + ${q3} + ${r3} = ${numSum3} (${b3}^${numSum3}). Denominador: ${s3} + 1 = ${s3 + 1} (${b3}^${s3 + 1}). Cociente: ${numSum3} - ${s3 + 1} = ${exp3} ⟹ ${b3}^${exp3}.`
      },
      {
        id: 'c4',
        title: 'Fracción de Base Entera Negativa',
        numeratorDisplay: `(-${b4})^${p4} · (-${b4}) · (-${b4})^${q4}`,
        denominatorDisplay: `(-${b4})^${s4} · (-${b4})^${t4}`,
        isFraction: true,
        correctBase: `(-${b4})`,
        correctExp: exp4.toString(),
        stepHint: `Numerador: ${p4} + 1 + ${q4} = ${numSum4}. Denominador: ${s4} + ${t4} = ${s4 + t4}. Cociente: ${numSum4} - ${s4 + t4} = ${exp4} ⟹ (-${b4})^${exp4}.`
      },
      {
        id: 'c5',
        title: 'Fracción con Potencia de Potencia',
        numeratorDisplay: `${b5}^${adjustedP5 > 0 ? adjustedP5 : 3} · (${b5}^${q5})^${r5}`,
        denominatorDisplay: `(${b5}^${s5})^${t5} · ${b5}^${u5}`,
        isFraction: true,
        correctBase: b5.toString(),
        correctExp: exp5.toString(),
        stepHint: `Resuelve primero las potencias de potencias y luego agrupa numeradores y denominadores para restar exponentes.`
      },
      {
        id: 'c6',
        title: 'Simplificación Algebraica Literal',
        numeratorDisplay: `${varLetter}^${actualP6 > 0 ? actualP6 : 4} · (${varLetter}^${q6})^${r6} · ${varLetter}^${s6}`,
        denominatorDisplay: `(${varLetter}^${t6})^${u6} · (${varLetter}^${v6})^${w6}`,
        isFraction: true,
        correctBase: varLetter,
        correctExp: exp6.toString(),
        stepHint: `Las leyes de potencias se aplican exactamente igual a variables literales (${varLetter}). Multiplica exponentes en paréntesis y luego resta exponentes: resultado ${varLetter}^${exp6}.`
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
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInputChange = (id: string, field: 'base' | 'exp', val: string) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: val }
    }));
  };

  const normalize = (str: string) => str.trim().replace(/\s/g, '');

  const handleValidate = () => {
    sound.playClick();
    let correct = 0;
    const total = complexItems.length;

    complexItems.forEach(item => {
      const uBase = normalize(answers[item.id].base);
      const uExp = normalize(answers[item.id].exp);

      const baseMatch = uBase === item.correctBase || uBase === item.correctBase.replace(/[()]/g, '');
      const expMatch = uExp === item.correctExp;

      if (baseMatch && expMatch) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 600);

    setSubmitted(true);

    if (percentage >= 70) {
      sound.playSuccess();
      setFeedback(`¡Núcleo de simplificación estabilizado! Has obtenido ${percentage}% de acierto (+${xp} XP) e Insignia "Arquitecto/a de Simplificación".`);
    } else {
      sound.playError();
      setFeedback(`Se detectaron inconsistencias en la simplificación (${percentage}%). Revisa las pistas de cada fracción.`);
    }
  };

  const handleProceed = () => {
    let correct = 0;
    const total = complexItems.length;
    complexItems.forEach(item => {
      const uBase = normalize(answers[item.id].base);
      const uExp = normalize(answers[item.id].exp);
      const baseMatch = uBase === item.correctBase || uBase === item.correctBase.replace(/[()]/g, '');
      const expMatch = uExp === item.correctExp;
      if (baseMatch && expMatch) correct++;
    });
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 600);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Misión 4: El Núcleo de Simplificación Compleja
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Potencia de Potencia y Fracciones Algebraico-Numéricas · Ficha Pág. 2
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aleatorio</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            6 Fracciones Cuánticas
          </span>
        </div>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-semibold text-white text-sm">
              Simplificación Fraccionaria: Condensa a una sola potencia a^k
            </h3>
          </div>
          <span className="text-xs text-[#00E5FF] font-mono-math">Base y Exponente</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complexItems.map((item, idx) => {
            const ans = answers[item.id];
            const uBase = normalize(ans.base);
            const uExp = normalize(ans.exp);
            const isMatch = (uBase === item.correctBase || uBase === item.correctBase.replace(/[()]/g, '')) && uExp === item.correctExp;

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
                    <button
                      type="button"
                      onClick={() => setActiveHint(activeHint === item.id ? null : item.id)}
                      className="text-slate-400 hover:text-[#00E5FF] text-xs flex items-center gap-1"
                      title="Ver pista matemática"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Pista</span>
                    </button>
                  </div>

                  {/* Expression Box */}
                  <div className="p-3 bg-[#1C150F] rounded-xl mb-3 text-center font-mono-math border border-[#D4AF37]/20">
                    {item.isFraction ? (
                      <div className="inline-flex flex-col items-center">
                        <span className="text-sm font-bold text-white px-2 pb-1 border-b-2 border-slate-300">
                          {item.numeratorDisplay}
                        </span>
                        <span className="text-sm font-bold text-slate-300 px-2 pt-1">
                          {item.denominatorDisplay}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-white tracking-wide">
                        {item.numeratorDisplay}
                      </span>
                    )}
                  </div>

                  {activeHint === item.id && (
                    <div className="p-2.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs mb-3 leading-relaxed">
                      💡 {item.stepHint}
                    </div>
                  )}
                </div>

                <div>
                  {/* Inputs */}
                  <div className="flex items-center justify-center gap-2 font-mono-math">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 mb-0.5">Base</span>
                      <input
                        type="text"
                        value={ans.base}
                        onChange={(e) => handleInputChange(item.id, 'base', e.target.value)}
                        placeholder="Base"
                        disabled={submitted}
                        className="w-16 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-2 py-1.5 text-center text-white text-sm font-bold focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                  <span className="text-lg text-[#D4AF37] font-bold mt-3">^</span>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 mb-0.5">Exp</span>
                      <input
                        type="text"
                        value={ans.exp}
                        onChange={(e) => handleInputChange(item.id, 'exp', e.target.value)}
                        placeholder="Exp"
                        disabled={submitted}
                        className="w-14 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-2 py-1.5 text-center text-[#00E5FF] text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
                      />
                    </div>
                  </div>

                  {submitted && (
                    <div className="text-[11px] mt-2.5 pt-2 border-t border-[#D4AF37]/20 text-slate-300">
                      <span className="text-[#00FF88] font-semibold">Respuesta: </span>
                      <span className="font-mono-math">{item.correctBase}^{item.correctExp}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.stepHint}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
            onClick={handleValidate}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Verificar Simplificaciones</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#B91C1C] hover:from-[#F87171] hover:to-[#EF4444] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#EF4444]/30 active:scale-95 animate-pulse"
          >
            <span>¡Alerta! Acudir al Clímax (Misión 5)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
