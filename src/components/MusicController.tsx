import React, { useState, useEffect } from 'react';
import { egyptianMusic } from '../utils/egyptianMusic';
import { sound } from '../utils/sound';
import { Music, Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';

export const MusicController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(egyptianMusic.getIsPlaying());
  const [volume, setVolume] = useState<number>(egyptianMusic.getVolume());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = egyptianMusic.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    sound.playClick();
    egyptianMusic.toggle();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    egyptianMusic.setVolume(newVol);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {/* Expanded Controls Card */}
      {isExpanded && (
        <div className="bg-[#1C150F]/95 border border-[#D4AF37]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md w-64 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D4AF37]/25">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-white">Música de Alejandría</span>
            </div>
            <span className="text-[10px] font-mono text-[#00E5FF]">Maqam Hijaz</span>
          </div>

          <div className="text-[11px] text-slate-300 mb-3 leading-relaxed">
            Sintetizador Web Audio: Tambor egipcio (Darbuka), Laúd Oud y Flauta Ney.
          </div>

          {/* Play / Pause Big Button */}
          <button
            onClick={handleToggle}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mb-3 transition-all ${
              isPlaying
                ? 'bg-[#EF4444]/20 border border-[#EF4444] text-[#FCA5A5] hover:bg-[#EF4444]/30'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#120E0A] hover:from-[#E6C34E] hover:to-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar Música del Templo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Reproducir Música del Templo</span>
              </>
            )}
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.6)}
              className="text-slate-400 hover:text-white"
              title={volume > 0 ? 'Silenciar' : 'Reactivar'}
            >
              {volume > 0 ? <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#D4AF37] h-1.5 bg-[#120E0A] rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full border shadow-xl backdrop-blur-md transition-all active:scale-95 ${
          isPlaying
            ? 'bg-[#1C150F]/90 border-[#D4AF37] text-[#D4AF37] shadow-[#D4AF37]/20'
            : 'bg-[#120E0A]/90 hover:bg-[#1C150F] border-[#D4AF37]/35 text-slate-300 hover:text-white'
        }`}
        title="Controles de música ambiental egipcia"
      >
        <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-[#D4AF37]' : 'text-slate-400'}`} />
        
        {/* Animated equalizer bars when playing */}
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5">
            <span className="w-1 bg-[#D4AF37] rounded-full animate-pulse h-3" />
            <span className="w-1 bg-[#00E5FF] rounded-full animate-pulse h-2 delay-75" />
            <span className="w-1 bg-[#D4AF37] rounded-full animate-pulse h-3.5 delay-150" />
            <span className="w-1 bg-[#00E5FF] rounded-full animate-pulse h-1.5 delay-100" />
          </div>
        ) : null}

        <span className="text-xs font-semibold">
          {isPlaying ? 'Música activa' : '🎶 Música'}
        </span>
      </button>
    </div>
  );
};
