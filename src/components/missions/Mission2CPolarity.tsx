import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { FormatMath } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
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
      {
        id: 'p1',
        expression: `(-${b1})^${expEven}`,
        correctSign: '+',
        explanation: `Base negativa con paréntesis y exponente PAR (${expEven}): resultado POSITIVO (+).`
      },
      {
        id: 'p2',
        expression: `-${b2}^${expEven}`,
        correctSign: '-',
        explanation: `Sin paréntesis: el signo menos no está afectado por el exponente ${expEven}: resultado NEGATIVO (-).`
      },
      {
        id: 'p3',
        expression: `(-${b3})^${expOdd}`,
        correctSign: '-',
        explanation: `Base negativa con paréntesis y exponente IMPAR (${expOdd}): resultado NEGATIVO (-).`
      },
      {
        id: 'p4',
        expression: `-${b4}^${expOdd}`,
        correctSign: '-',
        explanation: `Sin paréntesis: -(${b4}^${expOdd}) resulta siempre NEGATIVO (-).`
      },
      {
        id: 'p5',
        expression: `(-${b5})^0`,
        correctSign: '+',
        explanation: `Todo número entero no nulo entre paréntesis elevado a 0 vale +1: POSITIVO (+).`
      },
      {
        id: 'p6',
        expression: `-${b6}^0`,
        correctSign: '-',
        explanation: `¡Ojo a los paréntesis! Sin paréntesis: -(${b6}^0) = -(1) = -1: NEGATIVO (-).`
      },
      {
        id: 'p7',
        expression: `(+${b7})^${randInt(2, 5)}`,
        correctSign: '+',
        explanation: `Base positiva: cualquier potencia es estrictamente POSITIVA (+).`
      },
      {
        id: 'p8',
        expression: `(-${b8})^3 · ${b8}^2 · (-${b8})^5`,
        correctSign: '+',
        explanation: `Producto de signos: (Negativo) · (Positivo) · (Negativo) = POSITIVO (+).`
      }
    ];

    return items.sort(() => Math.random() - 0.5);
  }, []);

  const [userSigns, setUserSigns] = useState<Record<string, '+' | '-' | ''>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSetSign = (id: string, sign: '+' | '-') => {
    if (submitted) return;
    sound.playClick();
    setShowConfirm(false);
    setUserSigns(prev => ({ ...prev, [id]: sign }));
  };

  const missingCount = activeItems.filter(item => !userSigns[item.id]).length;

  const commitValidation = () => {
    setShowConfirm(false);
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
      setFeedback(`Señal invertida (${percentage}%). Revisa las explicaciones de cada terminal, especialmente la diferencia entre (-a)^n y -a^n.`);
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
    const total = activeItems.length;
    activeItems.forEach(item => {
      if (userSigns[item.id] === item.correctSign) correct++;
    });
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 150);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Cámara 4: Sincronización de Polaridad
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Determinación de signo en potencias de números enteros
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>8 Terminales Aleatorias</span>
        </span>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-5 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D4AF37]/20">
          <h3 className="font-semibold text-white text-sm">
            Selecciona el signo final (+ o −) sin necesidad de calcular valores gigantescos:
          </h3>
          <span className="text-xs text-[#00E5FF]">Paridad y paréntesis</span>
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
                <div className="text-[11px] text-[#D4AF37] mb-1 font-semibold">Terminal 0{idx + 1}</div>
                <div className="font-mono-math font-bold text-lg text-white mb-3 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                  <FormatMath expr={item.expression} />
                </div>

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
                    <FormatMath expr={item.explanation} className="font-sans" />
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
          submitted && feedback.includes('sincronizada')
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && feedback.includes('sincronizada') ? (
            <Award className="w-5 h-5 shrink-0 text-[#D4AF37]" />
          ) : (
            <ShieldAlert className="w-5 h-5 shrink-0 text-[#EF4444]" />
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
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Sincronizar Polaridad (Definitivo)</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Avanzar a los Canales Primarios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
