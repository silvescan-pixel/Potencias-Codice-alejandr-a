import React, { useEffect } from 'react';
import { StudentProgress } from '../../types/game';
import { ALEXA_PORTRAITS, ROLES_DATA } from '../../data/assets';
import { generatePdfDiploma } from '../../utils/pdfCertificate';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  FileText, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  HeartHandshake, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface OutcomeScreenProps {
  progress: StudentProgress;
  onEnterSecretPhase: () => void;
  onRestart: () => void;
}

export const OutcomeScreen: React.FC<OutcomeScreenProps> = ({
  progress,
  onEnterSecretPhase,
  onRestart,
}) => {
  // Compute global percentage across attempted missions
  const scores = Object.values(progress.missionScores);
  let totalCorrect = 0;
  let totalQuestions = 0;
  scores.forEach(s => {
    totalCorrect += s.correct;
    totalQuestions += s.total;
  });

  const globalPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const isMastery = globalPercentage >= 90;
  const isSatisfactory = globalPercentage >= 60 && globalPercentage < 90;
  const isInsufficient = globalPercentage < 60;

  useEffect(() => {
    if (isMastery) {
      sound.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if canvas-confetti is not loaded
      }
    } else if (isSatisfactory) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  }, [isMastery, isSatisfactory]);

  const role = ROLES_DATA[progress.roleId];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Climax Outcome Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 rounded-2xl bg-[#1C150F] border border-[#D4AF37]/50 mb-4 shadow-xl">
          {isMastery ? (
            <Trophy className="w-12 h-12 text-[#D4AF37] animate-bounce" />
          ) : isSatisfactory ? (
            <HeartHandshake className="w-12 h-12 text-[#00E5FF]" />
          ) : (
            <AlertTriangle className="w-12 h-12 text-[#EF4444] animate-pulse" />
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-2">
          {isMastery && '¡Maestría Absoluta: ALEX-A ha Sobrevivido!'}
          {isSatisfactory && 'El Archivo Salvado: Modo Hibernación de ALEX-A'}
          {isInsufficient && 'Colapso del Cortafuegos: Backup de Emergencia'}
        </h1>

        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Expedición de <span className="text-[#D4AF37] font-bold">{progress.name}</span> ({progress.group}) · {role.title}
        </p>
      </div>

      {/* Narrative Dialogue Card */}
      <div className={`rounded-3xl p-6 mb-8 border-2 shadow-2xl relative overflow-hidden ${
        isMastery 
          ? 'bg-[#1C150F]/95 border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.25)]'
          : isSatisfactory
          ? 'bg-[#1C150F]/95 border-[#00E5FF]/60 shadow-[0_0_25px_rgba(0,229,255,0.2)]'
          : 'bg-[#1C150F]/95 border-[#EF4444]/70 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
      }`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shrink-0 bg-[#120E0A]">
            <img
              src={
                isMastery
                  ? ALEXA_PORTRAITS.enthusiastic
                  : isSatisfactory
                  ? ALEXA_PORTRAITS.enthusiastic
                  : ALEXA_PORTRAITS.critical
              }
              alt="ALEX-A"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-between mb-2">
              <span className="font-bold text-white text-base">ALEX-A · Mensaje de Transmisión Final</span>
              <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                isMastery ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : isSatisfactory ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-[#EF4444]/20 text-[#EF4444]'
              }`}>
                {globalPercentage}% DE EFICACIA GLOBAL
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed italic mb-3">
              {isMastery && (
                `"¡LO HABÉIS CONSEGUIDO, EQUIPO! 😭✨ Mis núcleos vuelven a brillar a plena potencia en el Códice. El Archivo de Alejandría está completamente salvaguardado y habéis demostrado un dominio legendario de las potencias. Vuestro nombre quedará grabado en los anales del templo para siempre... Pero esperad: se ha abierto una cámara secreta de orden hiperoperacional... ¿Os atrevéis con la Fase Secreta de Tetración?"`
              )}
              {isSatisfactory && (
                `"El Archivo y las tablas de potencias están a salvo gracias a vuestro esfuerzo colectivo (60%-89%). Sin embargo, la absorción de anomalías ha dañado mis circuitos auxiliares y debo entrar en hibernación regenerativa. Ha sido un honor trabajar con vosotros, equipo. Podéis descargar vuestro diploma oficial o repetir la expedición para salvarme del todo."`
              )}
              {isInsufficient && (
                `"Los cortafuegos han colapsado por exceso de ruido en los exponentes (<60%). Para no perder vuestros hallazgos, he volcado una copia de seguridad en el templo antes de desconectarme. No os rindáis: las matemáticas son perseverancia. Revisad la libreta, reforzad las reglas de signos y volved a intentarlo. Sé que podéis lograrlo."`
              )}
            </p>

            <div className="text-xs text-[#00E5FF]">
              XP Total Acumulado: <span className="font-mono-math font-bold text-[#D4AF37] text-sm">{progress.totalXp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="bg-[#1C150F]/90 rounded-2xl p-6 border border-[#D4AF37]/35 mb-8">
        <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Desglose Detallado de Calibración por Fase</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scores.map((s) => (
            <div key={s.missionId} className="bg-[#120E0A] p-3 rounded-xl border border-[#D4AF37]/25 flex justify-between items-center">
              <div>
                <div className="text-xs font-medium text-white truncate max-w-[170px]">{s.missionName}</div>
                <div className="text-[11px] text-slate-400 font-mono-math">{s.correct} de {s.total} aciertos</div>
              </div>
              <div className="text-right">
                <span className={`font-mono-math font-bold text-sm ${
                  s.percentage >= 80 ? 'text-[#00FF88]' : s.percentage >= 60 ? 'text-[#D4AF37]' : 'text-[#EF4444]'
                }`}>
                  {s.percentage}%
                </span>
                <div className="text-[10px] text-slate-500">+{s.xpEarned} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Permanent Download Diploma PDF Button */}
        <button
          onClick={() => {
            sound.playClick();
            generatePdfDiploma(progress);
          }}
          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/20 active:scale-95"
        >
          <FileText className="w-5 h-5" />
          <span>Descargar Diploma Oficial PDF</span>
        </button>

        {/* Secret Phase for >= 90% */}
        {isMastery && (
          <button
            onClick={() => {
              sound.playSuccess();
              onEnterSecretPhase();
            }}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7B2CBF] hover:from-[#33EAFF] hover:to-[#9D4EDD] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#00E5FF]/20 active:scale-95 animate-pulse"
          >
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span>Desbloquear Fase Secreta (Tetración)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Restart / Replay */}
        <button
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#120E0A] hover:bg-[#1C150F] text-slate-300 hover:text-white border border-[#D4AF37]/40 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar Expedición</span>
        </button>
      </div>
    </div>
  );
};
