import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { Plus, Minus, Zap, ArrowRight, Award, ShieldAlert, RefreshCw } from 'lucide-react';

interface Mission2CProps {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

interface PolarityItem {
  id: string;
  expression: string;
  correctSign: '+' | '-';
  explanation: string;
}

export const Mission2CPolarity: React.FC<Mission2CProps> = ({ onComplete }) => {
  // Procedural generator that creates 8 fresh dynamic items on each run
  const activeItems = useMemo<PolarityItem[]>(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const b1 = randInt(2, 9);
    const expEven = pick([2, 4, 6, 8]);
    const expOdd = pick([3, 5, 7]);
    const b2 = randInt(2, 9);
    const b3 = randInt(2, 9);
    const b4 = randInt(2, 9);
    const b5 = randInt(5, 15);
    const b6 = randInt(5, 15);
    const b7 = randInt(2, 9);
    const b8 = randInt(2, 6);

    const items: PolarityItem[] = [
      // 1. Negative in parens with even exponent: ALWAYS +
      {
        id: 'p1',
        expression: `(-${b1})^${expEven}`,
        correctSign: '+',
        explanation: `Base negativa con paréntesis y exponente PAR (${expEven}): resultado POSITIVO (+).`
      },
      // 2. Negative without parens with even exponent: ALWAYS -
      {
        id: 'p2',
        expression: `-${b2}^${expEven}`,
        correctSign: '-',
        explanation: `Sin paréntesis: el signo "−" no se eleva a la potencia ${expEven}: resultado NEGATIVO (-).`
      },
      // 3. Negative in parens with odd exponent: ALWAYS -
      {
        id: 'p3',
        expression: `(-${b3})^${expOdd}`,
        correctSign: '-',
        explanation: `Base negativa con exponente IMPAR (${expOdd}): resultado NEGATIVO (-).`
      },
      // 4. Negative without parens with odd exponent: ALWAYS -
      {
        id: 'p4',
        expression: `-${b4}^${expOdd}`,
        correctSign: '-',
        explanation: `Sin paréntesis: - (${b4}^${expOdd}) es NEGATIVO (-).`
      },
      // 5. Negative in parens with exponent 0: ALWAYS +
      {
        id: 'p5',
        expression: `(-${b5})⁰`,
        correctSign: '+',
        explanation: `Todo número entero no nulo elevado a 0 entre paréntesis es +1: POSITIVO (+).`
      },
      // 6. Negative without parens with exponent 0: ALWAYS -
      {
        id: 'p6',
        expression: `-${b6}⁰`,
        correctSign: '-',
        explanation: `¡Trampa clásica de la ficha! Sin paréntesis: - (${b6}⁰) = - (1) = -1: NEGATIVO (-).`
      },
      // 7. Positive base: ALWAYS +
      {
        id: 'p7',
        expression: `(+${b7})^${randInt(2, 5)}`,
        correctSign: '+',
        explanation: `Base positiva: cualquier potencia es estrictamente POSITIVA (+).`
      },
      // 8. Sign product with mixed factors
      {
        id: 'p8',
        expression: `(-${b8})³ · ${b8}² · (-${b8})⁵`,
        correctSign: '+',
        explanation: `Producto de signos: (Negativo) · (Positivo) · (Negativo) = POSITIVO (+).`
      }
    ];

    // Shuffle the 8 items
    return items.sort(() => Math.random() - 0.5);
  }, []);

  const [userSigns, setUserSigns] = useState<Record<string, '+' | '-' | ''>>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSetSign = (id: string, sign: '+' | '-') => {
    if (submitted) return;
    sound.playClick();
    setUserSigns(prev => ({ ...prev, [id]: sign }));
  };

  const handleValidate = () => {
    sound.playClick();
    let correct = 0;
    const total = activeItems.length;

    activeItems.forEach(item => {
      if (userSigns[item.id] === item.correctSign) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 150);

    setSubmitted(true);

    if (percentage >= 75) {
      sound.playSuccess();
      setFeedback(`¡Cámara de polaridad sincronizada! Has obtenido ${percentage}% de precisión (+${xp} XP) e Insignia "Sincronizador/a de Polaridad".`);
    } else {
      sound.playError();
      setFeedback(`Señal invertida (${percentage}%). Revisa con especial atención la diferencia entre (-a)ⁿ y -aⁿ.`);
    }
  };

  const handleProceed = () => {
    let correct = 0;
    const total = activeItems.length;
    activeItems.forEach(item => {
      if (userSigns[item.id] === item.correctSign) correct++;
    });
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 150);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Misión 2.C: La Cámara de Sincronización de Polaridad
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Determinación de Signo en Números Enteros · Ficha Pág. 1 (Ej. 2)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aleatorio</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            8 Terminales
          </span>
        </div>
      </div>

      {/* Grid of Expressions */}
      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D4AF37]/20">
          <h3 className="font-semibold text-white text-sm">
            Selecciona el signo final (+ / −) sin necesidad de calcular valores gigantescos:
          </h3>
          <span className="text-xs text-[#00E5FF] font-mono-math">Paridad de exponente</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {activeItems.map((item, idx) => {
            const currentSign = userSigns[item.id];
            const isCorrect = submitted && currentSign === item.correctSign;
            const isWrong = submitted && currentSign !== item.correctSign;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCorrect
                    ? 'bg-[#00FF88]/10 border-[#00FF88]/60 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                    : isWrong
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                    : 'bg-[#120E0A] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
                }`}
              >
                <div className="text-[11px] text-[#D4AF37] mb-1 font-mono">Terminal 0{idx + 1}</div>
                <div className="font-mono-math font-bold text-lg text-white mb-3 text-center py-1.5 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                  {item.expression}
                </div>

                {/* Sign Selector Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleSetSign(item.id, '+')}
                    disabled={submitted}
                    className={`py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      currentSign === '+'
                        ? 'bg-[#00E5FF] text-[#120E0A] shadow-md shadow-[#00E5FF]/20'
                        : 'bg-[#1C150F] text-slate-300 hover:bg-[#2A2016]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>POSITIVO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetSign(item.id, '-')}
                    disabled={submitted}
                    className={`py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                      currentSign === '-'
                        ? 'bg-[#EF4444] text-white shadow-md shadow-[#EF4444]/20'
                        : 'bg-[#1C150F] text-slate-300 hover:bg-[#2A2016]'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>NEGATIVO</span>
                  </button>
                </div>

                {submitted && (
                  <div className="text-[11px] mt-2 pt-2 border-t border-[#D4AF37]/20 text-slate-300 leading-tight">
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
          submitted && feedback.includes('éxito') || feedback.includes('sincronizada')
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && feedback.includes('sincronizada') ? (
            <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
          ) : (
            <ShieldAlert className="w-5 h-5 shrink-0 text-[#EF4444]" />
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
            <span>Sincronizar Polaridad</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Avanzar a la Misión 3</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
