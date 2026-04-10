'use client';

import { CheckCircle2, Trash2 } from 'lucide-react';

interface OrganizerToolsProps {
  onCancel: () => void;
  onComplete: () => void;
  disabled?: boolean;
}

export default function OrganizerTools({ onCancel, onComplete, disabled }: OrganizerToolsProps) {
  return (
    <div className="p-6 bg-surface-container-high border-2 border-dashed border-outline-variant space-y-4">
      <p className="font-headline font-black uppercase text-xs text-on-surface-variant tracking-widest">
        HERRAMIENTAS DE ORGANIZADOR
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onCancel}
          disabled={disabled}
          className="border-2 border-error text-error font-headline font-black uppercase text-xs p-3 hover:bg-error hover:text-on-error transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> CANCELAR
        </button>
        <button 
          onClick={onComplete}
          disabled={disabled}
          className="border-2 border-primary text-primary font-headline font-black uppercase text-xs p-3 hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" /> COMPLETAR
        </button>
      </div>
    </div>
  );
}
