import React from 'react';
import { ChatRoom } from 'utils/types/entity.type';

type Props = {
  roomInfo: ChatRoom;
};

function ChatRoomMsg({ roomInfo }: Props) {
  return (
    <div>
      message
    </div>
  );
}

export default ChatRoomMsg;