import React, { ReactNode, useState, useCallback } from 'react';
import { Modal } from './Modal';

type Props = {
  modal: React.FC<any & {
    onClose: Function;
  }>;
  modalProps?: object;
  startOpen?: boolean;
  children: ReactNode;
};

const WithModal = ({ modal: ModalContent, modalProps, startOpen = false, children }: Props) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <div onClick={onOpen}>
        {children}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent onClose={onClose} {...modalProps} />
      </Modal>
    </>
  );
};

export default WithModal;