import React from 'react';
import { AlexaEmotion } from '../types/game';
import { ALEXA_PORTRAITS } from '../data/assets';
import { sound } from '../utils/sound';
import { ArrowRight, Bot, Sparkles, ShieldAlert, Scroll } from 'lucide-react';

interface CinematicBriefingProps {
  emotion: AlexaEmotion;
  tag: string;
  title: string;
  subtitle: string;
  dialogue: string;
  buttonLabel?: string;
  isGlitching?: boolean;
  onProceed: () => void;
}

export const CinematicBriefing: React.FC<CinematicBriefingProps> = ({
  emotion,
  tag,
  title,
  subtitle,
  dialogue,
  buttonLabel = 'Entrar a la Cámara de Pruebas',
  isGlitching = false,
  onProceed,
}) => {
  const portraitUrl = ALEXA_PORTRAITS[emotion];

  const handleContinue = () => {
    sound.playClick();
    onProceed();
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="relative rounded-3xl bg-[#1C150F]/95 border-2 border-[#D4AF37]/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] p-6 sm:p-10 overflow-hidden backdrop-blur-xl">
        
        {/* Ancient papyrus and hieroglyph subtle background */}
        <div className="absolute inset-0 papyrus-texture opacity-25 pointer-events-none" />

        {/* Top Tag & Decorative Corner Stamps */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#D4AF37]">
            <Scroll className="w-4 h-4 text-[#D4AF37]" />
            <span>{tag}</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
            {emotion === 'cold' ? 'Fase Inicial · Distante' : emotion === 'enthusiastic' ? 'Fase Intermedia · Sinergia' : 'Clímax Crítico · Sobrecarga'}
          </span>
        </div>

        {/* Center: Character Portrait & Dialogue */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          
          {/* Portrait with Egyptian gold and quartz border */}
          <div className="relative shrink-0">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 bg-[#120E0A] shadow-2xl relative ${
              emotion === 'critical' ? 'border-[#EF4444] shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)]'
            }`}>
              <img
                src={portraitUrl}
                alt="ALEX-A Holograma"
                className={`w-full h-full object-cover ${
                  isGlitching || emotion === 'critical' ? 'filter saturate-150 contrast-125' : ''
                }`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120E0A]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Badge Indicator */}
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#120E0A] border border-[#D4AF37] shadow-md">
              {emotion === 'critical' ? (
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              ) : emotion === 'enthusiastic' ? (
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Bot className="w-4 h-4 text-[#00E5FF]" />
              )}
            </div>
          </div>

          {/* Dialogue Section */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-1 tracking-tight">
              {title}
            </h2>
            <div className="text-xs font-semibold text-[#00E5FF] mb-4">
              {subtitle}
            </div>

            <div className="relative p-4 rounded-xl bg-[#120E0A]/80 border border-[#D4AF37]/30 text-slate-200 text-sm leading-relaxed italic">
              {isGlitching && (
                <div className="text-[#EF4444] font-mono text-xs not-italic font-bold mb-1 animate-pulse">
                  📡💥 [ERROR DE CORTAFUEGOS // NÚCLEO INESTABLE]
                </div>
              )}
              "{dialogue}"
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative z-10 flex justify-center sm:justify-end">
          <button
            onClick={handleContinue}
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-[#D4AF37]/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>{buttonLabel}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
