import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { Zap, ArrowRight, Award, AlertCircle, RefreshCw } from 'lucide-react';

interface Mission1BProps {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Mission1BBlankMatrix: React.FC<Mission1BProps> = ({ onComplete }) => {
  // Procedural dynamic generation of table data on every execution
  const matrixData = useMemo(() => {
    // Row 1: Given Power (positive base)
    const r1Bases = [5, 6, 7, 8, 9, 10];
    const r1Exps = [2, 3];
    const b1 = r1Bases[Math.floor(Math.random() * r1Bases.length)];
    const e1 = (b1 >= 8) ? 2 : r1Exps[Math.floor(Math.random() * r1Exps.length)];
    const pot1 = `${b1}${e1 === 2 ? '²' : '³'}`;
    const res1 = Math.pow(b1, e1).toString();

    // Row 2: Given Base (negative) & Exp (odd)
    const r2Bases = [2, 3, 4, 5];
    const r2Exps = [3, 5];
    const b2 = r2Bases[Math.floor(Math.random() * r2Bases.length)];
    const e2 = (b2 >= 4) ? 3 : r2Exps[Math.floor(Math.random() * r2Exps.length)];
    const res2 = (-Math.pow(b2, e2)).toString();

    // Row 3: Given Base (negative) & Result (positive even power)
    const r3Pairs = [
      { b: 2, e: 6, res: 64 },
      { b: 3, e: 4, res: 81 },
      { b: 4, e: 4, res: 256 },
      { b: 5, e: 4, res: 625 },
      { b: 2, e: 4, res: 16 },
      { b: 3, e: 6, res: 729 },
    ];
    const p3 = r3Pairs[Math.floor(Math.random() * r3Pairs.length)];

    // Row 4: Given Exp & Result
    const r4Pairs = [
      { b: 2, e: 5, res: 32 },
      { b: 3, e: 3, res: 27 },
      { b: 4, e: 3, res: 64 },
      { b: 5, e: 3, res: 125 },
      { b: 6, e: 3, res: 216 },
      { b: 2, e: 7, res: 128 },
      { b: 10, e: 3, res: 1000 }
    ];
    const p4 = r4Pairs[Math.floor(Math.random() * r4Pairs.length)];

    // Row 5: Given Base (negative) & Result 1 (a^0 = 1)
    const r5Bases = [4, 6, 7, 8, 9, 11, 12, 15];
    const b5 = r5Bases[Math.floor(Math.random() * r5Bases.length)];

    return {
      r1: { pot: pot1, base: b1.toString(), exp: e1.toString(), res: res1 },
      r2: { base: `-${b2}`, exp: e2.toString(), pot: `(-${b2})^${e2}`, res: res2 },
      r3: { base: `-${p3.b}`, res: p3.res.toString(), exp: p3.e.toString(), pot: `(-${p3.b})^${p3.e}` },
      r4: { exp: p4.e.toString(), res: p4.res.toString(), base: p4.b.toString(), pot: `${p4.b}^${p4.e}` },
      r5: { base: `-${b5}`, res: '1', exp: '0', pot: `(-${b5})^0` },
    };
  }, []);

  // Blank inputs for user to fill
  const [r1Base, setR1Base] = useState('');
  const [r1Exp, setR1Exp] = useState('');
  const [r1Res, setR1Res] = useState('');

  const [r2Pot, setR2Pot] = useState('');
  const [r2Res, setR2Res] = useState('');

  const [r3Pot, setR3Pot] = useState('');
  const [r3Exp, setR3Exp] = useState('');

  const [r4Pot, setR4Pot] = useState('');
  const [r4Base, setR4Base] = useState('');

  const [r5Pot, setR5Pot] = useState('');
  const [r5Exp, setR5Exp] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const clean = (s: string) => s.trim().replace(/\s/g, '');

  const handleValidate = () => {
    sound.playClick();
    let correct = 0;
    const total = 11;

    // Row 1 checks
    if (clean(r1Base) === matrixData.r1.base) correct++;
    if (clean(r1Exp) === matrixData.r1.exp) correct++;
    if (clean(r1Res) === matrixData.r1.res) correct++;

    // Row 2 checks (Potencia y Resultado)
    const r2PotClean = clean(r2Pot);
    if (r2PotClean === matrixData.r2.pot || r2PotClean === matrixData.r2.pot.replace(/[()]/g, '')) correct++;
    if (clean(r2Res) === matrixData.r2.res) correct++;

    // Row 3 checks (Potencia y Exponente)
    const r3PotClean = clean(r3Pot);
    if (r3PotClean === matrixData.r3.pot || r3PotClean === matrixData.r3.pot.replace(/[()]/g, '')) correct++;
    if (clean(r3Exp) === matrixData.r3.exp) correct++;

    // Row 4 checks (Potencia y Base)
    const r4PotClean = clean(r4Pot);
    if (r4PotClean === matrixData.r4.pot || r4PotClean === `(-${matrixData.r4.base})^${matrixData.r4.exp}`) correct++;
    if (clean(r4Base) === matrixData.r4.base || clean(r4Base) === `-${matrixData.r4.base}`) correct++;

    // Row 5 checks (Potencia y Exponente 0)
    const r5PotClean = clean(r5Pot);
    if (r5PotClean === matrixData.r5.pot || r5PotClean === matrixData.r5.pot.replace(/[()]/g, '')) correct++;
    if (clean(r5Exp) === '0') correct++;

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 100);

    setSubmitted(true);

    if (percentage >= 70) {
      sound.playSuccess();
      setFeedback(`¡Cuadro de calibración completado con éxito! Has obtenido ${percentage}% de aciertos (+${xp} XP). Insignia "Calibrador/a de Nodos" otorgada.`);
    } else {
      sound.playError();
      setFeedback(`Se detectaron casillas erróneas (${percentage}%). Revisa con cuidado las operaciones de potencia y la regla de signos.`);
    }
  };

  const handleProceed = () => {
    let correct = 0;
    const total = 11;
    if (clean(r1Base) === matrixData.r1.base) correct++;
    if (clean(r1Exp) === matrixData.r1.exp) correct++;
    if (clean(r1Res) === matrixData.r1.res) correct++;
    const r2PotClean = clean(r2Pot);
    if (r2PotClean === matrixData.r2.pot || r2PotClean === matrixData.r2.pot.replace(/[()]/g, '')) correct++;
    if (clean(r2Res) === matrixData.r2.res) correct++;
    const r3PotClean = clean(r3Pot);
    if (r3PotClean === matrixData.r3.pot || r3PotClean === matrixData.r3.pot.replace(/[()]/g, '')) correct++;
    if (clean(r3Exp) === matrixData.r3.exp) correct++;
    const r4PotClean = clean(r4Pot);
    if (r4PotClean === matrixData.r4.pot || r4PotClean === `(-${matrixData.r4.base})^${matrixData.r4.exp}`) correct++;
    if (clean(r4Base) === matrixData.r4.base || clean(r4Base) === `-${matrixData.r4.base}`) correct++;
    const r5PotClean = clean(r5Pot);
    if (r5PotClean === matrixData.r5.pot || r5PotClean === matrixData.r5.pot.replace(/[()]/g, '')) correct++;
    if (clean(r5Exp) === '0') correct++;

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 100);

    onComplete({ correct, total, percentage, xp });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Misión 1 (Parte B): Completa el Cuadro
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ficha de Potencias · Ejercicio 2 (Pág. 1) · Valores en enteros (ℤ)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-semibold flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Dinámico</span>
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold">
            Fase 1.B de 1.B
          </span>
        </div>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-6 mb-6 shadow-2xl overflow-hidden">
        <div className="text-xs text-slate-300 mb-4 leading-relaxed">
          Rellena todos los huecos en blanco deduciendo la relación formal entre <span className="text-[#D4AF37] font-semibold">Potencia</span>, <span className="text-[#D4AF37] font-semibold">Base</span>, <span className="text-[#D4AF37] font-semibold">Exponente</span> y <span className="text-[#D4AF37] font-semibold">Resultado</span>. (Para escribir potencias utiliza el formato base^exponente, ej. <span className="font-mono-math text-[#00E5FF]">(-2)^5</span>).
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#120E0A] text-[#D4AF37] font-bold border-b border-[#D4AF37]/40">
                <th className="py-3 px-4 uppercase tracking-wider">POTENCIA</th>
                <th className="py-3 px-4 uppercase tracking-wider">BASE</th>
                <th className="py-3 px-4 uppercase tracking-wider">EXPONENTE</th>
                <th className="py-3 px-4 uppercase tracking-wider">RESULTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15 font-mono-math">
              
              {/* Row 1: Given Power */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r1.pot}</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r1Base}
                    onChange={(e) => setR1Base(e.target.value)}
                    disabled={submitted}
                    className="w-20 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-white text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r1Exp}
                    onChange={(e) => setR1Exp(e.target.value)}
                    disabled={submitted}
                    className="w-20 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-white text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r1Res}
                    onChange={(e) => setR1Res(e.target.value)}
                    disabled={submitted}
                    className="w-24 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-white text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
              </tr>

              {/* Row 2: Given Base & Exp */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r2Pot}
                    onChange={(e) => setR2Pot(e.target.value)}
                    disabled={submitted}
                    className="w-24 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-[#00E5FF] text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r2.base}</td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r2.exp}</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r2Res}
                    onChange={(e) => setR2Res(e.target.value)}
                    disabled={submitted}
                    className="w-24 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-white text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
              </tr>

              {/* Row 3: Given Base & Result */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r3Pot}
                    onChange={(e) => setR3Pot(e.target.value)}
                    disabled={submitted}
                    className="w-24 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-[#00E5FF] text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r3.base}</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r3Exp}
                    onChange={(e) => setR3Exp(e.target.value)}
                    disabled={submitted}
                    className="w-20 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-white text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r3.res}</td>
              </tr>

              {/* Row 4: Given Exp & Result */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r4Pot}
                    onChange={(e) => setR4Pot(e.target.value)}
                    disabled={submitted}
                    className="w-24 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-[#00E5FF] text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r4Base}
                    onChange={(e) => setR4Base(e.target.value)}
                    disabled={submitted}
                    className="w-20 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-white text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r4.exp}</td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r4.res}</td>
              </tr>

              {/* Row 5: Given Base & Result 1 */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r5Pot}
                    onChange={(e) => setR5Pot(e.target.value)}
                    disabled={submitted}
                    className="w-24 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-[#00E5FF] text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r5.base}</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    value={r5Exp}
                    onChange={(e) => setR5Exp(e.target.value)}
                    disabled={submitted}
                    className="w-20 bg-[#120E0A] border border-[#D4AF37]/40 rounded px-2.5 py-1.5 text-white text-center text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-white text-sm">{matrixData.r5.res}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-3 border ${
          submitted && feedback.includes('éxito')
            ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40 text-[#FCA5A5]'
        }`}>
          {submitted && feedback.includes('éxito') ? (
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
            <span>Verificar Matriz de Nodos</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Completar Misión 1 y Avanzar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
