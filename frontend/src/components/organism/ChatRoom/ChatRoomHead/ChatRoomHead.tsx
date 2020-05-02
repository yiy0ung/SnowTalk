import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineInbox } from 'react-icons/ai';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { FaRegHeart, FaCog } from 'react-icons/fa';
import { TiDocumentText } from 'react-icons/ti';
import { GrAdd } from 'react-icons/gr';

import { ChatRoom } from 'utils/types/entity.type';
import { RootState } from 'store/reducers';
import { AvatarList } from 'components/base/AvatarList';
import link from 'config/link';

import './ChatRoomHead.scss';
import { DropdownMenu } from 'components/base/DropdownMenu';
import { DropdownMenuItem } from 'components/base/DropdownMenu/DropdownMenuItem';

type Props = {
  roomInfo: ChatRoom;
};

function ChatRoomHead({ roomInfo }: Props) {
  const { title, participants, type } = roomInfo;
  const memberStore = useSelector((state: RootState) => state.member);
  let roomTitle = [];
  let profileImgs = [];

  for (const participant of participants) {
    if (participant.member.idx !== memberStore.member.idx) {
      profileImgs.push(participant.member.profileImg?.name);
      roomTitle.push(participant.member.name);
    }
  }

  if (type === 'group') {
    roomTitle = ['그룹채팅'];
  }

  return (
    <div className="chatroom-head">
      <div className="chatroom-head__info">
        <AvatarList imgIds={profileImgs} />

        <div className="chatroom-head__main">
          <div className="chatroom-head__title">
            <span>{title || roomTitle.join(', ') || '알수없음'}</span>
            {type === 'group' 
              && <span className="chatroom-head__title-sub">({participants.length})</span>}
          </div>
          <div className="chatroom-head__icons">
            <span><FaRegHeart /></span>
            <span><TiDocumentText /></span>
            <span><AiOutlineInbox /></span>
            <span><FiSearch /></span>
          </div>
        </div>

        <div className="chatroom-head__options">
          <Link to={link.home} title="돌아가기">
            <div className="chatroom-head__option">
              <FiArrowLeft />
            </div>
          </Link>
          <DropdownMenu component={(
            <div className="chatroom-head__option">
              <AiOutlineMenu />
            </div>
          )}>
            <DropdownMenuItem
              icon={<GrAdd />}
              text="대화상대 추가"
              onClick={() => {}}
            />
            <DropdownMenuItem
              icon={<FaCog />}
              text="채팅방 설정"
              onClick={() => {}}
            />
            <DropdownMenuItem
              icon={<RiLogoutBoxLine />}
              text="채팅방 나가기"
              onClick={() => {}}
            />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default ChatRoomHead;