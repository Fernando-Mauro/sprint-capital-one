import type { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  icon: LucideIcon;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  minLength?: number;
}

export default function FormField({
  label,
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  required,
  minLength,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="font-headline text-xs font-black uppercase tracking-widest text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
        <input
          className={`w-full bg-surface-container-lowest border-0 border-b-2 ${
            error ? 'border-error' : 'border-outline-variant focus:border-primary-container'
          } focus:ring-0 text-on-surface font-bold p-4 pl-12 placeholder:text-outline transition-all focus:outline-none`}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
        />
      </div>
      {error && <p className="text-error text-xs font-bold uppercase tracking-wider">{error}</p>}
    </div>
  );
}
