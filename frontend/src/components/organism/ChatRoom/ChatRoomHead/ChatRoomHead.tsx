import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineInbox } from 'react-icons/ai';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { FaRegHeart, FaCog } from 'react-icons/fa';
import { TiDocumentText } from 'react-icons/ti';
import { GrAdd } from 'react-icons/gr';

import { confirmAlert } from 'utils/alert';
import { ChatRoom } from 'utils/types/entity.type';
import { RootState } from 'store/reducers';
import { emitLeaveRoom } from 'store/reducers/chatSocket.reducer';
import { AvatarList } from 'components/base/AvatarList';
import { DropdownMenu } from 'components/base/DropdownMenu';
import { DropdownMenuItem } from 'components/base/DropdownMenu/DropdownMenuItem';
import { WithModal } from 'components/base/WithModal';
import { ChatMemberModal } from 'components/organism/Chat/ChatMemberModal';
import link from 'config/link';

import './ChatRoomHead.scss';

type Props = {
  roomInfo: ChatRoom;
};

function ChatRoomHead({ roomInfo }: Props) {
  const dispatch = useDispatch();
  const { title, participants, type } = roomInfo;
  const memberState = useSelector((state: RootState) => state.member);
  let roomTitle = [];
  let profileImgs = [];

  for (const participant of participants) {
    if (participant.member.idx !== memberState.user.idx) {
      roomTitle.push(participant.member.name);
      profileImgs.push(participant.member.profileImg?.name);
    }
  }

  if (type === 'group') {
    roomTitle = ['그룹채팅'];
  }

  const onLeaveRoom = useCallback((roomIdx: number) => {
    confirmAlert({
      title: '채팅방을 나가시겠습니까?',
      text: '초대 받지 않으면 다시 들어올 수 없습니다',
      confirmText: '나가기',
    }).then(result => {
      if (result.value) {
        dispatch(emitLeaveRoom({roomIdx}));
      }
    });
  }, [dispatch]);

  return (
    <div className="chatroom-head">
      <div className="chatroom-head__info">
        <AvatarList imgIds={profileImgs} />

        <div className="chatroom-head__main">
          <div className="chatroom-head__title">
            <span className="chatroom-head__title-main">
              {title || roomTitle.join(', ') || '알수없음'}
            </span>
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
            <WithModal 
              modal={ChatMemberModal} 
              modalProps={{
                type: 'invite',
                roomIdx: roomInfo.idx,
                participants: roomInfo.participants,
              }}>
              <DropdownMenuItem
                icon={<GrAdd />}
                text="대화상대 추가"
              />
            </WithModal>
            <DropdownMenuItem
              icon={<FaCog />}
              text="채팅방 설정"
              onClick={() => {}}
            />
            <DropdownMenuItem
              icon={<RiLogoutBoxLine />}
              text="채팅방 나가기"
              onClick={() => onLeaveRoom(roomInfo.idx)}
            />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default ChatRoomHead;