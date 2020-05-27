import React, { ReactNode, CSSProperties } from 'react';

import './Modal.scss';

type Props = {
  isOpen: boolean;
  onClose: Function;
  children: ReactNode;
}

function Modal({ isOpen, children }: Props) {
  const invisible: CSSProperties = {
    display: 'none',
  };

  return (
    <div className="modal-bg" style={isOpen? {}:invisible}>
      <div className="modal">
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;