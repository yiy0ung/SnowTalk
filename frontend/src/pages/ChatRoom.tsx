import React from 'react';
import { CommonTemplate } from 'components/organism/template/CommonTemplate';
import { ChatRoomMain } from 'components/organism/ChatRoom/ChatRoomMain';
import { useRouteMatch, useHistory } from 'react-router-dom';
import link from 'config/link';

function ChatRoom() {
  const history = useHistory();
  const { params: { roomIdx } } = useRouteMatch();
  const chatRoomIdx = parseInt(roomIdx, 10);
  
  if (!chatRoomIdx) {
    history.push(link.home);
  }

  return (
    <CommonTemplate>
      <ChatRoomMain roomIdx={chatRoomIdx} />
    </CommonTemplate>
  );
}

export default ChatRoom;