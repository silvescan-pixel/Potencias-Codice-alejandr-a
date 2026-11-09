import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
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
  // Procedural dynamic generation of 6 channel items on EVERY execution
  const channels = useMemo<ChannelItem[]>(() => {
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Ch 1: Product of two powers with positive base: b^p · b^q
    const b1 = pick([3, 4, 5, 6, 7]);
    const p1 = randInt(2, 4);
    const q1 = randInt(2, 5);

    // Ch 2: Product with implicit exponent 1: (-b)^p · (-b)
    const b2 = pick([2, 3, 5, 6]);
    const p2 = randInt(2, 5);

    // Ch 3: Product of powers with negative base: (-b)^p · (-b)^q
    const b3 = pick([3, 4, 7, 8]);
    const p3 = randInt(2, 4);
    const q3 = randInt(3, 6);

    // Ch 4: Triple quotient: b^p : b : b^q
    const b4 = pick([2, 3, 5, 7]);
    const q4 = randInt(2, 3);
    const p4 = q4 + randInt(3, 5) + 1;

    // Ch 5: Quotient of negative base: (-b)^p : (-b)^q
    const b5 = pick([2, 4, 5, 6, 9]);
    const q5 = randInt(2, 4);
    const p5 = q5 + randInt(2, 4);

    // Ch 6: Triple product with implicit 1: b^p · b · b^q
    const b6 = pick([2, 3, 5, 10]);
    const p6 = randInt(2, 4);
    const q6 = randInt(2, 4);

    return [
      {
        id: 'ch1',
        operation: `${b1}^${p1} · ${b1}^${q1}`,
        correctBase: b1.toString(),
        correctExp: (p1 + q1).toString(),
        ruleHint: `Producto de la misma base: se suman exponentes (${p1} + ${q1} = ${p1 + q1}) ⟹ ${b1}^${p1 + q1}`
      },
      {
        id: 'ch2',
        operation: `(-${b2})^${p2} · (-${b2})`,
        correctBase: `(-${b2})`,
        correctExp: (p2 + 1).toString(),
        ruleHint: `El factor (-${b2}) tiene exponente 1 implícito: ${p2} + 1 = ${p2 + 1} ⟹ (-${b2})^${p2 + 1}`
      },
      {
        id: 'ch3',
        operation: `(-${b3})^${p3} · (-${b3})^${q3}`,
        correctBase: `(-${b3})`,
        correctExp: (p3 + q3).toString(),
        ruleHint: `Base común (-${b3}): suma de exponentes ${p3} + ${q3} = ${p3 + q3} ⟹ (-${b3})^${p3 + q3}`
      },
      {
        id: 'ch4',
        operation: `${b4}^${p4} : ${b4} : ${b4}^${q4}`,
        correctBase: b4.toString(),
        correctExp: (p4 - 1 - q4).toString(),
        ruleHint: `Cocientes sucesivos: se restan los exponentes ${p4} - 1 - ${q4} = ${p4 - 1 - q4} ⟹ ${b4}^${p4 - 1 - q4}`
      },
      {
        id: 'ch5',
        operation: `(-${b5})^${p5} : (-${b5})^${q5}`,
        correctBase: `(-${b5})`,
        correctExp: (p5 - q5).toString(),
        ruleHint: `Cociente con base (-${b5}): se restan exponentes ${p5} - ${q5} = ${p5 - q5} ⟹ (-${b5})^${p5 - q5}`
      },
      {
        id: 'ch6',
        operation: `${b6}^${p6} · ${b6} · ${b6}^${q6}`,
        correctBase: b6.toString(),
        correctExp: (p6 + 1 + q6).toString(),
        ruleHint: `Producto triple: ${p6} + 1 + ${q6} = ${p6 + 1 + q6} ⟹ ${b6}^${p6 + 1 + q6}`
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

  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInputChange = (id: string, field: 'base' | 'exp', val: string) => {
    if (submitted) return;
    setInputs(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: val }
    }));
  };

  const normalizeBase = (str: string) => str.trim().replace(/\s/g, '');

  const handleValidate = () => {
    sound.playClick();
    let correct = 0;
    const total = channels.length;

    channels.forEach(item => {
      const uBase = normalizeBase(inputs[item.id].base);
      const uExp = inputs[item.id].exp.trim();

      const baseMatches = uBase === item.correctBase || uBase === item.correctBase.replace(/[()]/g, '');
      const expMatches = uExp === item.correctExp;

      if (baseMatches && expMatches) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 200);

    setSubmitted(true);

    if (percentage >= 70) {
      sound.playSuccess();
      setFeedback(`¡Canales sintonizados! Has unificado las frecuencias en formato a^k con un ${percentage}% de acierto (+${xp} XP) e Insignia "Sintonizador/a de Canales".`);
    } else {
      sound.playError();
      setFeedback(`Interferencias detectadas (${percentage}%). En productos se SUMAN exponentes, en cocientes se RESTAN, y si no hay exponente visible vale 1.`);
    }
  };

  const handleProceed = () => {
    let correct = 0;
    const total = channels.length;
    channels.forEach(item => {
      const uBase = normalizeBase(inputs[item.id].base);
      const uExp = inputs[item.id].exp.trim();
      const baseMatches = uBase === item.correctBase || uBase === item.correctBase.replace(/[()]/g, '');
      const expMatches = uExp === item.correctExp;
      if (baseMatches && expMatches) correct++;
    });
    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 200);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Misión 3: La Sintonización de los Canales Primarios
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Producto y Cociente de Potencias con la Misma Base · Formato a^k (Ficha Pág. 1)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Aleatorio</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            6 Terminales a^k
          </span>
        </div>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-semibold text-white text-sm">
              Condensa cada operación en una sola potencia: [ Base ] ^ [ Exponente ]
            </h3>
          </div>
          <span className="text-xs text-[#00E5FF] font-mono-math">Sin desarrollar números</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((item, idx) => {
            const cur = inputs[item.id];
            const uBase = normalizeBase(cur.base);
            const uExp = cur.exp.trim();
            const isMatch = (uBase === item.correctBase || uBase === item.correctBase.replace(/[()]/g, '')) && uExp === item.correctExp;

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
                <div className="text-[11px] text-[#D4AF37] mb-1 font-mono">Canal 0{idx + 1}</div>
                <div className="font-mono-math font-bold text-lg text-white mb-3 text-center py-2 bg-[#1C150F] rounded-lg border border-[#D4AF37]/20">
                  {item.operation}
                </div>

                {/* Double input box Base ^ Exp */}
                <div className="flex items-center justify-center gap-2 mb-2 font-mono-math">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-0.5">Base</span>
                    <input
                      type="text"
                      value={cur.base}
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
                      value={cur.exp}
                      onChange={(e) => handleInputChange(item.id, 'exp', e.target.value)}
                      placeholder="k"
                      disabled={submitted}
                      className="w-14 bg-[#1C150F] border border-[#D4AF37]/50 rounded-lg px-2 py-1.5 text-center text-[#00E5FF] text-sm font-bold focus:border-[#00E5FF] focus:outline-none"
                    />
                  </div>
                </div>

                {submitted && (
                  <div className="text-[11px] mt-2 pt-2 border-t border-[#D4AF37]/20 text-slate-300">
                    <span className="text-[#D4AF37] font-semibold">Solución: </span>
                    <span className="font-mono-math">{item.correctBase}^{item.correctExp}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.ruleHint}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
          submitted && (feedback.includes('éxito') || feedback.includes('sintonizados'))
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
            onClick={handleValidate}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Unificar Canales a^k</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Avanzar al Interludio 2</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
