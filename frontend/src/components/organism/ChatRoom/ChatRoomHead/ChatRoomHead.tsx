import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { findIndex } from 'lodash';
import { AiOutlineMenu, AiOutlineInbox } from 'react-icons/ai';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { FaRegHeart, FaCog } from 'react-icons/fa';
import { TiDocumentText } from 'react-icons/ti';
import { IoMdAdd } from 'react-icons/io';

import { confirmAlert } from 'utils/alert';
import { ChatRoom, Participant, Member, ChatRoomType } from 'utils/types/entity.type';
import { RootState } from 'store/reducers';
import { emitLeaveRoom } from 'store/reducers/chatSocket.reducer';
import { ChatRoomAlert } from '../ChatRoomAlert';
import { AvatarList } from 'components/base/AvatarList';
import { DropdownMenu } from 'components/base/DropdownMenu';
import { DropdownMenuItem } from 'components/base/DropdownMenu/DropdownMenuItem';
import { WithModal } from 'components/base/WithModal';
import { ChatMemberModal } from 'components/organism/Chat/ChatMemberModal';
import link from 'config/link';

import './ChatRoomHead.scss';
import useTitle from 'components/common/hooks/useTitle';
import { fetchAppendFriendAsync } from 'store/reducers/member.reducer';

type Props = {
  roomInfo: ChatRoom;
};

// 친구 관계일 때 true,
function checkUserFriends(userIdx: number, particis: Participant[]|undefined, friends: Member[], roomType: ChatRoomType) {
  if (roomType === 'group') {
    return true;
  }

  const partici = particis?.filter((p) => p.memberIdx !== userIdx);
  if (!partici || partici.length <= 0) { // 상대방이 없음
    return true;
  }

  const idx = findIndex(friends, { idx: partici[0].memberIdx });
  if (idx >= 0) { // 친구임
    return true;
  }

  return false;
}

function ChatRoomHead({ roomInfo }: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { title, participants, type } = roomInfo;
  const { user, friends } = useSelector((state: RootState) => state.member);
  let { activeMembers, roomTitle, profileImgs } = useTitle(user.idx, participants, roomInfo.type);

  if (type === 'group') {
    roomTitle = ['그룹채팅'];
  }

  const onAppendFriend = useCallback(() => {
    if (roomInfo.type === 'personal' && activeMembers[0]) {
      dispatch(fetchAppendFriendAsync.request(
        parseInt(activeMembers[0].friendId, 10)
      ));
    }
  }, [activeMembers, dispatch, roomInfo.type]);

  const onLeaveRoom = useCallback(() => {
    confirmAlert({
      title: '채팅방을 나가시겠습니까?',
      text: '초대 받지 않으면 다시 들어올 수 없습니다',
      confirmText: '나가기',
    }).then(result => {
      if (result.value) {
        dispatch(emitLeaveRoom({
          roomIdx: roomInfo.idx,
        }));
      }
    });
  }, [dispatch, roomInfo.idx]);

  const onGoToHome = useCallback(() => {
    history.push(link.home);
  }, [history]);

  const options = [{
    name: '친구 추가',
    onClick: onAppendFriend,
  }, {
    name: '채팅방 나가기',
    onClick: onLeaveRoom,
  }];

  return (
    <>
      <div className="chatroom-head">
        <div className="chatroom-head__info">
          <AvatarList imgIds={profileImgs} />

          <div className="chatroom-head__main">
            <div className="chatroom-head__title">
              <span className="chatroom-head__title-main">
                {title || roomTitle.join(', ') || '알수없음'}
              </span>
              {type === 'group' 
                && <span className="chatroom-head__title-sub">({profileImgs.length + 1})</span>}
            </div>
            <div className="chatroom-head__icons">
              <span><FaRegHeart /></span>
              <span><TiDocumentText /></span>
              <span><AiOutlineInbox /></span>
              <span><FiSearch /></span>
            </div>
          </div>

          <div className="chatroom-head__options">
            {
              roomInfo.type === 'group' && (
                <WithModal 
                  modal={ChatMemberModal} 
                  modalProps={{
                    type: 'invite',
                    roomIdx: roomInfo.idx,
                    participants: roomInfo.participants,
                  }}>
                  <div className="chatroom-head__option" title="대화상대 초대">
                    <IoMdAdd />
                  </div>
                </WithModal>
              )
            }

            <DropdownMenu component={(
              <div className="chatroom-head__option">
                <AiOutlineMenu />
              </div>
            )}>
              <DropdownMenuItem
                icon={<FiArrowLeft />}
                text="홈으로"
                onClick={onGoToHome}
              />
              <DropdownMenuItem
                icon={<FaCog />}
                text="채팅방 설정"
                onClick={() => {}}
              />
              <DropdownMenuItem
                icon={<RiLogoutBoxLine />}
                text="채팅방 나가기"
                onClick={onLeaveRoom}
              />
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="chatroom-head-alert">
      {
        (!checkUserFriends(user.idx, participants, friends, roomInfo.type)) && (
          <ChatRoomAlert
            text="⚠ 친구 추가가 되어있지 않는 회원입니다"
            options={options}
          />
        )
      }
      </div>
    </>
  );
}

export default ChatRoomHead;