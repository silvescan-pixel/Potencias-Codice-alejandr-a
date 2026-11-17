import React from 'react';
import { AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ConfirmSubmitBannerProps {
  missingCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Inline confirmation prompt when a student attempts to lock a mission with blank fields.
 * Enforces high-stakes zero-retry awareness without using native browser alerts.
 */
export const ConfirmSubmitBanner: React.FC<ConfirmSubmitBannerProps> = ({
  missingCount,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="mb-5 p-4 rounded-xl bg-[#EF4444]/15 border-2 border-[#EF4444]/60 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-[#EF4444] mt-0.5" />
        <div>
          <div className="font-bold text-white">
            Aún tienes {missingCount} {missingCount === 1 ? 'respuesta sin completar' : 'respuestas sin completar'}
          </div>
          <p className="text-xs text-[#FCA5A5] mt-0.5 leading-relaxed">
            La validación de esta cámara es definitiva y no admite reintentos parciales. Si envías ahora, las casillas vacías contarán como fallo.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3.5 py-2 rounded-lg bg-[#120E0A] hover:bg-[#1C150F] text-slate-200 border border-[#D4AF37]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Seguir revisando</span>
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-3.5 py-2 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Confirmar envío definitivo</span>
        </button>
      </div>
    </div>
  );
};
