import React from 'react';
import { ChatRoom } from 'utils/types/entity.type';
import { UserCard } from '../UserCard';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { Link } from 'react-router-dom';
import link from 'config/link';

type Props = {
  roomInfo: ChatRoom;
}

function ChatRoomItem({ roomInfo }: Props) {
  const memberStore = useSelector((state: RootState) => state.member);
  const { idx, title, messages, participants, type } = roomInfo;

  let roomTitle: string[] = [];
  let profileImgs = [];

  for (const participant of participants) {
    if (participant.member.idx !== memberStore.member.idx) {
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
      />
    </Link>
  );
}

export default ChatRoomItem;