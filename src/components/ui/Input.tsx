import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={`w-full rounded-xl border bg-white/90 px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        } ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export default Input;
