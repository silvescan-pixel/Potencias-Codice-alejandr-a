import React from 'react';

interface PowerInputProps {
  baseValue: string;
  expValue: string;
  onBaseChange: (val: string) => void;
  onExpChange: (val: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  status?: 'default' | 'correct' | 'wrong';
  basePlaceholder?: string;
  expPlaceholder?: string;
  showLabels?: boolean;
  ariaLabel?: string;
}

/**
 * Visual two-box traditional power input:
 * [ Base ] with a raised smaller [ Exp ] box at the upper-right.
 * Zero `^` characters anywhere in the interface.
 */
export const PowerInput: React.FC<PowerInputProps> = ({
  baseValue,
  expValue,
  onBaseChange,
  onExpChange,
  disabled = false,
  size = 'md',
  status = 'default',
  basePlaceholder = 'base',
  expPlaceholder = 'exp',
  showLabels = false,
  ariaLabel = 'Entrada de potencia',
}) => {
  const borderColor =
    status === 'correct'
      ? 'border-[#00FF88] bg-[#00FF88]/10 text-white'
      : status === 'wrong'
      ? 'border-[#EF4444] bg-[#EF4444]/10 text-[#FCA5A5]'
      : 'border-[#D4AF37]/50 bg-[#120E0A] text-white focus:border-[#00E5FF]';

  const baseSizeClass =
    size === 'sm'
      ? 'w-16 h-9 text-sm px-1.5'
      : 'w-24 h-11 text-base px-2';

  const expSizeClass =
    size === 'sm'
      ? 'w-10 h-7 text-xs px-1 -mt-2.5'
      : 'w-12 h-8 text-xs px-1.5 -mt-3';

  return (
    <div
      className="inline-flex items-start gap-1 font-mono-math select-none pt-2.5"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col items-center">
        <input
          type="text"
          inputMode="text"
          value={baseValue}
          onChange={(e) => onBaseChange(e.target.value)}
          placeholder={basePlaceholder}
          disabled={disabled}
          aria-label="Base de la potencia"
          className={`${baseSizeClass} border-2 rounded-lg text-center font-bold focus:outline-none transition-colors placeholder:text-slate-600 placeholder:text-[11px] placeholder:font-normal ${borderColor}`}
        />
        {showLabels && (
          <span className="text-[10px] text-slate-400 mt-1 font-sans">Base</span>
        )}
      </div>

      <div className="flex flex-col items-center">
        <input
          type="text"
          inputMode="text"
          value={expValue}
          onChange={(e) => onExpChange(e.target.value)}
          placeholder={expPlaceholder}
          disabled={disabled}
          aria-label="Exponente de la potencia"
          className={`${expSizeClass} border-2 rounded-md text-center font-bold text-[#00E5FF] focus:outline-none transition-colors placeholder:text-slate-600 placeholder:text-[10px] placeholder:font-normal ${
            status === 'correct'
              ? 'border-[#00FF88] bg-[#00FF88]/10'
              : status === 'wrong'
              ? 'border-[#EF4444] bg-[#EF4444]/10'
              : 'border-[#00E5FF]/55 bg-[#120E0A] focus:border-[#D4AF37]'
          }`}
        />
        {showLabels && (
          <span className="text-[10px] text-[#00E5FF] mt-0.5 font-sans">Exp.</span>
        )}
      </div>
    </div>
  );
};
