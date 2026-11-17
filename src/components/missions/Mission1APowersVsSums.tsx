import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { FormatMath } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
import { Zap, ArrowRight, Award, AlertCircle, RefreshCw, CheckSquare, Info } from 'lucide-react';

interface Mission1AProps {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

interface ItemOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

interface QuestionItem {
  id: string;
  title: string;
  expression: string;
  options: ItemOption[];
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const Mission1APowersVsSums: React.FC<Mission1AProps> = ({ onComplete }) => {
  const questions: QuestionItem[] = useMemo(() => {
    const posBaseOptions = [
      { b: 2, n: 4 }, { b: 2, n: 5 }, { b: 3, n: 3 }, { b: 3, n: 4 },
      { b: 4, n: 3 }, { b: 5, n: 3 }, { b: 6, n: 3 }, { b: 7, n: 2 }, { b: 10, n: 3 }
    ];
    const pos = posBaseOptions[Math.floor(Math.random() * posBaseOptions.length)];
    const posExpr = Array(pos.n).fill(pos.b.toString()).join(' · ');
    const posVal = Math.pow(pos.b, pos.n);
    const q1Options: ItemOption[] = shuffle([
      { id: `${pos.b}^${pos.n}`, label: `${pos.b}^${pos.n} (Potencia de base ${pos.b} y exponente ${pos.n} = ${posVal})`, isCorrect: true },
      { id: `${pos.b}*${pos.n}`, label: `${pos.b} · ${pos.n} = ${pos.b * pos.n} (Multiplicación simple, valor diferente)`, isCorrect: false },
      { id: `${pos.n}^${pos.b}`, label: `${pos.n}^${pos.b} (Base y exponente intercambiados)`, isCorrect: false }
    ]);

    const negBases = [2, 3, 4, 5];
    const bNeg = negBases[Math.floor(Math.random() * negBases.length)];
    const negExpr = `(-${bNeg}) · (-${bNeg}) · (-${bNeg})`;
    const negVal = -Math.pow(bNeg, 3);
    const q2Options: ItemOption[] = shuffle([
      { id: `(-${bNeg})^3`, label: `(-${bNeg})^3 (Con paréntesis: base negativa al cubo = ${negVal})`, isCorrect: true },
      { id: `-${bNeg}^3`, label: `-${bNeg}^3 (Sin paréntesis: da exactamente el mismo resultado ${negVal})`, isCorrect: true },
      { id: `(-${bNeg})*3`, label: `(-${bNeg}) · 3 = ${-bNeg * 3} (Multiplicación por 3)`, isCorrect: false },
      { id: `+${bNeg}^3`, label: `+${bNeg}^3 = ${Math.pow(bNeg, 3)} (Resultado positivo incorrecto)`, isCorrect: false }
    ]);

    const sumNonSquareCandidates = [
      { a: 4, k: 3 }, { a: 5, k: 3 }, { a: 5, k: 4 }, { a: 6, k: 3 }, { a: 7, k: 3 }, { a: 8, k: 3 }
    ];
    const sumCand = sumNonSquareCandidates[Math.floor(Math.random() * sumNonSquareCandidates.length)];
    const sumExpr = Array(sumCand.k).fill(sumCand.a.toString()).join(' + ');
    const sumVal = sumCand.a * sumCand.k;
    const q3Options: ItemOption[] = shuffle([
      { id: 'SUM_MULT', label: `Es la multiplicación ${sumCand.a} · ${sumCand.k} = ${sumVal}`, isCorrect: true },
      { id: 'NO_POW', label: `NO equivale a ${sumCand.a}^${sumCand.k} (${Math.pow(sumCand.a, sumCand.k)}) ni a una potencia directa`, isCorrect: true },
      { id: 'POW_FAKE', label: `Es la potencia ${sumCand.a}^${sumCand.k} = ${Math.pow(sumCand.a, sumCand.k)}`, isCorrect: false }
    ]);

    const squareSumCandidates = [
      { m: 2 }, { m: 3 }, { m: 4 }, { m: 5 }
    ];
    const sqCand = squareSumCandidates[Math.floor(Math.random() * squareSumCandidates.length)];
    const sqExpr = Array(sqCand.m).fill(sqCand.m.toString()).join(' + ');
    const sqVal = sqCand.m * sqCand.m;
    const q4Options: ItemOption[] = shuffle([
      { id: `${sqCand.m}*${sqCand.m}`, label: `${sqCand.m} · ${sqCand.m} (Sumar ${sqCand.m} veces ${sqCand.m} es ${sqCand.m} · ${sqCand.m} = ${sqVal})`, isCorrect: true },
      { id: `${sqCand.m}^2`, label: `${sqCand.m}^2 (Potencia cuadrada: ${sqCand.m} · ${sqCand.m} = ${sqVal})`, isCorrect: true },
      { id: `${sqCand.m}^3`, label: `${sqCand.m}^3 = ${Math.pow(sqCand.m, 3)} (Potencia cúbica incorrecta)`, isCorrect: false }
    ]);

    return [
      {
        id: 'q1',
        title: 'Inscripción Alfa (Multiplicación Repetida)',
        expression: posExpr,
        options: q1Options,
        explanation: `${posExpr} es la multiplicación iterada de la base ${pos.b} repetida ${pos.n} veces, por lo que equivale a la potencia ${pos.b}^${pos.n} = ${posVal}.`
      },
      {
        id: 'q2',
        title: 'Inscripción Beta (Base Negativa)',
        expression: negExpr,
        options: q2Options,
        explanation: `Al ser un exponente impar (3): (-${bNeg})^3 = ${negVal} y -${bNeg}^3 = ${negVal}. ¡Ambas representaciones son matemáticamente iguales a ${negVal}! Debías marcar las dos.`
      },
      {
        id: 'q3',
        title: 'Inscripción Gamma (Suma Repetida vs Potencia)',
        expression: sumExpr,
        options: q3Options,
        explanation: `${sumExpr} es una suma repetida de ${sumCand.k} sumandos: equivale a ${sumCand.a} · ${sumCand.k} = ${sumVal}. No es una potencia directa (${sumCand.a}^${sumCand.k} daría ${Math.pow(sumCand.a, sumCand.k)}).`
      },
      {
        id: 'q4',
        title: 'Inscripción Delta (Suma Cuadrada)',
        expression: sqExpr,
        options: q4Options,
        explanation: `Sumar ${sqCand.m} veces el número ${sqCand.m} equivale a ${sqCand.m} · ${sqCand.m} = ${sqVal}, que coincide exactamente con ${sqCand.m}^2 = ${sqVal}. ¡Ambas opciones son correctas!`
      }
    ];
  }, []);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    q1: [], q2: [], q3: [], q4: []
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleOption = (qId: string, optId: string) => {
    if (submitted) return;
    sound.playClick();
    setShowConfirm(false);
    setSelectedOptions(prev => {
      const current = prev[qId] || [];
      const exists = current.includes(optId);
      const updated = exists ? current.filter(x => x !== optId) : [...current, optId];
      return { ...prev, [qId]: updated };
    });
  };

  const missingQuestionsCount = questions.filter(q => (selectedOptions[q.id] || []).length === 0).length;

  const commitValidation = () => {
    setShowConfirm(false);
    let correctCount = 0;
    const total = questions.length;
    let missedMultiple = false;

    questions.forEach(q => {
      const userSelected = selectedOptions[q.id] || [];
      const correctIds = q.options.filter(o => o.isCorrect).map(o => o.id);

      const allCorrectSelected = correctIds.every(id => userSelected.includes(id));
      const noIncorrectSelected = userSelected.every(id => correctIds.includes(id));

      if (allCorrectSelected && noIncorrectSelected && correctIds.length > 0) {
        correctCount++;
      } else if (correctIds.length > 1 && userSelected.some(id => correctIds.includes(id)) && !allCorrectSelected) {
        missedMultiple = true;
      }
    });

    const percentage = Math.round((correctCount / total) * 100);
    const xp = Math.round((percentage / 100) * 50);

    setSubmitted(true);

    if (percentage === 100) {
      sound.playSuccess();
      setFeedback(`¡Perfección absoluta! Has identificado todas las representaciones matemáticas válidas (${percentage}% de acierto, +${xp} XP).`);
    } else if (percentage >= 75) {
      sound.playSuccess();
      setFeedback(`¡Gran precisión! Has superado la cámara con un ${percentage}% de acierto (+${xp} XP). Revisa las soluciones explicadas antes de avanzar.`);
    } else {
      sound.playError();
      if (missedMultiple) {
        setFeedback(`Se detectaron respuestas incompletas (${percentage}%). Cuando hay varias opciones matemáticamente válidas, debes marcar todas ellas.`);
      } else {
        setFeedback(`Se detectaron errores en la clasificación (${percentage}%). Revisa la diferencia entre suma repetida y multiplicación repetida.`);
      }
    }
  };

  const handleValidateClick = () => {
    sound.playClick();
    if (missingQuestionsCount > 0) {
      setShowConfirm(true);
      return;
    }
    commitValidation();
  };

  const handleProceed = () => {
    let correctCount = 0;
    const total = questions.length;

    questions.forEach(q => {
      const userSelected = selectedOptions[q.id] || [];
      const correctIds = q.options.filter(o => o.isCorrect).map(o => o.id);
      const allCorrectSelected = correctIds.every(id => userSelected.includes(id));
      const noIncorrectSelected = userSelected.every(id => correctIds.includes(id));
      if (allCorrectSelected && noIncorrectSelected && correctIds.length > 0) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / total) * 100);
    const xp = Math.round((percentage / 100) * 50);

    onComplete({ correct: correctCount, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Cámara 1: ¿Potencia o Suma Repetida?
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Distingue multiplicación repetida de suma repetida · Selecciona <span className="text-[#D4AF37] font-semibold">todas las opciones válidas</span>
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Desafío Aleatorio</span>
        </span>
      </div>

      {/* Multi-Select Instruction Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-[#1C150F]/90 border border-[#D4AF37]/45 text-xs text-slate-200 flex items-start gap-3 shadow-lg">
        <CheckSquare className="w-5 h-5 shrink-0 text-[#D4AF37] mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white text-sm block mb-0.5">Regla de Selección Múltiple:</strong>
          Si una inscripción tiene <strong>más de una opción matemáticamente equivalente</strong> (por ejemplo, para <FormatMath expr="(-2)(-2)(-2)" className="text-[#00E5FF]" /> tanto <FormatMath expr="(-2)^3" className="text-[#D4AF37]" /> como <FormatMath expr="-2^3" className="text-[#D4AF37]" /> son válidas, o para <FormatMath expr="3+3+3" className="text-[#00E5FF]" /> tanto <FormatMath expr="3·3" className="text-[#D4AF37]" /> como <FormatMath expr="3^2" className="text-[#D4AF37]" /> son válidas), <strong>debes marcar todas las casillas correctas</strong>.
        </div>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {questions.map((q) => {
          const userSelected = selectedOptions[q.id] || [];
          const correctIds = q.options.filter(o => o.isCorrect).map(o => o.id);
          const isItemFullSuccess = submitted && 
            correctIds.every(id => userSelected.includes(id)) && 
            userSelected.every(id => correctIds.includes(id));
          const hasMultipleCorrect = correctIds.length > 1;

          return (
            <div 
              key={q.id} 
              className={`border rounded-2xl p-5 shadow-lg transition-all ${
                submitted
                  ? isItemFullSuccess
                    ? 'bg-[#00FF88]/10 border-[#00FF88]/60 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                    : 'bg-[#EF4444]/10 border-[#EF4444]/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-[#1C150F]/90 border-[#D4AF37]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <span className="text-xs text-[#D4AF37] font-semibold">{q.title}</span>
                {hasMultipleCorrect && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/35 font-semibold flex items-center gap-1 shrink-0">
                    <Info className="w-3 h-3" />
                    <span>Múltiples válidas</span>
                  </span>
                )}
              </div>

              <div className="font-mono-math text-xl text-white font-bold mb-3 p-3 bg-[#120E0A] rounded-xl text-center border border-[#D4AF37]/25 shadow-inner">
                {q.expression}
              </div>

              <div className="space-y-2 text-xs">
                {q.options.map(opt => {
                  const isChecked = userSelected.includes(opt.id);
                  const isCorrectAnswer = opt.isCorrect;

                  let borderClass = isChecked
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm'
                    : 'bg-[#120E0A] hover:bg-[#251C14] text-slate-300 border-[#D4AF37]/15';
                  if (submitted) {
                    if (isCorrectAnswer) {
                      borderClass = 'bg-[#00FF88]/15 border-[#00FF88] text-white font-semibold';
                    } else if (isChecked && !isCorrectAnswer) {
                      borderClass = 'bg-[#EF4444]/15 border-[#EF4444] text-[#FCA5A5] line-through';
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(q.id, opt.id)}
                      role="checkbox"
                      aria-checked={isChecked}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors border select-none ${borderClass}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        disabled={submitted}
                        className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer mt-0.5 shrink-0 pointer-events-none"
                      />
                      <span className="text-xs leading-snug flex-1">
                        <FormatMath expr={opt.label} className="font-sans" />
                      </span>
                      {submitted && isCorrectAnswer && (
                        <span className="text-[10px] text-[#00FF88] font-bold shrink-0">✓ Válida</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 text-[11px] text-slate-400">
                <span>{userSelected.length} opción(es) seleccionada(s)</span>
              </div>

              {submitted && (
                <div className="text-[11px] mt-3 pt-2.5 border-t border-[#D4AF37]/20 text-slate-200 leading-relaxed bg-[#120E0A]/70 p-2.5 rounded-lg">
                  <strong className="text-[#D4AF37]">Explicación: </strong>
                  <FormatMath expr={q.explanation} className="font-sans" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showConfirm && !submitted && (
        <ConfirmSubmitBanner
          missingCount={missingQuestionsCount}
          onCancel={() => setShowConfirm(false)}
          onConfirm={commitValidation}
        />
      )}

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
          submitted && (feedback.includes('Perfección') || feedback.includes('precisión'))
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && (feedback.includes('precisión') || feedback.includes('Perfección')) ? (
            <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-[#EF4444]" />
          )}
          <div className="leading-relaxed">{feedback}</div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!submitted ? (
          <button
            onClick={handleValidateClick}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Validar Inscripciones (Definitivo)</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Avanzar a la Gran Estela de Nodos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
