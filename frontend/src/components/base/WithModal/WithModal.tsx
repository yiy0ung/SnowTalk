import React, { Children } from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Modal } from './Modal';

interface OutterProps {
  modal: React.FC;
  children: React.FC<{
    isOpen: boolean;
    onOpen: Function;
    onClose: Function;
  }>;
}

interface InnerProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}

interface HandlerProps {
  onOpen: Function;
  onClose: Function;
}

type Props = InnerProps & OutterProps & HandlerProps;

const WithModal: React.FC<Props> = ({ isOpen, onOpen, onClose, modal, children }) => {
  return (
    <>
      {Children.only(children({ isOpen, onOpen, onClose }))}
      <Modal isOpen={isOpen} onClose={onClose}>
        {modal}
      </Modal>
    </>
  );
}

export default compose(
  withState(
    'isOpen',
    'setIsOpen',
    false,
  ),
  withHandlers({
    onOpen: ({ setIsOpen }: InnerProps) => () => {
      setIsOpen(true);
    },
    onClose: ({ setIsOpen }: InnerProps) => () => {
      setIsOpen(false);
    },
  })
)(WithModal);