import React, { ReactNode, CSSProperties } from 'react';
import { IoMdClose } from 'react-icons/io';

import './Modal.scss';

type Props = {
  isOpen: boolean;
  onClose: Function;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: Props) {
  const invisible: CSSProperties = {
    display: 'none',
  };

  return (
    <div className="modal-bg" style={isOpen? {}:invisible}>
      <div className="modal">
        <div className="modal__tap">
          <IoMdClose onClick={() => onClose()} title="닫기" />
        </div>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;