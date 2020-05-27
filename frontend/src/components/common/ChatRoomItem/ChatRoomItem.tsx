import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { RootState } from 'store/reducers';
import { ChatRoom } from 'utils/types/entity.type';
import link from 'config/link';
import { UserCard } from '../UserCard';

import './ChatRoomItem.scss';
import useTitle from '../hooks/useTitle';

type Props = {
  roomInfo: ChatRoom;
}

function ChatRoomItem({ roomInfo }: Props) {
  const { user } = useSelector((state: RootState) => state.member);
  const { idx, title, messages, participants, type } = roomInfo;
  let previevMsg = messages[0]?.message || (messages[0]?.msgfile && '<이미지 메시지>');
  let { roomTitle, profileImgs } = useTitle(user.idx, participants, roomInfo.type);

  if (title) {
    roomTitle = [title];
  }

  return (
    <Link to={`${link.chatroom}/${idx}`}>
      <UserCard
        title={roomTitle.length > 0 ? roomTitle.join(', ') : '대화상대없음'}
        subtitle={type === 'group' && profileImgs.length + 1}
        desc={previevMsg||' '}
        imgIds={profileImgs}
        type="chat"
        additionalInfo={messages[0] ? (
          <div className="chatroomitem__date">
            {moment(messages[0].createAt).format('M월 D일')}
          </div>
        ) : ''}
      />
    </Link>
  );
}

export default ChatRoomItem;