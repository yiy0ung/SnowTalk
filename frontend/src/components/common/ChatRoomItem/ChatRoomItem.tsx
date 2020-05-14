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
  const memberState = useSelector((state: RootState) => state.member);
  const { idx, title, messages, participants, type } = roomInfo;

  let roomTitle: string[] = [];
  let profileImgs = [];

  for (const participant of participants) {
    if (participant.member.idx !== memberState.user.idx) {
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
        title={roomTitle.length > 0 ? roomTitle.join(', ') : '알수없음'}
        subtitle={type === 'group' && participants.length}
        desc={messages[0]?.message||' '}
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