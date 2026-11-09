import React, { useState } from 'react';
import { TeacherRecord } from '../types/game';
import { storage } from '../utils/storage';
import { sound } from '../utils/sound';
import { 
  Lock, 
  Download, 
  Key, 
  Plus, 
  Trash2, 
  LogOut, 
  Users, 
  Sparkles,
  BarChart2
} from 'lucide-react';

interface TeacherPanelProps {
  onClose: () => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ onClose }) => {
  const [records, setRecords] = useState<TeacherRecord[]>(() => storage.getTeacherRecords());
  const [accessCodes, setAccessCodes] = useState<string[]>(() => storage.getValidAccessCodes());
  const [newCode, setNewCode] = useState('');
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    sound.playClick();
    const updated = storage.addAccessCode(newCode);
    setAccessCodes(updated);
    setNewCode('');
  };

  const handleRemoveCode = (code: string) => {
    sound.playClick();
    const updated = storage.removeAccessCode(code);
    setAccessCodes(updated);
  };

  const handleDeleteRecord = (id: string) => {
    sound.playClick();
    const updated = storage.deleteTeacherRecord(id);
    setRecords(updated);
  };

  const handleExportCsv = () => {
    sound.playSuccess();
    storage.exportToCsv(records);
  };

  const handleSaveAndExit = () => {
    sound.playSuccess();
    // 1. If there is a code written in newCode, save it automatically
    if (newCode.trim()) {
      const updated = storage.addAccessCode(newCode.trim());
      setAccessCodes(updated);
      setNewCode('');
    }
    setSaveSuccessMsg('¡Configuración guardada! Saliendo al panel de inicio...');
    // 2. Call onClose to return
    setTimeout(() => {
      onClose();
    }, 250);
  };

  const filteredRecords = filterGroup === 'ALL' 
    ? records 
    : records.filter(r => r.group === filterGroup);

  const groupsList = Array.from(new Set(records.map(r => r.group)));

  // Global class stats
  const totalStudents = records.length;
  const avgGlobal = totalStudents > 0 
    ? Math.round(records.reduce((acc, cur) => acc + cur.globalPercentage, 0) / totalStudents) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Save Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#00FF88]/20 border border-[#00FF88] text-[#00FF88] font-bold text-xs shadow-2xl animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D4AF37]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white font-display">
              Panel Privado del Profesorado (Clave SILVESTRE)
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            Control de aula, gestión de claves grupales y métricas de desempeño LOMLOE en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Resultados (.CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndExit}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0096C7] hover:from-[#33EAFF] hover:to-[#0077B6] text-[#120E0A] font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 active:scale-95 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Guardar y Salir</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1C150F] p-4 rounded-xl border border-[#D4AF37]/30">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#00E5FF]" />
            <span>Alumnos Registrados</span>
          </div>
          <div className="text-2xl font-bold font-mono-math text-white">
            {totalStudents}
          </div>
        </div>

        <div className="bg-[#1C150F] p-4 rounded-xl border border-[#D4AF37]/30">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Nota Media de Acierto Global</span>
          </div>
          <div className="text-2xl font-bold font-mono-math text-[#D4AF37]">
            {avgGlobal}%
          </div>
        </div>

        <div className="bg-[#1C150F] p-4 rounded-xl border border-[#D4AF37]/30">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-[#00FF88]" />
            <span>Claves de Grupo Habilitadas</span>
          </div>
          <div className="text-2xl font-bold font-mono-math text-[#00FF88]">
            {accessCodes.length}
          </div>
        </div>
      </div>

      {/* Access Codes Management */}
      <div className="bg-[#1C150F]/90 rounded-2xl p-5 border border-[#D4AF37]/30 mb-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#D4AF37]" />
          <span>Gestión de Claves de Acceso por Grupo</span>
        </h3>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {accessCodes.map(code => (
            <div key={code} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#120E0A] border border-[#D4AF37]/40 text-xs font-mono text-white">
              <span>{code}</span>
              {code !== 'ALUMNO' && (
                <button
                  onClick={() => handleRemoveCode(code)}
                  className="text-slate-400 hover:text-[#EF4444] transition-colors ml-1 cursor-pointer"
                  title="Eliminar clave"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAddCode} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="Nueva clave (ej. 1ESO-AVANZ, 3ESO-REP)"
            className="flex-1 bg-[#120E0A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-[#D4AF37] focus:outline-none"
          />
          <button
            type="submit"
            className="py-2 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E6C34E] text-[#120E0A] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Clave</span>
          </button>
        </form>
      </div>

      {/* Students Progress Table */}
      <div className="bg-[#1C150F]/95 rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-xl">
        <div className="p-4 bg-[#120E0A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/30">
          <h3 className="font-semibold text-white text-sm">
            Tabla de Progreso en Tiempo Real por Alumno y Fase
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filtrar por grupo:</span>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="bg-[#1C150F] border border-[#D4AF37]/40 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
            >
              <option value="ALL">Todos los grupos</option>
              {groupsList.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#120E0A] text-[#D4AF37] font-semibold border-b border-[#D4AF37]/25">
                <th className="py-3 px-3">Nombre</th>
                <th className="py-3 px-2">Grupo</th>
                <th className="py-3 px-2">Misión 1</th>
                <th className="py-3 px-2">Misión 2.C</th>
                <th className="py-3 px-2">Misión 3</th>
                <th className="py-3 px-2">Misión 4</th>
                <th className="py-3 px-2">Misión 5</th>
                <th className="py-3 px-2">Global</th>
                <th className="py-3 px-2">XP</th>
                <th className="py-3 px-2">Fase Secreta</th>
                <th className="py-3 px-2 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15 font-mono-math">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No hay registros de alumnos en este grupo aún.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#120E0A]/60 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-white">{r.name}</td>
                    <td className="py-2.5 px-2 text-slate-300">{r.group}</td>
                    <td className="py-2.5 px-2">{r.m1Pct}%</td>
                    <td className="py-2.5 px-2">{r.m2cPct}%</td>
                    <td className="py-2.5 px-2">{r.m3Pct}%</td>
                    <td className="py-2.5 px-2">{r.m4Pct}%</td>
                    <td className="py-2.5 px-2">{r.m5Pct}%</td>
                    <td className="py-2.5 px-2">
                      <span className={`font-bold ${
                        r.globalPercentage >= 90 ? 'text-[#00FF88]' : r.globalPercentage >= 60 ? 'text-[#D4AF37]' : 'text-[#EF4444]'
                      }`}>
                        {r.globalPercentage}%
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-[#00E5FF] font-semibold">{r.totalXp}</td>
                    <td className="py-2.5 px-2">
                      {r.secretPhaseCompleted ? (
                        <span className="text-[#D4AF37] font-bold">SUPERADA</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => handleDeleteRecord(r.id)}
                        className="text-slate-400 hover:text-[#EF4444] transition-colors p-1 cursor-pointer"
                        title="Borrar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
