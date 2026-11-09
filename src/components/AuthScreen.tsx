import React, { useState } from 'react';
import { storage } from '../utils/storage';
import { sound } from '../utils/sound';
import { egyptianMusic } from '../utils/egyptianMusic';
import { KeyRound, User, Users, Sparkles, ShieldCheck, ArrowRight, BookOpen, Music } from 'lucide-react';

interface AuthScreenProps {
  onSuccessStudent: (name: string, group: string) => void;
  onSuccessTeacher: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccessStudent,
  onSuccessTeacher,
}) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [startWithMusic, setStartWithMusic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (startWithMusic) {
      egyptianMusic.start();
    }
    setErrorMsg('');

    const cleanCode = accessCode.trim().toUpperCase();

    // Check teacher master key first
    if (cleanCode === 'SILVESTRE') {
      sound.playSuccess();
      onSuccessTeacher();
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Por favor, introduce tu nombre o el de tu equipo.');
      sound.playError();
      return;
    }

    if (!group.trim()) {
      setErrorMsg('Por favor, indica tu curso y grupo (ej. 1º ESO A, 2º ESO B, 3º ESO C...).');
      sound.playError();
      return;
    }

    const validCodes = storage.getValidAccessCodes();
    // Allow empty code to fallback to ALUMNO for quick student ease
    if (!cleanCode || cleanCode === 'ALUMNO' || validCodes.includes(cleanCode)) {
      sound.playSuccess();
      onSuccessStudent(name.trim(), group);
    } else {
      setErrorMsg(`Clave incorrecta. Para alumnos usa 'ALUMNO' (o la clave de tu profesor). Clave maestra docente: 'SILVESTRE'.`);
      sound.playError();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-[#1C150F] border border-[#D4AF37]/50 mb-4 shadow-xl">
          <Sparkles className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display mb-2">
          El Códice de Alejandría
        </h1>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          Misión arqueo-digital de potencias en números enteros (ℤ). Descifra los enigmas del Gran Archivo junto a la IA ALEX-A.
        </p>
      </div>

      <div className="relative rounded-3xl bg-[#1C150F]/95 border-2 border-[#D4AF37]/45 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4AF37]/25">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
            <span className="font-semibold text-white text-sm">Autenticación de Terminal</span>
          </div>
          <span className="text-xs text-[#D4AF37] font-semibold">2º ESO Matemáticas</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre Alumno/a */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nombre del Alumno/a o Equipo
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Lucía Morales / Equipo Hypatia"
                className="w-full bg-[#120E0A] border border-[#D4AF37]/40 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                required
              />
            </div>
          </div>

          {/* Grupo Clase con entrada de teclado abierta a cualquier curso */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Grupo / Curso
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                list="group-suggestions"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Escribe tu grupo (ej. 1º ESO A, 2º ESO B, 3º ESO C, Refuerzo...)"
                className="w-full bg-[#120E0A] border border-[#D4AF37]/40 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                required
              />
              <datalist id="group-suggestions">
                <option value="1º ESO A" />
                <option value="1º ESO B" />
                <option value="2º ESO A" />
                <option value="2º ESO B" />
                <option value="2º ESO C" />
                <option value="3º ESO A" />
                <option value="3º ESO B" />
                <option value="4º ESO" />
                <option value="Refuerzo Matemáticas" />
              </datalist>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Introduce cualquier curso o grupo (1º, 2º o 3º de ESO, refuerzo o ampliación).
            </span>
          </div>

          {/* Clave de Acceso */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Clave de Acceso
              </label>
              <span className="text-[11px] text-[#00E5FF]">Por defecto: ALUMNO</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Escribe 'ALUMNO' o la clave de tu profesor"
                className="w-full bg-[#120E0A] border border-[#D4AF37]/40 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#FCA5A5] text-xs leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Ambient Music Toggle Option */}
          <div className="p-3 rounded-xl bg-[#120E0A] border border-[#D4AF37]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37]">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Música Ambiental Egipcia</div>
                <div className="text-[10px] text-slate-400">Tambor Darbuka, Laúd Oud y Flauta Ney</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={startWithMusic}
                onChange={(e) => setStartWithMusic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#251C14] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#D4AF37] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00E5FF]/30"></div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition-all active:scale-[0.99]"
          >
            <span>Iniciar Expedición al Códice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#D4AF37]/25 flex items-center justify-center text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ficha de Ejercicios Oficial Integrada · Educación Secundaria</span>
          </div>
        </div>
      </div>
    </div>
  );
};
