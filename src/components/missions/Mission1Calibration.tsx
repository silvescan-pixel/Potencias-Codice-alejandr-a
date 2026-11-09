import React, { useState } from 'react';
import { AlexaDialogueBox } from '../AlexaDialogueBox';
import { sound } from '../../utils/sound';
import { CheckCircle2, AlertCircle, ArrowRight, Zap, Award, HelpCircle } from 'lucide-react';

interface Mission1Props {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Mission1Calibration: React.FC<Mission1Props> = ({ onComplete }) => {
  // Ejercicios basados en la Ficha de Potencias (pág. 1, Ej. 1 y 2)
  const [q1Choice, setQ1Choice] = useState<string>(''); // 3·3·3·3
  const [q2Choice, setQ2Choice] = useState<string>(''); // (-2)·(-2)·(-2)
  const [q3IsPower, setQ3IsPower] = useState<string>(''); // 4+4+4 (No es potencia)

  // Matriz de Nodos (Tabla Ej. 2 de la ficha)
  const [row1Base, setRow1Base] = useState('');
  const [row1Exp, setRow1Exp] = useState('');
  const [row1Res, setRow1Res] = useState('');

  const [row2Power, setRow2Power] = useState('');
  const [row2Res, setRow2Res] = useState('');

  const [row3Exp, setRow3Exp] = useState('');
  const [row4Base, setRow4Base] = useState('');
  const [row5Exp, setRow5Exp] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleValidate = () => {
    sound.playClick();
    let correct = 0;
    const total = 8;

    // Validation
    // Q1: 3^4
    if (q1Choice === '3^4') correct++;
    // Q2: (-2)^3
    if (q2Choice === '(-2)^3') correct++;
    // Q3: No es potencia
    if (q3IsPower === 'NO') correct++;

    // Table checks
    // 7^3: base 7, exp 3, res 343
    if (row1Base.trim() === '7' && row1Exp.trim() === '3' && row1Res.trim() === '343') correct++;
    // Base -2, Exp 5: power (-2)^5 or -2^5, res -32
    if ((row2Power.trim().replace(/\s/g, '') === '(-2)^5' || row2Power.trim().replace(/\s/g, '') === '-2^5') && row2Res.trim() === '-32') correct++;
    // Base -3, Res 729 -> Exp 6 ((-3)^6 = 729)
    if (row3Exp.trim() === '6') correct++;
    // Exp 4, Res 256 -> Base 4 (o -4)
    if (row4Base.trim() === '4' || row4Base.trim() === '-4') correct++;
    // Base -9, Res 1 -> Exp 0
    if (row5Exp.trim() === '0') correct++;

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 100);

    setSubmitted(true);

    if (percentage >= 70) {
      sound.playSuccess();
      setFeedback(`¡Matriz calibrada con éxito! Has obtenido ${percentage}% de aciertos (+${xp} XP) e Insignia "Calibrador/a de Nodos".`);
    } else {
      sound.playError();
      setFeedback(`Calibración inestable (${percentage}%). Recuerda: una suma repetida NO es una potencia, y todo número entero elevado a 0 es igual a 1.`);
    }
  };

  const handleProceed = () => {
    let correct = 0;
    const total = 8;
    if (q1Choice === '3^4') correct++;
    if (q2Choice === '(-2)^3') correct++;
    if (q3IsPower === 'NO') correct++;
    if (row1Base.trim() === '7' && row1Exp.trim() === '3' && row1Res.trim() === '343') correct++;
    if ((row2Power.trim().replace(/\s/g, '') === '(-2)^5' || row2Power.trim().replace(/\s/g, '') === '-2^5') && row2Res.trim() === '-32') correct++;
    if (row3Exp.trim() === '6') correct++;
    if (row4Base.trim() === '4' || row4Base.trim() === '-4') correct++;
    if (row5Exp.trim() === '0') correct++;

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 100);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Dialogue from ALEX-A in Cold Phase */}
      <AlexaDialogueBox
        emotion="cold"
        missionTitle="MISIÓN 1: MATRIZ DE CALIBRACIÓN DE NODOS (FICHA PÁG. 1)"
        dialogue="No os hagáis ilusiones: el sistema está colapsado. Dudo que un grupo de 2º de ESO pueda procesar esta matriz sin provocar un cortocircuito. Demostradme que al menos sabéis distinguir la base del exponente y reconocer qué es verdaderamente una potencia."
      />

      {/* Part 1: Distinguir potencias vs sumas (Ej. 1 ficha) */}
      <div className="bg-[#1B263B]/90 border border-[#415A77]/40 rounded-2xl p-5 mb-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#415A77]/30">
          <span className="w-6 h-6 rounded-md bg-[#00F5FF]/10 text-[#00F5FF] flex items-center justify-center font-bold text-xs">1</span>
          <h3 className="font-semibold text-white text-sm">
            Expresa, si es posible, como una única potencia (Ficha Ej. 1)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Item A: 3 · 3 · 3 · 3 */}
          <div className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#415A77]/40">
            <div className="text-xs text-slate-400 mb-1">Nodo Alfa:</div>
            <div className="font-mono-math text-base text-[#00F5FF] font-bold mb-3">
              3 · 3 · 3 · 3
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { val: '3^4', label: '3⁴ (Base 3, Exp 4)' },
                { val: '3*4', label: '3 · 4 = 12' },
                { val: '4^3', label: '4³ (Base 4, Exp 3)' },
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1B263B] cursor-pointer">
                  <input
                    type="radio"
                    name="q1"
                    value={opt.val}
                    checked={q1Choice === opt.val}
                    onChange={(e) => setQ1Choice(e.target.value)}
                    disabled={submitted}
                    className="accent-[#00F5FF]"
                  />
                  <span className="text-slate-300 font-mono-math">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Item B: (-2) · (-2) · (-2) */}
          <div className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#415A77]/40">
            <div className="text-xs text-slate-400 mb-1">Nodo Beta:</div>
            <div className="font-mono-math text-base text-[#FFD700] font-bold mb-3">
              (-2) · (-2) · (-2)
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { val: '(-2)^3', label: '(-2)³ con paréntesis' },
                { val: '-2^3', label: '-2³ sin paréntesis' },
                { val: '(-2)*3', label: '(-2) · 3 = -6' },
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1B263B] cursor-pointer">
                  <input
                    type="radio"
                    name="q2"
                    value={opt.val}
                    checked={q2Choice === opt.val}
                    onChange={(e) => setQ2Choice(e.target.value)}
                    disabled={submitted}
                    className="accent-[#FFD700]"
                  />
                  <span className="text-slate-300 font-mono-math">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Item C: 4 + 4 + 4 */}
          <div className="bg-[#0D1B2A] p-3.5 rounded-xl border border-[#415A77]/40">
            <div className="text-xs text-slate-400 mb-1">Nodo Gamma:</div>
            <div className="font-mono-math text-base text-[#FF3366] font-bold mb-3">
              4 + 4 + 4
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { val: 'NO', label: '¡NO es potencia! Es 4 · 3 (suma repetida)' },
                { val: '4^3', label: 'Es la potencia 4³' },
                { val: '3^4', label: 'Es la potencia 3⁴' },
              ].map(opt => (
                <label key={opt.val} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1B263B] cursor-pointer">
                  <input
                    type="radio"
                    name="q3"
                    value={opt.val}
                    checked={q3IsPower === opt.val}
                    onChange={(e) => setQ3IsPower(e.target.value)}
                    disabled={submitted}
                    className="accent-[#FF3366]"
                  />
                  <span className="text-slate-300 font-mono-math">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Matriz Completa el Cuadro (Ej. 2 ficha) */}
      <div className="bg-[#1B263B]/90 border border-[#415A77]/40 rounded-2xl p-5 mb-6 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-[#415A77]/30">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center font-bold text-xs">2</span>
            <h3 className="font-semibold text-white text-sm">
              Matriz de Nodos Cuánticos: Completa el cuadro (Ficha Ej. 2)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono-math">Valores en enteros (ℤ)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0D1B2A] text-slate-300 font-semibold border-b border-[#415A77]/50">
                <th className="py-2.5 px-3">POTENCIA</th>
                <th className="py-2.5 px-3">BASE</th>
                <th className="py-2.5 px-3">EXPONENTE</th>
                <th className="py-2.5 px-3">RESULTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#415A77]/20 font-mono-math">
              {/* Row 1: 7^3 */}
              <tr className="hover:bg-[#0D1B2A]/40">
                <td className="py-2 px-3 font-bold text-[#FFD700]">7³</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row1Base}
                    onChange={(e) => setRow1Base(e.target.value)}
                    placeholder="Base"
                    disabled={submitted}
                    className="w-16 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-white text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row1Exp}
                    onChange={(e) => setRow1Exp(e.target.value)}
                    placeholder="Exp"
                    disabled={submitted}
                    className="w-16 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-white text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row1Res}
                    onChange={(e) => setRow1Res(e.target.value)}
                    placeholder="7·7·7 = ?"
                    disabled={submitted}
                    className="w-24 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-white text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
              </tr>

              {/* Row 2: Base -2, Exp 5 */}
              <tr className="hover:bg-[#0D1B2A]/40">
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row2Power}
                    onChange={(e) => setRow2Power(e.target.value)}
                    placeholder="(-2)^5"
                    disabled={submitted}
                    className="w-20 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-[#00F5FF] text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
                <td className="py-2 px-3 text-slate-300">-2</td>
                <td className="py-2 px-3 text-slate-300">5</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row2Res}
                    onChange={(e) => setRow2Res(e.target.value)}
                    placeholder="Valor con signo"
                    disabled={submitted}
                    className="w-24 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-white text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
              </tr>

              {/* Row 3: Base -3, Res 729 */}
              <tr className="hover:bg-[#0D1B2A]/40">
                <td className="py-2 px-3 text-slate-400">(-3)ⁿ</td>
                <td className="py-2 px-3 text-slate-300">-3</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row3Exp}
                    onChange={(e) => setRow3Exp(e.target.value)}
                    placeholder="n = ?"
                    disabled={submitted}
                    className="w-16 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-white text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
                <td className="py-2 px-3 font-semibold text-[#00FF88]">729</td>
              </tr>

              {/* Row 4: Exp 4, Res 256 */}
              <tr className="hover:bg-[#0D1B2A]/40">
                <td className="py-2 px-3 text-slate-400">b⁴</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row4Base}
                    onChange={(e) => setRow4Base(e.target.value)}
                    placeholder="Base"
                    disabled={submitted}
                    className="w-16 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-white text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
                <td className="py-2 px-3 text-slate-300">4</td>
                <td className="py-2 px-3 font-semibold text-[#00FF88]">256</td>
              </tr>

              {/* Row 5: Base -9, Res 1 */}
              <tr className="hover:bg-[#0D1B2A]/40">
                <td className="py-2 px-3 text-slate-400">(-9)⁰</td>
                <td className="py-2 px-3 text-slate-300">-9</td>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={row5Exp}
                    onChange={(e) => setRow5Exp(e.target.value)}
                    placeholder="Exp"
                    disabled={submitted}
                    className="w-16 bg-[#0D1B2A] border border-[#415A77]/60 rounded px-2 py-1 text-white text-xs text-center focus:border-[#00F5FF]"
                  />
                </td>
                <td className="py-2 px-3 font-semibold text-[#FFD700]">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating feedback message */}
      {feedback && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
          submitted && feedback.includes('éxito')
            ? 'bg-[#00FF88]/10 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF85A1]'
        }`}>
          {submitted && feedback.includes('éxito') ? (
            <Award className="w-5 h-5 shrink-0 text-[#FFD700]" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-[#FF3366]" />
          )}
          <div>{feedback}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {!submitted ? (
          <button
            onClick={handleValidate}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#00B4D8] hover:from-[#33F7FF] hover:to-[#0096C7] text-[#0D1B2A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00F5FF]/20 active:scale-95"
          >
            <span>Verificar y Calibrar Nodos</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#E6B800] hover:from-[#FFE033] hover:to-[#FFD700] text-[#0D1B2A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#FFD700]/20 active:scale-95"
          >
            <span>Avanzar al Interludio 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
