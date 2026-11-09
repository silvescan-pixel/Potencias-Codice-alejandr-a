import { StudentProgress, TeacherRecord } from '../types/game';

const STUDENT_KEY = 'codice_alejandria_student_session';
const TEACHER_RECORDS_KEY = 'codice_alejandria_teacher_records';
const CODES_KEY = 'codice_alejandria_access_codes';

const DEFAULT_CODES = ['ALUMNO', '2ESO-A', '2ESO-B', '2ESO-C'];

export const storage = {
  getStudentProgress(): StudentProgress | null {
    try {
      const data = localStorage.getItem(STUDENT_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveStudentProgress(progress: StudentProgress) {
    try {
      localStorage.setItem(STUDENT_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save student progress', e);
    }
  },

  clearStudentProgress() {
    try {
      localStorage.removeItem(STUDENT_KEY);
    } catch (e) {
      console.error('Failed to clear student session', e);
    }
  },

  getTeacherRecords(): TeacherRecord[] {
    try {
      const data = localStorage.getItem(TEACHER_RECORDS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Seed some realistic sample classroom data if none exists
      const initialRecords: TeacherRecord[] = [
        {
          id: 'rec-1',
          name: 'Lucía Morales',
          group: '2º ESO A',
          roleId: 'DIGITAL_ARCHAEOLOGIST',
          totalXp: 1800,
          globalPercentage: 94,
          m1Pct: 100,
          m2cPct: 100,
          m3Pct: 90,
          m4Pct: 88,
          m5Pct: 92,
          secretPhaseCompleted: true,
          date: '2026-10-17 10:15'
        },
        {
          id: 'rec-2',
          name: 'Alejandro Vega',
          group: '2º ESO A',
          roleId: 'DATA_ENGINEER',
          totalXp: 1450,
          globalPercentage: 78,
          m1Pct: 80,
          m2cPct: 85,
          m3Pct: 75,
          m4Pct: 70,
          m5Pct: 80,
          secretPhaseCompleted: false,
          date: '2026-10-17 10:22'
        },
        {
          id: 'rec-3',
          name: 'Sara Benítez',
          group: '2º ESO B',
          roleId: 'ENVIRONMENTAL_BIOLOGIST',
          totalXp: 1950,
          globalPercentage: 96,
          m1Pct: 100,
          m2cPct: 100,
          m3Pct: 95,
          m4Pct: 92,
          m5Pct: 95,
          secretPhaseCompleted: true,
          date: '2026-10-18 09:40'
        }
      ];
      localStorage.setItem(TEACHER_RECORDS_KEY, JSON.stringify(initialRecords));
      return initialRecords;
    } catch {
      return [];
    }
  },

  addTeacherRecord(record: TeacherRecord) {
    try {
      const records = this.getTeacherRecords();
      // Replace if student and group matches, otherwise append
      const existingIdx = records.findIndex(r => r.name.toLowerCase() === record.name.toLowerCase() && r.group === record.group);
      if (existingIdx >= 0) {
        records[existingIdx] = record;
      } else {
        records.unshift(record);
      }
      localStorage.setItem(TEACHER_RECORDS_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to add teacher record', e);
    }
  },

  deleteTeacherRecord(id: string) {
    try {
      const records = this.getTeacherRecords().filter(r => r.id !== id);
      localStorage.setItem(TEACHER_RECORDS_KEY, JSON.stringify(records));
      return records;
    } catch {
      return [];
    }
  },

  getValidAccessCodes(): string[] {
    try {
      const data = localStorage.getItem(CODES_KEY);
      return data ? JSON.parse(data) : DEFAULT_CODES;
    } catch {
      return DEFAULT_CODES;
    }
  },

  addAccessCode(code: string): string[] {
    try {
      const codes = this.getValidAccessCodes();
      const clean = code.trim().toUpperCase();
      if (clean && !codes.includes(clean)) {
        codes.push(clean);
        localStorage.setItem(CODES_KEY, JSON.stringify(codes));
      }
      return codes;
    } catch {
      return DEFAULT_CODES;
    }
  },

  removeAccessCode(code: string): string[] {
    try {
      const codes = this.getValidAccessCodes().filter(c => c !== code);
      localStorage.setItem(CODES_KEY, JSON.stringify(codes));
      return codes;
    } catch {
      return DEFAULT_CODES;
    }
  },

  exportToCsv(records: TeacherRecord[]) {
    // Standard Excel-friendly CSV with UTF-8 BOM
    const headers = [
      'Nombre Alumno/a',
      'Grupo',
      'Rol Profesional',
      'Misión 1 (%)',
      'Misión 2.C (%)',
      'Misión 3 (%)',
      'Misión 4 (%)',
      'Misión 5 (%)',
      'Acierto Global (%)',
      'XP Total',
      'Fase Secreta Superada',
      'Fecha'
    ];

    const rows = records.map(r => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.group.replace(/"/g, '""')}"`,
      `"${r.roleId}"`,
      r.m1Pct,
      r.m2cPct,
      r.m3Pct,
      r.m4Pct,
      r.m5Pct,
      r.globalPercentage,
      r.totalXp,
      r.secretPhaseCompleted ? 'SÍ' : 'NO',
      `"${r.date}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Calificaciones_Codice_Alejandria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
