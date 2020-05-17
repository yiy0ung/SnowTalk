import React from 'react';
import {
  AiOutlineCheck, 
  AiOutlineWarning,
  AiOutlineExclamationCircle,
} from 'react-icons/ai';
import { MdChatBubbleOutline } from 'react-icons/md';
import { PopupLevel } from 'utils/types/system.type';

import './Toast.scss';

type Props = {
  title: string;
  message: string;
  level: PopupLevel;
}

function Toast({ title, message, level}: Props) {
  let levelIcon = null;

  if (level === 'success') {
    levelIcon = <AiOutlineCheck />;
  } else if (level === 'warning') {
    levelIcon = <AiOutlineWarning />;
  } else if (level === 'error') {
    levelIcon = <AiOutlineExclamationCircle />;
  } else if (level === 'info') {
    levelIcon = <MdChatBubbleOutline />
  }

  return (
    <div className={`toast toast-${level}`}>
      {levelIcon && <div className="toast__icon">{levelIcon}</div>}
      <div className="toast__content">
        <div className="toast__title">{title}</div>
        <div className="toast__msg">{message}</div>
      </div>
    </div>
  );
}

export default Toast;