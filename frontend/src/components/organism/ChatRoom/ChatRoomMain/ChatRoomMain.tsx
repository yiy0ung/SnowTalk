import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { RootState } from 'store/reducers';
// import { fetchMessageRecord } from 'store/reducers/chatSocket.reducer';
import { ChatRoomHead } from '../ChatRoomHead';
import { ChatRoomInput } from '../ChatRoomInput';
import { ChatRoomMsg } from '../ChatRoomMsg';
import link from 'config/link';

import './ChatRoomMain.scss';

type Props = {
  roomIdx: number;
}

function ChatRoomMain({ roomIdx }: Props) {
  // const dispatch = useDispatch();
  const history = useHistory();
  const messageListRef = useRef<HTMLDivElement>(null);
  const { chatRooms } = useSelector((state: RootState) => state.chatSocket);
  const [chatRoom] = chatRooms.filter(chatRoom => chatRoom.idx === roomIdx);

  if (!chatRoom) {
    history.push(link.home);
  }

  // const onScrollMsgRecord = useCallback(() => {
  //   if (!messageListRef.current) {
  //     return;
  //   }
  //   console.log(messageListRef.current.scrollTop);
  //   if (messageListRef.current.scrollTop <= 0) {
  //     console.log(roomIdx);
  //     console.log(chatRoom.messages[chatRoom.messages.length - 1].idx);
  //     dispatch(fetchMessageRecord.request({
  //       roomIdx,
  //       lastMessageIdx: chatRoom.messages[chatRoom.messages.length - 1].idx,
  //     }));
  //   }
  // }, [chatRoom.messages, dispatch, roomIdx]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }

    return () => {};
  }, [chatRoom, history]);

  return (
    <div className="chatroom-main">
      <div className="chatroom-main__head">
        <ChatRoomHead roomInfo={chatRoom} />
      </div>

      <div 
        className="chatroom-main__messages" 
        ref={messageListRef} >
        <ChatRoomMsg roomInfo={chatRoom} />
      </div>

      <div className="chatroom-main__input">
        <ChatRoomInput roomInfo={chatRoom} />
      </div>
    </div>
  );
}

export default ChatRoomMain;