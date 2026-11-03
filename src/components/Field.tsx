import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <div className="field__control">{children}</div>
    </label>
  );
}
