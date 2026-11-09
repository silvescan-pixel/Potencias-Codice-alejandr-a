import React, { useState } from 'react';
import { RoleId } from '../types/game';
import { ROLES_DATA } from '../data/assets';
import { sound } from '../utils/sound';
import { Check, Shield, Server, Scroll, Leaf, ArrowRight, Sparkles } from 'lucide-react';

interface AvatarSelectScreenProps {
  studentName: string;
  studentGroup: string;
  onSelectRole: (role: RoleId) => void;
}

export const AvatarSelectScreen: React.FC<AvatarSelectScreenProps> = ({
  studentName,
  studentGroup,
  onSelectRole,
}) => {
  const [selected, setSelected] = useState<RoleId>('DIGITAL_ARCHAEOLOGIST');

  const roles = Object.values(ROLES_DATA);

  const getRoleIcon = (name: string) => {
    switch (name) {
      case 'Server': return <Server className="w-4 h-4 text-[#00E5FF]" />;
      case 'Scroll': return <Scroll className="w-4 h-4 text-[#D4AF37]" />;
      case 'Leaf': return <Leaf className="w-4 h-4 text-[#00FF88]" />;
      default: return <Shield className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  const handleConfirm = () => {
    sound.playSuccess();
    onSelectRole(selected);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Screen Title */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-[#1C150F] border border-[#D4AF37]/40 mb-3 shadow-lg">
          <Sparkles className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
          Selección de Especialidad Científica
        </h2>
        <p className="text-slate-300 text-xs mt-1">
          Expedicionario/a: <span className="text-[#D4AF37] font-semibold">{studentName}</span> · Grupo: <span className="text-[#00E5FF] font-semibold">{studentGroup}</span>
        </p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {roles.map((role) => {
          const isCurrent = selected === role.id;
          return (
            <div
              key={role.id}
              onClick={() => {
                sound.playClick();
                setSelected(role.id);
              }}
              className={`relative rounded-2xl cursor-pointer p-4 transition-all duration-300 border-2 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#1C150F] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.3)] scale-[1.02]'
                  : 'bg-[#16100B]/80 border-[#D4AF37]/25 hover:border-[#D4AF37]/60 hover:bg-[#1C150F]/70'
              }`}
            >
              {/* Selected Badge */}
              {isCurrent && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#D4AF37] text-[#120E0A] flex items-center justify-center font-bold text-xs shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div>
                {/* Character Avatar Image */}
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 border border-[#D4AF37]/30 bg-[#120E0A]">
                  <img
                    src={role.image}
                    alt={role.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Role Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-[#120E0A] border border-[#D4AF37]/40">
                    {getRoleIcon(role.iconName)}
                  </div>
                  <h3 className="font-bold text-white text-base">
                    {role.title}
                  </h3>
                </div>

                <div className="text-xs text-[#00E5FF] font-medium mb-2.5">
                  {role.tagline}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {role.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-slate-400">
                <span>Insignia inicial:</span>
                <span className="font-medium text-[#D4AF37] truncate max-w-[150px]">{role.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center">
        <button
          onClick={handleConfirm}
          className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E6C34E] hover:to-[#D4AF37] text-[#120E0A] font-bold text-base flex items-center gap-2 shadow-xl shadow-[#D4AF37]/25 transition-all hover:scale-105 active:scale-95"
        >
          <span>Confirmar Especialidad y Activar Códice</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
