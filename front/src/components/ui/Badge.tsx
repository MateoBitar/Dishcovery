// Badge.tsx
import React from 'react';
import '../../styles/ui.css';

// Props for Badge component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
  [key: string]: any;
}

// Badge component
export default function Badge({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}: BadgeProps): React.ReactElement {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
