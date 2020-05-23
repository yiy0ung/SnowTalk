import React, { useCallback, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { FiSmile, FiImage } from 'react-icons/fi';

import useInput from 'utils/hooks/useInput';
import { trimNextLine } from 'utils/method';
import { sendMessage, sendFileMessage } from 'store/reducers/chatSocket.reducer';

import './ChatRoomInput.scss';

type Props = {
  roomIdx: number;
}

function ChatRoomInput({ roomIdx }: Props) {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File|null>(null);
  const message = useInput('');

  const onSubmitMessage = useCallback(() => {
    console.log(message.value);

    if (message.value.length > 0) {
      dispatch(sendMessage({
        roomIdx,
        message: trimNextLine(message.value),
      }));
      
      message.setValue('');
    }
  }, [dispatch, message, roomIdx]);

  const onEnter = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey === false && e.keyCode === 13) {
      onSubmitMessage();
    }
  }, [onSubmitMessage]);

  const onSetFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }, []);

  const sendFileMsg = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("call upload");
      dispatch(sendFileMessage({
        roomIdx,
        message: null,
        file: e.target.files[0],
      }));
    }
    message.setValue('');
  }, [dispatch, message, roomIdx]);

  return (
    <div className="chatroom-input">
      <div className="chatroom-input__column">
        <span className="chatroom-input__icon"><FiSmile /></span>
        <span className="chatroom-input__icon">
          <label htmlFor="inputImg"><FiImage /></label>
          <input 
            type="file" id="inputImg" 
            onChange={sendFileMsg} />
        </span>
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