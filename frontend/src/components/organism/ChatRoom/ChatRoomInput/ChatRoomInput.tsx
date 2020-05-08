import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiSmile, FiImage } from 'react-icons/fi';
import useInput from 'utils/hooks/useInput';
import { sendMessage } from 'store/reducers/chatSocket.reducer';

import './ChatRoomInput.scss';

type Props = {
  roomIdx: number;
}

function ChatRoomInput({ roomIdx }: Props) {
  const dispatch = useDispatch();
  useState();
  const message = useInput('');

  const onSubmitMessage = useCallback(() => {
    console.log(message.value);

    if (message.value.length > 0) {
      dispatch(sendMessage({
        roomIdx,
        message: message.value,
      }));
      
      message.setValue('');
    }
  }, [dispatch, message, roomIdx]);

  const onEnter = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey === false && e.keyCode === 13) {
      onSubmitMessage();
    }
  }, [onSubmitMessage]);

  return (
    <div className="chatroom-input">
      <div className="chatroom-input__column">
        <span className="chatroom-input__icon"><FiSmile /></span>
        <span className="chatroom-input__icon"><FiImage /></span>
      </div>
      <div className="chatroom-input__column">
        <textarea
          className="chatroom-input__messageArea"
          value={message.value}
          onKeyUp={onEnter}
          onChange={message.onChange}></textarea>
      </div>
      <div className="chatroom-input__column">
        <button 
          className={`chatroom-input__btn ${message.value.length <= 0 ? 'chatroom-input__btn-lock':''}`} 
          onClick={onSubmitMessage}>전송</button>
      </div>
    </div>
  );
}

export default ChatRoomInput;