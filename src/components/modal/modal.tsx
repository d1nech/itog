import { FC, memo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const MODAL_ROOT_ID = 'modals';

const useEscapeKeyHandler = (onClose: () => void) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};

const ModalComponent: FC<TModalProps> = ({ title, onClose, children }) => {
  useEscapeKeyHandler(onClose);

  const modalContainer = document.getElementById(MODAL_ROOT_ID);

  if (!modalContainer) {
    return null;
  }

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalContainer
  );
};

export const Modal = memo(ModalComponent);
