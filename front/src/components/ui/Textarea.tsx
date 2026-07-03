// Textarea.tsx
import React from 'react';
import '../../styles/ui.css';

// Props for Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  className?: string;
}

// Textarea component
export default function Textarea({ 
  value, 
  onChange, 
  placeholder = '', 
  rows = 3, 
  id, 
  className = '', 
  ...props 
}: TextareaProps): React.ReactElement {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`textarea ${className}`}
      {...props}
    />
  );
}
