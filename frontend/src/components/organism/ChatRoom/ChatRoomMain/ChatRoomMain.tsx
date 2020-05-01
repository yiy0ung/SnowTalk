import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from 'store/reducers';
import { ChatRoomHead } from '../ChatRoomHead';
import link from 'config/link';

import './ChatRoomMain.scss';

type Props = {
  roomIdx: number;
}

function ChatRoomMain({ roomIdx }: Props) {
  const history = useHistory();
  const { chatRooms } = useSelector((state: RootState) => state.chatSocket);
  const [chatRoom] = chatRooms.filter(chatRoom => chatRoom.idx === roomIdx);

  if (!chatRoom) {
    history.push(link.home);
  }

  return (
    <div className="chatroom-main">
      <div className="chatroom-main__head">
        <ChatRoomHead roomInfo={chatRoom} />
      </div>

      <div className="chatroom-main__chat">
        chat
      </div>

      <div className="chatroom-main__input">
        input
      </div>
    </div>
  );
}

export default ChatRoomMain;