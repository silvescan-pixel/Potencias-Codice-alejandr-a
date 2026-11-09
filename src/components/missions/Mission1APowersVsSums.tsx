import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
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

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const Mission1APowersVsSums: React.FC<Mission1AProps> = ({ onComplete }) => {
  // Procedural dynamic generation of 4 items with fresh values and shuffled options on EVERY execution
  const questions: QuestionItem[] = useMemo(() => {
    // 1. Positive repeated multiplication generator (e.g. b · b · b · ...)
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
      { id: `${pos.n}^${pos.b}`, label: `${pos.n}^${pos.b} (Bases y exponentes intercambiados)`, isCorrect: false }
    ]);

    // 2. Negative base with odd exponent (e.g. (-2)·(-2)·(-2)) -> BOTH (-b)^3 AND -b^3 ARE EQUAL AND CORRECT!
    const negBases = [2, 3, 4, 5];
    const bNeg = negBases[Math.floor(Math.random() * negBases.length)];
    const negExpr = `(-${bNeg}) · (-${bNeg}) · (-${bNeg})`;
    const negVal = -Math.pow(bNeg, 3);
    const q2Options: ItemOption[] = shuffle([
      { id: `(-${bNeg})^3`, label: `(-${bNeg})³ (Con paréntesis: base entera negativa elevada al cubo = ${negVal})`, isCorrect: true },
      { id: `-${bNeg}^3`, label: `-${bNeg}³ (Sin paréntesis: da exactamente el mismo resultado ${negVal})`, isCorrect: true },
      { id: `(-${bNeg})*3`, label: `(-${bNeg}) · 3 = ${-bNeg * 3} (Multiplicación repetida por 3)`, isCorrect: false },
      { id: `+${bNeg}^3`, label: `+${bNeg}³ = ${Math.pow(bNeg, 3)} (Resultado positivo incorrecto)`, isCorrect: false }
    ]);

    // 3. Repeated non-square sum: e.g. 5+5+5 or 4+4+4 (Sum where number != repetitions)
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

    // 4. Repeated square sum: e.g. 3+3+3 or 4+4+4+4 or 2+2 -> BOTH m · m AND m² ARE EQUAL AND CORRECT!
    const squareSumCandidates = [
      { m: 2 }, { m: 3 }, { m: 4 }, { m: 5 }
    ];
    const sqCand = squareSumCandidates[Math.floor(Math.random() * squareSumCandidates.length)];
    const sqExpr = Array(sqCand.m).fill(sqCand.m.toString()).join(' + ');
    const sqVal = sqCand.m * sqCand.m;
    const q4Options: ItemOption[] = shuffle([
      { id: `${sqCand.m}*${sqCand.m}`, label: `${sqCand.m} · ${sqCand.m} (Sumar ${sqCand.m} veces ${sqCand.m} es ${sqCand.m} · ${sqCand.m} = ${sqVal})`, isCorrect: true },
      { id: `${sqCand.m}^2`, label: `${sqCand.m}² (Potencia cuadrada: ${sqCand.m} · ${sqCand.m} = ${sqVal})`, isCorrect: true },
      { id: `${sqCand.m}^3`, label: `${sqCand.m}³ = ${Math.pow(sqCand.m, 3)} (Potencia cúbica incorrecta)`, isCorrect: false }
    ]);

    return [
      {
        id: 'q1',
        title: 'Inscripción Alfa (Multiplicación Repetida)',
        expression: posExpr,
        options: q1Options,
        explanation: `${posExpr} es la multiplicación iterada de la base ${pos.b} ${pos.n} veces, por lo que equivale a la potencia ${pos.b}^${pos.n} = ${posVal}.`
      },
      {
        id: 'q2',
        title: 'Inscripción Beta (Base Negativa - ¡Opciones Múltiples!)',
        expression: negExpr,
        options: q2Options,
        explanation: `Al ser un exponente impar (3): (-${bNeg})³ = ${negVal} y -${bNeg}³ = ${negVal}. ¡Ambas representaciones son matemáticamente correctas e iguales a ${negVal}! Debías marcar ambas.`
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
        title: 'Inscripción Delta (Suma Cuadrada - ¡Opciones Múltiples!)',
        expression: sqExpr,
        options: q4Options,
        explanation: `Sumar ${sqCand.m} veces el número ${sqCand.m} equivale a la multiplicación ${sqCand.m} · ${sqCand.m} = ${sqVal}, lo cual es exactamente la definición de la potencia cuadrada ${sqCand.m}² = ${sqVal}. ¡Ambas opciones son correctas!`
      }
    ];
  }, []);

  // Track checked options per question: Record<questionId, string[]>
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({
    q1: [], q2: [], q3: [], q4: []
  });

  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleOption = (qId: string, optId: string) => {
    if (submitted) return;
    sound.playClick();
    setSelectedOptions(prev => {
      const current = prev[qId] || [];
      const exists = current.includes(optId);
      const updated = exists ? current.filter(x => x !== optId) : [...current, optId];
      return { ...prev, [qId]: updated };
    });
  };

  const handleValidate = () => {
    sound.playClick();
    let correctCount = 0;
    const total = questions.length;
    let missedMultiple = false;

    questions.forEach(q => {
      const userSelected = selectedOptions[q.id] || [];
      const correctIds = q.options.filter(o => o.isCorrect).map(o => o.id);

      // Must select ALL correct options AND NO incorrect options
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
      setFeedback(`¡Perfección absoluta! Has identificado TODAS las representaciones matemáticas válidas (${percentage}% de acierto, +${xp} XP). Continuemos.`);
    } else if (percentage >= 75) {
      sound.playSuccess();
      setFeedback(`¡Gran precisión! Has superado la prueba con un ${percentage}% de acierto (+${xp} XP). Revisa las soluciones explicadas.`);
    } else {
      sound.playError();
      if (missedMultiple) {
        setFeedback(`Se detectaron respuestas incompletas (${percentage}%). Recuerda que cuando hay varias opciones matemáticamente correctas (como (-2)³ y -2³, o 3·3 y 3²), ¡debes marcar TODAS las casillas válidas!`);
      } else {
        setFeedback(`Se detectaron respuestas incorrectas o incompletas (${percentage}%). Recuerda distinguir entre suma repetida y multiplicación repetida, y marcar todas las opciones correctas.`);
      }
    }
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
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Misión 1 (Parte A): ¿Potencia o Suma Repetida?
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Distingue multiplicación iterada de suma iterada · Selecciona <span className="text-[#D4AF37] font-semibold">TODAS las opciones válidas</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aleatorio</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            Fase 1.A de 1.B
          </span>
        </div>
      </div>

      {/* Prominent Multi-Select Instruction Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 to-[#8C6D1F]/15 border-2 border-[#D4AF37]/50 text-xs text-[#FFF0A0] flex items-start gap-3 shadow-lg">
        <CheckSquare className="w-5 h-5 shrink-0 text-[#D4AF37] mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white text-sm block mb-0.5">Regla de Selección Múltiple:</strong>
          Si una expresión tiene <strong>más de una opción matemáticamente correcta</strong> (por ejemplo, para <span className="font-mono-math text-[#00E5FF]">(-2)(-2)(-2)</span> tanto <span className="font-mono-math text-[#D4AF37]">(-2)³</span> como <span className="font-mono-math text-[#D4AF37]">-2³</span> son válidas, o para <span className="font-mono-math text-[#00E5FF]">3+3+3</span> tanto <span className="font-mono-math text-[#D4AF37]">3·3</span> como <span className="font-mono-math text-[#D4AF37]">3²</span> son válidas), <strong>debes marcar TODAS las opciones correctas</strong> para validar la respuesta.
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
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#D4AF37] font-semibold font-mono">{q.title}</span>
                {hasMultipleCorrect && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-semibold flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>Múltiples correctas</span>
                  </span>
                )}
              </div>

              {/* Math expression display */}
              <div className="font-mono-math text-xl text-white font-bold mb-3 p-3 bg-[#120E0A] rounded-xl text-center border border-[#D4AF37]/25 shadow-inner">
                {q.expression}
              </div>

              {/* Options list */}
              <div className="space-y-2 text-xs">
                {q.options.map(opt => {
                  const isChecked = userSelected.includes(opt.id);
                  const isCorrectAnswer = opt.isCorrect;

                  let borderClass = isChecked ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white shadow-sm' : 'bg-[#120E0A] hover:bg-[#251C14] text-slate-300 border-[#D4AF37]/15';
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
                        onChange={() => {}} // handled by parent div onClick
                        disabled={submitted}
                        className="w-4 h-4 rounded accent-[#D4AF37] cursor-pointer mt-0.5 shrink-0 pointer-events-none"
                      />
                      <span className="font-mono-math text-xs leading-snug flex-1">
                        {opt.label}
                      </span>
                      {submitted && isCorrectAnswer && (
                        <span className="text-[10px] text-[#00FF88] font-bold shrink-0">✓ Correcta</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 text-[11px] text-slate-400 flex justify-between items-center">
                <span>{userSelected.length} de {correctIds.length} correcta(s) marcada(s)</span>
              </div>

              {submitted && (
                <div className="text-[11px] mt-3 pt-2.5 border-t border-[#D4AF37]/20 text-slate-200 leading-relaxed bg-[#120E0A]/60 p-2 rounded-lg">
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
          submitted && feedback.includes('Perfección') || feedback.includes('precisión')
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
            onClick={handleValidate}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Verificar Respuestas</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Pasar a la Parte B (Tabla de Nodos)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
