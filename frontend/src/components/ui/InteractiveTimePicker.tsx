'use client';

import { cn } from '@/lib/utils';
import { Clock, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface InteractiveTimePickerProps {
  value: string; // HH:mm in 24h
  onChange: (time: string) => void;
  required?: boolean;
}

export default function InteractiveTimePicker({
  value,
  onChange,
  required = false,
}: InteractiveTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  
  // Parse incoming value or default to 12:00 PM
  const initialDate = value ? new Date(`1970-01-01T${value}:00`) : new Date();
  const initH = initialDate.getHours();
  const initM = initialDate.getMinutes();
  
  const [hour, setHour] = useState(initH % 12 || 12);
  const [minute, setMinute] = useState(Math.floor(initM / 5) * 5);
  const [isPM, setIsPM] = useState(initH >= 12);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleUpdate = (h: number, m: number, pm: boolean) => {
    let finalH = h === 12 ? 0 : h;
    if (pm) finalH += 12;
    const hh = String(finalH).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    onChange(`${hh}:${mm}`);
  };

  const selectHour = (h: number) => {
    setHour(h);
    setMode('minutes');
    handleUpdate(h, minute, isPM);
  };

  const selectMinute = (m: number) => {
    setMinute(m);
    setTimeout(() => setIsOpen(false), 300);
    handleUpdate(hour, m, isPM);
  };

  const toggleAmPm = (pm: boolean) => {
    setIsPM(pm);
    handleUpdate(hour, minute, pm);
  };

  const displayTime = value ? value : '--:--';

  // Generate 12 items for the circle
  const renderCircleItems = () => {
    const items = mode === 'hours' 
      ? Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i))
      : Array.from({ length: 12 }, (_, i) => i * 5);

    return items.map((val) => {
      // Calculate position
      const isAngle0 = mode === 'hours' ? val === 12 : val === 0;
      const angleStep = 30; // 360 / 12
      const index = isAngle0 ? 0 : (mode === 'hours' ? val : val / 5);
      const angle = (index * angleStep - 90) * (Math.PI / 180);
      
      const radius = 95;
      const x = 110 + radius * Math.cos(angle);
      const y = 110 + radius * Math.sin(angle);

      const isSelected = mode === 'hours' ? hour === val : minute === val;

      return (
        <button
          key={val}
          type="button"
          onClick={() => (mode === 'hours' ? selectHour(val) : selectMinute(val))}
          className={cn(
            'absolute flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all hover:scale-110 -translate-x-1/2 -translate-y-1/2',
            isSelected
              ? 'bg-primary-container text-on-primary-fixed shadow-lg scale-110'
              : 'text-on-surface hover:bg-surface-container-highest'
          )}
          style={{ left: `${x}px`, top: `${y}px` }}
        >
          {String(val).padStart(2, '0')}
        </button>
      );
    });
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Field Simulator */}
      <button
        type="button"
        onClick={() => { setIsOpen(true); setMode('hours'); }}
        className="flex items-center w-full bg-surface-container-lowest border-b-2 border-outline-variant px-0 py-4 text-lg font-bold text-on-surface hover:border-primary-container transition-colors focus:outline-none"
      >
        <span className={cn('flex-1 text-left', !value && 'text-surface-container-highest')}>
          {displayTime}
        </span>
        <Clock className="text-primary w-5 h-5 ml-2" />
      </button>

      {/* Popover Clock */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-surface-container-low border border-outline-variant shadow-2xl p-6 min-w-[280px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-baseline gap-2 font-headline font-black text-3xl">
              <button 
                type="button"
                onClick={() => setMode('hours')}
                className={cn('hover:text-primary transition-colors', mode === 'hours' ? 'text-primary' : 'text-on-surface')}
              >
                {String(hour).padStart(2, '0')}
              </button>
              <span className="text-on-surface">:</span>
              <button 
                type="button"
                onClick={() => setMode('minutes')}
                className={cn('hover:text-primary transition-colors', mode === 'minutes' ? 'text-primary' : 'text-on-surface')}
              >
                {String(minute).padStart(2, '0')}
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              <button 
                type="button"
                onClick={() => toggleAmPm(false)}
                className={cn('text-xs font-bold px-2 py-1', !isPM ? 'bg-primary-container text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-container')}
              >
                AM
              </button>
              <button 
                type="button"
                onClick={() => toggleAmPm(true)}
                className={cn('text-xs font-bold px-2 py-1', isPM ? 'bg-primary-container text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-container')}
              >
                PM
              </button>
            </div>
          </div>

          {/* Clock Face */}
          <div className="relative w-[220px] h-[220px] mx-auto bg-surface-container rounded-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
            {renderCircleItems()}
          </div>

          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Hidden native input for form validation if required */}
      {required && (
        <input 
          type="text" 
          required 
          value={value} 
          onChange={() => {}} 
          className="absolute opacity-0 w-0 h-0 pointer-events-none" 
          tabIndex={-1}
        />
      )}
    </div>
  );
}
