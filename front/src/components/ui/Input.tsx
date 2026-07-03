// Input.tsx
import React, { forwardRef } from "react";
import "../../styles/ui.css";

// Props for Input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  id?: string;
  className?: string;
  error?: string;
}

// Input component
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      placeholder = "",
      type = "text",
      id,
      className = "",
      error,
      ...props
    },
    ref
  ): React.ReactElement => {
    return (
      <div className={`input-wrapper ${className}`}>
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input ${error ? "input-error-border" : ""}`}
          {...props}
        />
        {error && <p className="input-error-text">{error}</p>}
      </div>
    );
  }
);

export default Input;