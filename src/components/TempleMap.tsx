import React from 'react';
import { MissionPhase, StudentProgress } from '../types/game';
import { TEMPLE_CHAMBERS, getChamberByPhase } from '../data/templeNarrative';
import { ROLES_DATA } from '../data/assets';
import { Check, Lock, Compass } from 'lucide-react';

interface TempleMapProps {
  currentPhase: MissionPhase;
  progress: StudentProgress;
}

export const TempleMap: React.FC<TempleMapProps> = ({ currentPhase, progress }) => {
  const activeChamber = getChamberByPhase(currentPhase);
  const role = ROLES_DATA[progress.roleId];
  const isOutcomeOrSecret = currentPhase === 'OUTCOME' || currentPhase === 'SECRET_TETRATION';

  const activeOrder = activeChamber ? activeChamber.order : isOutcomeOrSecret ? 9 : 0;

  return (
    <section
      aria-label="Mapa del Templo de Alejandría"
      className="bg-[#16100B]/95 border-b border-[#D4AF37]/25 px-4 sm:px-6 py-3"
    >
      <div className="max-w-7xl mx-auto">
        {/* Progress Chambers Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
          {TEMPLE_CHAMBERS.map((chamber, idx) => {
            const score = progress.missionScores[chamber.scoreKey];
            const isCompleted = Boolean(score) || chamber.order < activeOrder;
            const isActive = activeChamber?.id === chamber.id;

            return (
              <React.Fragment key={chamber.id}>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-bold shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                      : isCompleted
                      ? 'bg-[#00FF88]/10 border-[#00FF88]/40 text-[#00FF88]'
                      : 'bg-[#120E0A] border-[#D4AF37]/15 text-slate-500'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono-math ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#120E0A] font-bold'
                        : isCompleted
                        ? 'bg-[#00FF88]/20 text-[#00FF88]'
                        : 'bg-[#1C150F] text-slate-500'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="w-2.5 h-2.5" />
                    ) : !isCompleted && !isActive ? (
                      <Lock className="w-2.5 h-2.5" />
                    ) : (
                      chamber.order
                    )}
                  </span>
                  <span className="whitespace-nowrap">{chamber.shortName}</span>
                  {score && (
                    <span className="font-mono-math text-[10px] opacity-90 tabular-nums">
                      {score.percentage}%
                    </span>
                  )}
                </div>

                {idx < TEMPLE_CHAMBERS.length - 1 && (
                  <div
                    className={`h-[2px] w-3 shrink-0 ${
                      chamber.order < activeOrder ? 'bg-[#00FF88]/50' : 'bg-[#D4AF37]/20'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Active Role & Current Chamber Objective Line */}
        {activeChamber && (
          <div className="mt-2 pt-2 border-t border-[#D4AF37]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <Compass className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
              <span>
                <strong className="text-[#D4AF37]">{role.title}</strong>
                <span className="text-slate-400"> · Cámara {activeChamber.order}/8: </span>
                <span className="text-white font-semibold">{activeChamber.chamberTitle}</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              {activeChamber.whatIsAtStake}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
