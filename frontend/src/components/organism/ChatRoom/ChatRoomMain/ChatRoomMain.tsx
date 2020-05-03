import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { RootState } from 'store/reducers';
import { ChatRoomHead } from '../ChatRoomHead';
import { ChatRoomInput } from '../ChatRoomInput';
import { ChatRoomMsg } from '../ChatRoomMsg';
import link from 'config/link';

import './ChatRoomMain.scss';

type Props = {
  roomIdx: number;
}

function ChatRoomMain({ roomIdx }: Props) {
  const history = useHistory();
  const messageListRef = useRef<HTMLDivElement>(null);
  const { chatRooms } = useSelector((state: RootState) => state.chatSocket);
  const [chatRoom] = chatRooms.filter(chatRoom => chatRoom.idx === roomIdx);

  if (!chatRoom) {
    history.push(link.home);
  }

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="chatroom-main">
      <div className="chatroom-main__head">
        <ChatRoomHead roomInfo={chatRoom} />
      </div>

      <div className="chatroom-main__messages" ref={messageListRef}>
        <ChatRoomMsg roomInfo={chatRoom} />
      </div>

      <div className="chatroom-main__input">
        <ChatRoomInput />
      </div>
    </div>
  );
}

export default ChatRoomMain;