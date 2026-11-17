import React, { useState, useMemo } from 'react';
import { sound } from '../../utils/sound';
import { PowerInput } from '../PowerInput';
import { FormatMath, MathPower } from '../MathDisplay';
import { ConfirmSubmitBanner } from '../ConfirmSubmitBanner';
import { cleanMathToken, validatePowerAnswer } from '../../utils/powerValidation';
import { Zap, ArrowRight, Award, AlertCircle, RefreshCw } from 'lucide-react';

interface Mission1BProps {
  onComplete: (score: { correct: number; total: number; percentage: number; xp: number }) => void;
}

export const Mission1BBlankMatrix: React.FC<Mission1BProps> = ({ onComplete }) => {
  const matrixData = useMemo(() => {
    const r1Bases = [5, 6, 7, 8, 9, 10];
    const r1Exps = [2, 3];
    const b1 = r1Bases[Math.floor(Math.random() * r1Bases.length)];
    const e1 = (b1 >= 8) ? 2 : r1Exps[Math.floor(Math.random() * r1Exps.length)];
    const res1 = Math.pow(b1, e1).toString();

    const r2Bases = [2, 3, 4, 5];
    const r2Exps = [3, 5];
    const b2 = r2Bases[Math.floor(Math.random() * r2Bases.length)];
    const e2 = (b2 >= 4) ? 3 : r2Exps[Math.floor(Math.random() * r2Exps.length)];
    const res2 = (-Math.pow(b2, e2)).toString();

    const r3Pairs = [
      { b: 2, e: 6, res: 64 },
      { b: 3, e: 4, res: 81 },
      { b: 4, e: 4, res: 256 },
      { b: 5, e: 4, res: 625 },
      { b: 2, e: 4, res: 16 },
      { b: 3, e: 6, res: 729 },
    ];
    const p3 = r3Pairs[Math.floor(Math.random() * r3Pairs.length)];

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

    const r5Bases = [4, 6, 7, 8, 9, 11, 12, 15];
    const b5 = r5Bases[Math.floor(Math.random() * r5Bases.length)];

    return {
      r1: { base: b1.toString(), exp: e1.toString(), res: res1 },
      r2: { base: `-${b2}`, baseCanon: `(-${b2})`, exp: e2.toString(), res: res2 },
      r3: { base: `-${p3.b}`, baseCanon: `(-${p3.b})`, res: p3.res.toString(), exp: p3.e.toString() },
      r4: { exp: p4.e.toString(), res: p4.res.toString(), base: p4.b.toString() },
      r5: { base: `-${b5}`, baseCanon: `(-${b5})`, res: '1', exp: '0' },
    };
  }, []);

  const [r1Base, setR1Base] = useState('');
  const [r1Exp, setR1Exp] = useState('');
  const [r1Res, setR1Res] = useState('');

  const [r2PotBase, setR2PotBase] = useState('');
  const [r2PotExp, setR2PotExp] = useState('');
  const [r2Res, setR2Res] = useState('');

  const [r3PotBase, setR3PotBase] = useState('');
  const [r3PotExp, setR3PotExp] = useState('');
  const [r3Exp, setR3Exp] = useState('');

  const [r4PotBase, setR4PotBase] = useState('');
  const [r4PotExp, setR4PotExp] = useState('');
  const [r4Base, setR4Base] = useState('');

  const [r5PotBase, setR5PotBase] = useState('');
  const [r5PotExp, setR5PotExp] = useState('');
  const [r5Exp, setR5Exp] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const clean = (s: string) => cleanMathToken(s);

  const evaluateScore = () => {
    let correct = 0;
    const total = 11;

    const r1BaseOk = clean(r1Base).replace(/^\+/, '') === matrixData.r1.base;
    const r1ExpOk = clean(r1Exp).replace(/^\+/, '') === matrixData.r1.exp;
    const r1ResOk = clean(r1Res).replace(/^\+/, '') === matrixData.r1.res;
    if (r1BaseOk) correct++;
    if (r1ExpOk) correct++;
    if (r1ResOk) correct++;

    const r2PotCheck = validatePowerAnswer(r2PotBase, r2PotExp, matrixData.r2.baseCanon, matrixData.r2.exp);
    const r2PotOk = r2PotCheck.isValid;
    const r2ResOk = clean(r2Res) === matrixData.r2.res;
    if (r2PotOk) correct++;
    if (r2ResOk) correct++;

    const r3PotCheck = validatePowerAnswer(r3PotBase, r3PotExp, matrixData.r3.baseCanon, matrixData.r3.exp);
    const r3PotOk = r3PotCheck.isValid;
    const r3ExpOk = clean(r3Exp).replace(/^\+/, '') === matrixData.r3.exp;
    if (r3PotOk) correct++;
    if (r3ExpOk) correct++;

    const r4PotCheck = validatePowerAnswer(r4PotBase, r4PotExp, matrixData.r4.base, matrixData.r4.exp);
    const r4PotOk = r4PotCheck.isValid;
    const r4BaseOk = clean(r4Base).replace(/^\+/, '') === matrixData.r4.base;
    if (r4PotOk) correct++;
    if (r4BaseOk) correct++;

    const r5PotCheck = validatePowerAnswer(r5PotBase, r5PotExp, matrixData.r5.baseCanon, '0');
    const r5PotOk = r5PotCheck.isValid;
    const r5ExpOk = clean(r5Exp) === '0';
    if (r5PotOk) correct++;
    if (r5ExpOk) correct++;

    const percentage = Math.round((correct / total) * 100);
    const xp = Math.round((percentage / 100) * 100);

    return {
      correct, total, percentage, xp,
      flags: {
        r1BaseOk, r1ExpOk, r1ResOk,
        r2PotOk, r2ResOk,
        r3PotOk, r3ExpOk, r3MissingParens: r3PotCheck.missingParensError,
        r4PotOk, r4BaseOk,
        r5PotOk, r5ExpOk, r5MissingParens: r5PotCheck.missingParensError
      }
    };
  };

  const missingCellsCount = [
    clean(r1Base), clean(r1Exp), clean(r1Res),
    clean(r2PotBase) && clean(r2PotExp) ? 'ok' : '', clean(r2Res),
    clean(r3PotBase) && clean(r3PotExp) ? 'ok' : '', clean(r3Exp),
    clean(r4PotBase) && clean(r4PotExp) ? 'ok' : '', clean(r4Base),
    clean(r5PotBase) && clean(r5PotExp) ? 'ok' : '', clean(r5Exp),
  ].filter(v => v === '').length;

  const commitValidation = () => {
    setShowConfirm(false);
    const { percentage, xp } = evaluateScore();
    setSubmitted(true);

    if (percentage >= 70) {
      sound.playSuccess();
      setFeedback(`¡Estela de calibración reconstruida con éxito! Has obtenido ${percentage}% de aciertos (+${xp} XP). Insignia "Calibrador/a de Nodos" otorgada.`);
    } else {
      sound.playError();
      setFeedback(`Se detectaron casillas erróneas (${percentage}%). Revisa abajo las soluciones de cada fila, especialmente los signos negativos y el exponente 0.`);
    }
  };

  const handleValidateClick = () => {
    sound.playClick();
    if (missingCellsCount > 0) {
      setShowConfirm(true);
      return;
    }
    commitValidation();
  };

  const handleProceed = () => {
    const { correct, total, percentage, xp } = evaluateScore();
    onComplete({ correct, total, percentage, xp });
  };

  const { flags } = evaluateScore();

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Cámara 2: La Gran Estela de Nodos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deducción completa de potencia, base, exponente y resultado en enteros (ℤ)
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center gap-1.5 self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Valores Aleatorios</span>
        </span>
      </div>

      <div className="bg-[#1C150F]/90 border border-[#D4AF37]/40 rounded-2xl p-5 sm:p-6 mb-6 shadow-2xl overflow-hidden">
        <div className="text-xs text-slate-300 mb-5 leading-relaxed">
          Completa los huecos en blanco deduciendo la relación entre <span className="text-[#D4AF37] font-semibold">Potencia</span>, <span className="text-[#D4AF37] font-semibold">Base</span>, <span className="text-[#D4AF37] font-semibold">Exponente</span> y <span className="text-[#D4AF37] font-semibold">Resultado</span>. Para introducir una potencia, escribe su <strong>base</strong> en la casilla inferior y su <strong>exponente</strong> en la casilla superior derecha.
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
                <td className="py-3.5 px-4 font-bold text-white text-lg">
                  <MathPower base={matrixData.r1.base} exp={matrixData.r1.exp} />
                </td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={r1Base}
                    onChange={(e) => { setR1Base(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    placeholder="?"
                    className={`w-20 border-2 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold focus:outline-none ${
                      submitted
                        ? flags.r1BaseOk ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                        : 'bg-[#120E0A] border-[#D4AF37]/40 text-white focus:border-[#00E5FF]'
                    }`}
                  />
                </td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={r1Exp}
                    onChange={(e) => { setR1Exp(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    placeholder="?"
                    className={`w-20 border-2 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold focus:outline-none ${
                      submitted
                        ? flags.r1ExpOk ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                        : 'bg-[#120E0A] border-[#D4AF37]/40 text-white focus:border-[#00E5FF]'
                    }`}
                  />
                </td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={r1Res}
                    onChange={(e) => { setR1Res(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    placeholder="?"
                    className={`w-24 border-2 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold focus:outline-none ${
                      submitted
                        ? flags.r1ResOk ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                        : 'bg-[#120E0A] border-[#D4AF37]/40 text-white focus:border-[#00E5FF]'
                    }`}
                  />
                </td>
              </tr>

              {/* Row 2: Given Base & Exp */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3.5 px-4">
                  <PowerInput
                    size="sm"
                    baseValue={r2PotBase}
                    expValue={r2PotExp}
                    onBaseChange={(v) => { setR2PotBase(v); setShowConfirm(false); }}
                    onExpChange={(v) => { setR2PotExp(v); setShowConfirm(false); }}
                    disabled={submitted}
                    status={submitted ? (flags.r2PotOk ? 'correct' : 'wrong') : 'default'}
                  />
                </td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r2.base}</td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r2.exp}</td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={r2Res}
                    onChange={(e) => { setR2Res(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    placeholder="?"
                    className={`w-24 border-2 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold focus:outline-none ${
                      submitted
                        ? flags.r2ResOk ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                        : 'bg-[#120E0A] border-[#D4AF37]/40 text-white focus:border-[#00E5FF]'
                    }`}
                  />
                </td>
              </tr>

              {/* Row 3: Given Base & Result */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3.5 px-4">
                  <PowerInput
                    size="sm"
                    baseValue={r3PotBase}
                    expValue={r3PotExp}
                    onBaseChange={(v) => { setR3PotBase(v); setShowConfirm(false); }}
                    onExpChange={(v) => { setR3PotExp(v); setShowConfirm(false); }}
                    disabled={submitted}
                    status={submitted ? (flags.r3PotOk ? 'correct' : 'wrong') : 'default'}
                  />
                </td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r3.base}</td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={r3Exp}
                    onChange={(e) => { setR3Exp(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    placeholder="?"
                    className={`w-20 border-2 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold focus:outline-none ${
                      submitted
                        ? flags.r3ExpOk ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                        : 'bg-[#120E0A] border-[#D4AF37]/40 text-white focus:border-[#00E5FF]'
                    }`}
                  />
                </td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r3.res}</td>
              </tr>

              {/* Row 4: Given Exp & Result */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3.5 px-4">
                  <PowerInput
                    size="sm"
                    baseValue={r4PotBase}
                    expValue={r4PotExp}
                    onBaseChange={(v) => { setR4PotBase(v); setShowConfirm(false); }}
                    onExpChange={(v) => { setR4PotExp(v); setShowConfirm(false); }}
                    disabled={submitted}
                    status={submitted ? (flags.r4PotOk ? 'correct' : 'wrong') : 'default'}
                  />
                </td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={r4Base}
                    onChange={(e) => { setR4Base(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    placeholder="?"
                    className={`w-20 border-2 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold focus:outline-none ${
                      submitted
                        ? flags.r4BaseOk ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                        : 'bg-[#120E0A] border-[#D4AF37]/40 text-white focus:border-[#00E5FF]'
                    }`}
                  />
                </td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r4.exp}</td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r4.res}</td>
              </tr>

              {/* Row 5: Given Base & Result 1 */}
              <tr className="hover:bg-[#120E0A]/40">
                <td className="py-3.5 px-4">
                  <PowerInput
                    size="sm"
                    baseValue={r5PotBase}
                    expValue={r5PotExp}
                    onBaseChange={(v) => { setR5PotBase(v); setShowConfirm(false); }}
                    onExpChange={(v) => { setR5PotExp(v); setShowConfirm(false); }}
                    disabled={submitted}
                    status={submitted ? (flags.r5PotOk ? 'correct' : 'wrong') : 'default'}
                  />
                </td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r5.base}</td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    value={r5Exp}
                    onChange={(e) => { setR5Exp(e.target.value); setShowConfirm(false); }}
                    disabled={submitted}
                    placeholder="?"
                    className={`w-20 border-2 rounded-lg px-2.5 py-1.5 text-center text-sm font-bold focus:outline-none ${
                      submitted
                        ? flags.r5ExpOk ? 'bg-[#00FF88]/10 border-[#00FF88] text-white' : 'bg-[#EF4444]/10 border-[#EF4444] text-[#FCA5A5]'
                        : 'bg-[#120E0A] border-[#D4AF37]/40 text-white focus:border-[#00E5FF]'
                    }`}
                  />
                </td>
                <td className="py-3.5 px-4 font-bold text-white text-base">{matrixData.r5.res}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed post-submission correction panel */}
        {submitted && (
          <div className="mt-5 pt-4 border-t border-[#D4AF37]/25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
            <div className="bg-[#120E0A] p-3 rounded-xl border border-[#D4AF37]/20">
              <div className="text-[#D4AF37] font-semibold mb-1">Fila 1</div>
              <div className="text-slate-200"><MathPower base={matrixData.r1.base} exp={matrixData.r1.exp} /> = {matrixData.r1.res}</div>
              <div className="text-[11px] text-slate-400">Base {matrixData.r1.base}, Exp {matrixData.r1.exp}</div>
            </div>
            <div className="bg-[#120E0A] p-3 rounded-xl border border-[#D4AF37]/20">
              <div className="text-[#D4AF37] font-semibold mb-1">Fila 2</div>
              <div className="text-slate-200"><MathPower base={matrixData.r2.baseCanon} exp={matrixData.r2.exp} /> = {matrixData.r2.res}</div>
              <div className="text-[11px] text-slate-400">Exp impar → negativo</div>
            </div>
            <div className="bg-[#120E0A] p-3 rounded-xl border border-[#D4AF37]/20">
              <div className="text-[#D4AF37] font-semibold mb-1">Fila 3</div>
              <div className="text-slate-200"><MathPower base={matrixData.r3.baseCanon} exp={matrixData.r3.exp} /> = {matrixData.r3.res}</div>
              <div className="text-[11px] text-slate-400">Exponente: {matrixData.r3.exp}</div>
              {flags.r3MissingParens && (
                <div className="text-[10px] text-[#FCA5A5] mt-1 leading-snug">
                  Faltan paréntesis: <FormatMath expr={`${matrixData.r3.base}^${matrixData.r3.exp} = -${matrixData.r3.res} ≠ ${matrixData.r3.res}`} className="font-sans" />
                </div>
              )}
            </div>
            <div className="bg-[#120E0A] p-3 rounded-xl border border-[#D4AF37]/20">
              <div className="text-[#D4AF37] font-semibold mb-1">Fila 4</div>
              <div className="text-slate-200"><MathPower base={matrixData.r4.base} exp={matrixData.r4.exp} /> = {matrixData.r4.res}</div>
              <div className="text-[11px] text-slate-400">Base: {matrixData.r4.base}</div>
            </div>
            <div className="bg-[#120E0A] p-3 rounded-xl border border-[#D4AF37]/20">
              <div className="text-[#D4AF37] font-semibold mb-1">Fila 5</div>
              <div className="text-slate-200"><MathPower base={matrixData.r5.baseCanon} exp="0" /> = 1</div>
              <div className="text-[11px] text-slate-400">Todo n.º ≠ 0 elevado a 0 es 1</div>
              {flags.r5MissingParens && (
                <div className="text-[10px] text-[#FCA5A5] mt-1 leading-snug">
                  Faltan paréntesis: <FormatMath expr={`${matrixData.r5.base}^0 = -1 ≠ 1`} className="font-sans" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showConfirm && !submitted && (
        <ConfirmSubmitBanner
          missingCount={missingCellsCount}
          onCancel={() => setShowConfirm(false)}
          onConfirm={commitValidation}
        />
      )}

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
            onClick={handleValidateClick}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95"
          >
            <span>Verificar Estela de Nodos (Definitivo)</span>
            <Zap className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleProceed}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95"
          >
            <span>Avanzar al Acueducto Exponencial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
