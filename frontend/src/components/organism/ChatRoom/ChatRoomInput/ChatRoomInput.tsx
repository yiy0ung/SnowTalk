import React, { useRef, useCallback } from 'react';
import { FiSmile, FiImage } from 'react-icons/fi';
import useInput from 'utils/hooks/useInput';

import './ChatRoomInput.scss';

function ChatRoomInput() {
  const message = useInput('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textareaResize = useCallback(() => {
    if (!textareaRef.current) {
      return;
    }
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${12 + scrollHeight} px`;
  }, []);

  return (
    <div className="chatroom-input">
      <div className="chatroom-input__column">
        <span className="chatroom-input__icon"><FiSmile /></span>
        <span className="chatroom-input__icon"><FiImage /></span>
      </div>
      <div className="chatroom-input__column">
        <textarea
          onKeyDown={textareaResize}
          className="chatroom-input__messageArea"
          value={message.value}
          onChange={message.onChange}
          ref={textareaRef}></textarea>
      </div>
      <div className="chatroom-input__column">
        <button className="chatroom-input__btn">전송</button>
      </div>
    </div>
  );
}

export default ChatRoomInput;