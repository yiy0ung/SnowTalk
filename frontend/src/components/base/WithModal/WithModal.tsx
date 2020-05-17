import React, { ReactNode, useState, useCallback } from 'react';
import { Modal } from './Modal';

type Props = {
  modalContent: React.FC<any & {
    onClose: Function;
  }>;
  startOpen?: boolean;
  children: ReactNode;
};

const WithModal = ({ modalContent: ModalContent, startOpen = false, children }: Props) => {
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
        <ModalContent onClose={onClose} />
      </Modal>
    </>
  );
};

export default WithModal;