import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { RootState } from 'store/reducers';
import { ChatRoom } from 'utils/types/entity.type';
import link from 'config/link';
import { UserCard } from '../UserCard';

import './ChatRoomItem.scss';

type Props = {
  roomInfo: ChatRoom;
}

function ChatRoomItem({ roomInfo }: Props) {
  const { user } = useSelector((state: RootState) => state.member);
  const { idx, title, messages, participants, type } = roomInfo;

  let roomTitle: string[] = [];
  let profileImgs = [];
  let previevMsg = messages[0]?.message || (messages[0]?.msgfile && '<이미지 메시지>');

  for (const participant of participants) {
    if (participant.member.idx !== user.idx && (type === 'personal' || participant.activation !== 0)) {
      profileImgs.push(participant.member.profileImg?.name);
      roomTitle.push(participant.member.name);
    }
  }

  if (title) {
    roomTitle = [title];
  }

  return (
    <Link to={`${link.chatroom}/${idx}`}>
      <UserCard
        title={roomTitle.length > 0 ? roomTitle.join(', ') : '대화상대없음'}
        subtitle={type === 'group' && participants.length}
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