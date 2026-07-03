// Modal.tsx
import React from 'react';
import '../../styles/ui.css';

// Props for Modal component
interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

// Modal component
export default function Modal({ children, onClose }: ModalProps): React.ReactElement {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
