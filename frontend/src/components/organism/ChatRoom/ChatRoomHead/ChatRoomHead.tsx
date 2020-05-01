import React from 'react';
import { ChatRoom } from 'utils/types/entity.type';
import { Link } from 'react-router-dom';
import link from 'config/link';

type Props = {
  roomInfo: ChatRoom;
};

function ChatRoomHead({ roomInfo }: Props) {
  return (
    <div>
      <Link to={link.home}>
        <span>돌아가기</span>
      </Link>
    </div>
  );
}

export default ChatRoomHead;