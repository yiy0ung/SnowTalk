import React from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { CommonTemplate } from 'components/organism/template/CommonTemplate';
import { ChatRoomMain } from 'components/organism/ChatRoom/ChatRoomMain';
import { withPopup } from 'components/hoc/withPopup';
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

export default withPopup(ChatRoom);