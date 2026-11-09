import React from 'react';
import { AlexaEmotion } from '../types/game';
import { ALEXA_PORTRAITS } from '../data/assets';
import { Bot, AlertTriangle, Sparkles, ShieldAlert } from 'lucide-react';

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
      border: 'border-[#00F5FF]/40',
      badge: 'bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/30',
      tag: 'FASE INICIAL // CALIBRACIÓN DISTANTE',
      glow: 'shadow-[0_0_20px_rgba(0,245,255,0.15)]',
      color: '#00F5FF'
    },
    enthusiastic: {
      border: 'border-[#FFD700]/50',
      badge: 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30',
      tag: 'FASE INTERMEDIA // SINERGIA Y CONFIANZA',
      glow: 'shadow-[0_0_25px_rgba(255,215,0,0.2)]',
      color: '#FFD700'
    },
    critical: {
      border: 'border-[#FF3366]/70',
      badge: 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/50 animate-pulse',
      tag: 'CLÍMAX CRÍTICO // SOBRECARGA DE NÚCLEO',
      glow: 'shadow-[0_0_30px_rgba(255,51,102,0.3)]',
      color: '#FF3366'
    }
  }[emotion];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#1B263B]/90 border ${emotionStyles.border} ${emotionStyles.glow} p-4 sm:p-5 mb-6 transition-all duration-300`}>
      {/* Background Hologram grid pattern */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
        
        {/* Holographic Portrait Frame */}
        <div className="relative shrink-0">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 ${emotionStyles.border} bg-[#0D1B2A] relative group`}>
            <img
              src={portraitUrl}
              alt="Unidad ALEX-A"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isGlitching || emotion === 'critical' ? 'filter saturate-150 contrast-125' : ''
              }`}
              referrerPolicy="no-referrer"
            />
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Status icon badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0D1B2A] border border-[#415A77] flex items-center justify-center">
            {emotion === 'critical' ? (
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF3366]" />
            ) : emotion === 'enthusiastic' ? (
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            ) : (
              <Bot className="w-3.5 h-3.5 text-[#00F5FF]" />
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
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${emotionStyles.badge}`}>
              {emotionStyles.tag}
            </span>
          </div>

          {missionTitle && (
            <div className="text-xs font-semibold text-[#00F5FF] mb-1.5 flex items-center justify-center sm:justify-start gap-1">
              <span>{missionTitle}</span>
            </div>
          )}

          {/* Dialogue text */}
          <div className="text-sm leading-relaxed text-slate-200">
            {isGlitching && (
              <span className="inline-block text-[#FF3366] font-mono text-xs mr-1 animate-pulse">
                [ESTÁTICA // INTERFERENCIA]
              </span>
            )}
            "{dialogue}"
          </div>
        </div>

      </div>
    </div>
  );
};
