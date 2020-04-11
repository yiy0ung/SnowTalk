import React, { Children, CSSProperties } from 'react';
import { IoMdClose } from 'react-icons/io';

import './Modal.scss';

type Props = {
  isOpen: boolean;
  onClose: Function;
  children: React.FC<{
    onClose: Function;
  }>;
}

function Modal({ isOpen, onClose, children }: Props) {
  const actions = {
    onClose,
  };

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
          {Children.only(children(actions))}
        </div>
      </div>
    </div>
  );
}

export default Modal;