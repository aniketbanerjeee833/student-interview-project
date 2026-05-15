import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface FormMessageProps {
  children: ReactNode;
}

export function Form({ children, ...props }: FormProps) {
  return <form className="form" {...props}>{children}</form>;
}

export function FormField({ children, ...props }: FormFieldProps) {
  return <div className="form-field" {...props}>{children}</div>;
}

export function FormMessage({ children }: FormMessageProps) {
  return <p className="form-message">{children}</p>;
}
