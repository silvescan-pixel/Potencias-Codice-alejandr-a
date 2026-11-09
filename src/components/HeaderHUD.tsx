import React, { useState } from 'react';
import { StudentProgress, MissionPhase, AlexaEmotion } from '../types/game';
import { ROLES_DATA } from '../data/assets';
import { generatePdfDiploma } from '../utils/pdfCertificate';
import { sound } from '../utils/sound';
import { egyptianMusic } from '../utils/egyptianMusic';
import { 
  Shield, 
  FileText, 
  Lock, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles,
  Zap
} from 'lucide-react';

interface HeaderHUDProps {
  progress: StudentProgress | null;
  currentPhase: MissionPhase;
  alexaEmotion: AlexaEmotion;
  onOpenTeacherPanel: () => void;
  onRestartStudent?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  progress,
  currentPhase,
  alexaEmotion,
  onOpenTeacherPanel,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(egyptianMusic.getIsPlaying());

  React.useEffect(() => {
    const unsub = egyptianMusic.subscribe((playing) => {
      setMusicOn(playing);
    });
    return unsub;
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundOn(newState);
    if (newState) sound.playClick();
  };

  const handleToggleMusic = () => {
    const newState = egyptianMusic.toggle();
    setMusicOn(newState);
    sound.playClick();
  };

  const handleDownloadDiploma = () => {
    sound.playClick();
    if (progress) {
      generatePdfDiploma(progress);
    } else {
      generatePdfDiploma({
        name: 'Expedicionario Invitado',
        group: '2º ESO',
        roleId: 'DIGITAL_ARCHAEOLOGIST',
        totalXp: 0,
        serverIntegrity: 100,
        alexaTrust: 50,
        badges: [],
        missionScores: {},
        startedAt: new Date().toISOString()
      });
    }
  };

  const activeRole = progress ? ROLES_DATA[progress.roleId] : null;

  return (
    <header className="sticky top-0 z-50 bg-[#16100B]/95 backdrop-blur-md border-b border-[#D4AF37]/35 px-4 py-2.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark & Alexandria Seal */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] flex items-center justify-center text-[#120E0A] font-bold shadow-md shadow-[#D4AF37]/20 border border-[#FFF0A0]/40">
            <Sparkles className="w-5 h-5 text-[#120E0A]" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-2 font-display">
              <span>El Códice de Alejandría</span>
              <span className="text-[11px] font-semibold tracking-wide text-[#D4AF37] uppercase">{progress?.group || 'ESO'}</span>
            </div>
            <div className="text-xs text-slate-300">
              {progress ? (
                <span>{progress.name} · {progress.group} · {activeRole?.shortTitle}</span>
              ) : (
                <span>Templo Arqueo-Digital de Potencias</span>
              )}
            </div>
          </div>
        </div>

        {/* Zone 2: Status Indicators & Server Integrity */}
        {progress && currentPhase !== 'AUTH' && (
          <div className="hidden lg:flex items-center gap-6 text-xs">
            {/* XP Counter */}
            <div className="flex items-center gap-2 bg-[#120E0A] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-slate-300">XP:</span>
              <span className="font-mono-math font-bold text-[#D4AF37] text-sm tabular-nums">
                {progress.totalXp}
              </span>
            </div>

            {/* Server Integrity Meter */}
            <div className="flex items-center gap-2 bg-[#120E0A] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 w-48">
              <Shield className={`w-4 h-4 shrink-0 ${progress.serverIntegrity < 40 ? 'text-[#EF4444]' : 'text-[#00E5FF]'}`} />
              <div className="flex-1">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Integridad:</span>
                  <span className={`font-mono-math font-semibold tabular-nums ${progress.serverIntegrity < 40 ? 'text-[#EF4444]' : 'text-[#00E5FF]'}`}>
                    {progress.serverIntegrity}%
                  </span>
                </div>
                <div className="w-full bg-[#1C150F] h-1.5 rounded-full overflow-hidden border border-[#D4AF37]/20">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      progress.serverIntegrity < 40 
                        ? 'bg-[#EF4444]' 
                        : progress.serverIntegrity < 70 
                        ? 'bg-[#D4AF37]' 
                        : 'bg-[#00E5FF]'
                    }`}
                    style={{ width: `${progress.serverIntegrity}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ALEX-A State Tag */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#120E0A] text-slate-300 border border-[#D4AF37]/30">
              <span className={`w-2 h-2 rounded-full ${
                alexaEmotion === 'critical' ? 'bg-[#EF4444] animate-ping' : alexaEmotion === 'enthusiastic' ? 'bg-[#00FF88]' : 'bg-[#00E5FF]'
              }`} />
              <span className="text-[11px]">ALEX-A:</span>
              <span className="text-[11px] font-medium text-white capitalize">
                {alexaEmotion === 'cold' ? 'Prudente' : alexaEmotion === 'enthusiastic' ? 'Entusiasta' : 'Crítica'}
              </span>
            </div>
          </div>
        )}

        {/* Zone 3: Actions (Music, SFX, Diploma PDF, Teacher Panel) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Egyptian Ambient Music Toggle */}
          <button
            onClick={handleToggleMusic}
            title={musicOn ? 'Pausar música egipcia' : 'Reproducir música mística egipcia'}
            aria-label="Toggle Egyptian Ambient Music"
            className={`p-2 rounded-lg transition-all border ${
              musicOn 
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)] animate-pulse' 
                : 'bg-[#120E0A] hover:bg-[#251C14] text-slate-400 hover:text-white border-[#D4AF37]/30'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundOn ? 'Silenciar efectos' : 'Activar efectos'}
            aria-label="Toggle Sound Effects"
            className="p-2 rounded-lg bg-[#120E0A] hover:bg-[#251C14] text-slate-400 hover:text-white transition-colors border border-[#D4AF37]/30"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#00E5FF]" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Permanent Global HUD Button: Descargar Certificado / Diploma PDF */}
          <button
            onClick={handleDownloadDiploma}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-xs transition-all shadow-md shadow-[#D4AF37]/20 active:scale-95 whitespace-nowrap"
            title="Descarga tu diploma oficial con tus calificaciones y avatar"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Descargar Diploma PDF</span>
            <span className="sm:hidden">Diploma</span>
          </button>

          {/* Teacher Private Access Button: only visible when NOT logged in as a student */}
          {!progress && (
            <button
              onClick={onOpenTeacherPanel}
              title="Acceso Docente (Clave Maestra)"
              aria-label="Teacher Dashboard"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-[#120E0A] hover:bg-[#251C14] text-slate-300 hover:text-[#D4AF37] text-xs transition-colors border border-[#D4AF37]/30"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden md:inline">Docente</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
