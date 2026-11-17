import React from 'react';
import { AlexaEmotion } from '../types/game';
import { ALEXA_PORTRAITS } from '../data/assets';
import { FormatMath } from './MathDisplay';
import { Bot, Sparkles, ShieldAlert } from 'lucide-react';

interface AlexaDialogueBoxProps {
  emotion: AlexaEmotion;
  dialogue: string;
  missionTitle?: string;
  isGlitching?: boolean;
}

export const AlexaDialogueBox: React.FC<AlexaDialogueBoxProps> = ({
  emotion,
  dialogue,
  missionTitle,
  isGlitching = false,
}) => {
  const portraitUrl = ALEXA_PORTRAITS[emotion];

  const emotionStyles = {
    cold: {
      border: 'border-[#00E5FF]/40',
      badge: 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30',
      tag: 'Fase inicial · Calibración distante',
      glow: 'shadow-[0_0_20px_rgba(0,229,255,0.15)]',
    },
    enthusiastic: {
      border: 'border-[#D4AF37]/50',
      badge: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
      tag: 'Fase intermedia · Sinergia y confianza',
      glow: 'shadow-[0_0_25px_rgba(212,175,55,0.2)]',
    },
    critical: {
      border: 'border-[#EF4444]/70',
      badge: 'bg-[#EF4444]/20 text-[#FCA5A5] border-[#EF4444]/50',
      tag: 'Clímax crítico · Sobrecarga de núcleo',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.25)]',
    }
  }[emotion];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#1C150F]/90 border ${emotionStyles.border} ${emotionStyles.glow} p-4 sm:p-5 mb-6 transition-all duration-300`}>
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
        
        {/* Holographic Portrait Frame */}
        <div className="relative shrink-0">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 ${emotionStyles.border} bg-[#120E0A] relative`}>
            <img
              src={portraitUrl}
              alt="Unidad ALEX-A"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isGlitching || emotion === 'critical' ? 'filter saturate-150 contrast-125' : ''
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120E0A]/60 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#120E0A] border border-[#D4AF37]/40 flex items-center justify-center">
            {emotion === 'critical' ? (
              <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
            ) : emotion === 'enthusiastic' ? (
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            ) : (
              <Bot className="w-3.5 h-3.5 text-[#00E5FF]" />
            )}
          </div>
        </div>

        {/* Dialogue & Unit Tagging */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-base">ALEX-A</span>
              <span className="text-xs text-slate-400">· Unidad de Soporte Arqueo-Digital</span>
            </div>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${emotionStyles.badge}`}>
              {emotionStyles.tag}
            </span>
          </div>

          {missionTitle && (
            <div className="text-xs font-semibold text-[#00E5FF] mb-1.5 flex items-center justify-center sm:justify-start gap-1">
              <span>{missionTitle}</span>
            </div>
          )}

          {/* Dialogue text */}
          <div className="text-sm leading-relaxed text-slate-200">
            {isGlitching && (
              <span className="inline-block text-[#FCA5A5] font-semibold text-xs mr-2">
                [Interferencia crítica en núcleo]
              </span>
            )}
            "<FormatMath expr={dialogue} className="font-sans" />"
          </div>
        </div>

      </div>
    </div>
  );
};
