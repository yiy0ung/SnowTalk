import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/reducers';
import { ChatRoomItem } from 'components/common/ChatRoomItem';
import lionEmpty from 'assets/image/lion-empty.png';

import './ChatRoomList.scss';

type Props = {
  searchChat: string;
};

function ChatRoomList({ searchChat }: Props) {
  const { chatRooms } = useSelector((state: RootState) => state.chatSocket);

  const chatRoomList = chatRooms.map(chatRoom => (
    <ChatRoomItem key={chatRoom.idx} roomInfo={chatRoom} />
  ));

  return (
    <>
      {
        (chatRooms.length > 0) ? (
          <div className="chat-list">
            {chatRoomList}
          </div>
        ) : (
          <div className="chat-list-empty">
            <img src={lionEmpty} alt="empty" />
            <span>아직 참여중인 채팅방이 없으세요?</span>
            <span>채팅방에 참여해 친구들과 소통해보세요.</span>
          </div>
        )
      }
    </>
  );
}

export default ChatRoomList;
