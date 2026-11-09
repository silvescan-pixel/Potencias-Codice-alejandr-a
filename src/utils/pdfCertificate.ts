import { jsPDF } from 'jspdf';
import { StudentProgress } from '../types/game';
import { ROLES_DATA } from '../data/assets';

export function generatePdfDiploma(progress: StudentProgress) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4' // 297 x 210 mm
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background - Dark Antique Papyrus (#16100B)
  doc.setFillColor(22, 16, 11);
  doc.rect(0, 0, width, height, 'F');

  // Decorative border - Antique Alexandrian Gold (#D4AF37)
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1.6);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner subtle border - Quartz (#00E5FF)
  doc.setDrawColor(0, 229, 255);
  doc.setLineWidth(0.5);
  doc.rect(13, 13, width - 26, height - 26);

  // Corner decorations
  const corners = [
    [10, 10], [width - 10, 10],
    [10, height - 10], [width - 10, height - 10]
  ];
  doc.setFillColor(212, 175, 55);
  corners.forEach(([cx, cy]) => {
    doc.circle(cx, cy, 3, 'FD');
  });

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(24);
  doc.text('EL CÓDICE DE ALEJANDRÍA', width / 2, 28, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(0, 229, 255);
  doc.text('CERTIFICADO OFICIAL DE COMPETENCIA ARQUEO-MATEMÁTICA EN POTENCIAS', width / 2, 35, { align: 'center' });

  // Subtitle
  doc.setFontSize(9);
  doc.setTextColor(230, 220, 200);
  doc.text(`Currículo de Matemáticas · Educación Secundaria (${progress.group || 'ESO'})`, width / 2, 40, { align: 'center' });

  // Student Name & Affiliation
  doc.setFontSize(13);
  doc.setTextColor(240, 235, 220);
  doc.text('Por cuanto se certifica que la expedición liderada por:', width / 2, 51, { align: 'center' });

  doc.setFontSize(22);
  doc.setTextColor(212, 175, 55);
  doc.text(progress.name.toUpperCase() || 'ALUMNO/A EXPEDICIONARIO/A', width / 2, 61, { align: 'center' });

  const role = ROLES_DATA[progress.roleId] || ROLES_DATA.DATA_ENGINEER;
  doc.setFontSize(11);
  doc.setTextColor(0, 229, 255);
  doc.text(`Grupo: ${progress.group || '2º ESO'}   |   Especialidad: ${role.title}   |   XP Acumulado: ${progress.totalXp} XP`, width / 2, 69, { align: 'center' });

  // Horizontal divider
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(30, 74, width - 30, 74);

  // Performance Table Box
  const boxX = 25;
  const boxY = 80;
  const boxW = width - 50;
  const boxH = 78;

  doc.setFillColor(28, 21, 15);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'S');

  doc.setFontSize(11);
  doc.setTextColor(212, 175, 55);
  doc.text('REGISTRO DE DESEMPEÑO Y CALIBRACIÓN DE TERMINALES', boxX + 8, boxY + 9);

  // Columns
  const missionKeys = [
    { id: 'M1', name: 'Misión 1: Matriz de Calibración de Nodos (Base, Exp y Resultado)', xp: '100 XP' },
    { id: 'INT1', name: 'Interludio 1: Papyrus Variable (Transmisión 2^n por minuto)', xp: '150 XP' },
    { id: 'M2C', name: 'Misión 2.C: Cámara de Polaridad (Signos (-a)^n vs -a^n)', xp: '150 XP' },
    { id: 'M3', name: 'Misión 3: Canales Primarios (Producto y Cociente a^k)', xp: '200 XP' },
    { id: 'M4', name: 'Misión 4: Núcleo de Simplificación Compleja (Fracciones)', xp: '600 XP' },
    { id: 'M5', name: 'Misión 5: Restauración de Constantes Perdidas (x e Inversos)', xp: '750 XP' },
  ];

  let currentY = boxY + 18;
  let totalCorrect = 0;
  let totalQuestions = 0;

  missionKeys.forEach((m, idx) => {
    const score = progress.missionScores[m.id];
    const pct = score ? score.percentage : 0;
    if (score) {
      totalCorrect += score.correct;
      totalQuestions += score.total;
    }

    doc.setFontSize(9);
    doc.setTextColor(230, 225, 215);
    doc.text(`${idx + 1}. ${m.name}`, boxX + 8, currentY);

    doc.setTextColor(180, 165, 140);
    doc.text(m.xp, boxX + 155, currentY);

    if (pct >= 80) {
      doc.setTextColor(0, 255, 136); // Neon Green
    } else if (pct >= 60) {
      doc.setTextColor(212, 175, 55); // Gold
    } else {
      doc.setTextColor(239, 68, 68); // Red
    }
    const scoreText = score ? `${pct}% (${score.correct}/${score.total})` : 'Pendiente';
    doc.text(scoreText, boxX + 210, currentY, { align: 'right' });

    currentY += 8.5;
  });

  const globalPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Global summary bar inside box
  doc.setFillColor(18, 14, 10);
  doc.rect(boxX + 2, boxY + boxH - 12, boxW - 4, 10, 'F');

  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55);
  doc.text(`TASA DE ACIERTO GLOBAL: ${globalPercentage}%`, boxX + 8, boxY + boxH - 5);

  const alexaStatus = globalPercentage >= 90
    ? 'ESTADO DE ALEX-A: RESTAURADA (CONFIDENCIA MÁXIMA)'
    : globalPercentage >= 60
    ? 'ESTADO DE ALEX-A: NÚCLEO PROTEGIDO (MODO SEGURO)'
    : 'ESTADO DE ALEX-A: REINICIO DE PROTOCOLO DOCENTE';

  doc.setTextColor(0, 229, 255);
  doc.text(alexaStatus, boxX + boxW - 8, boxY + boxH - 5, { align: 'right' });

  // Footer / Signatures
  const footerY = 175;
  doc.setFontSize(9);
  doc.setTextColor(190, 180, 160);

  // Left stamp
  doc.text('ALEX-A (Unidad Arqueo-Digital)', 50, footerY, { align: 'center' });
  doc.setDrawColor(0, 229, 255);
  doc.line(20, footerY + 2, 80, footerY + 2);
  doc.setFontSize(8);
  doc.setTextColor(0, 229, 255);
  doc.text('FIRMA DIGITAL // SHA-256 ALEXANDRIA', 50, footerY + 6, { align: 'center' });

  // Center Seal
  doc.setFillColor(212, 175, 55);
  doc.circle(width / 2, footerY + 1, 9, 'S');
  doc.setFontSize(7);
  doc.setTextColor(212, 175, 55);
  doc.text('SELLO OFICIAL', width / 2, footerY - 1, { align: 'center' });
  doc.text('2º ESO', width / 2, footerY + 3, { align: 'center' });

  // Right stamp
  doc.setFontSize(9);
  doc.setTextColor(190, 180, 160);
  doc.text('Departamento de Matemáticas', width - 50, footerY, { align: 'center' });
  doc.setDrawColor(212, 175, 55);
  doc.line(width - 80, footerY + 2, width - 20, footerY + 2);
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, width - 50, footerY + 6, { align: 'center' });

  // Save PDF directly to user's computer
  const cleanName = (progress.name || 'Alumno').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Diploma_Codice_Alejandria_${cleanName}.pdf`);
}
