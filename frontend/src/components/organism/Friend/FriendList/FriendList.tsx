import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsThreeDots, BsChatQuote } from 'react-icons/bs';

import { Member, ChatRoom } from 'utils/types/entity.type';
import { emitCreateRoom } from 'store/reducers/chatSocket.reducer';
import { fetchRemoveFriendAsync } from 'store/reducers/member.reducer';
import { UserCard } from 'components/common/UserCard';
import { DropdownMenu } from 'components/base/DropdownMenu';
import { DropdownMenuItem } from 'components/base/DropdownMenu/DropdownMenuItem';

import './FriendList.scss';
import { confirmAlert } from 'utils/alert';
import { RootState } from 'store/reducers';
import { useHistory } from 'react-router-dom';
import link from 'config/link';
import { hashPersonalChatCode } from 'utils/method';

type Props = {
  friends: Member[];
  searchWord: string;
};

function FriendList({ friends, searchWord }: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { member: { user }, chatSocket: { chatRooms } } = useSelector((state: RootState) => state);

  const onCreatePersonalRoom = useCallback((memberIdx: number) => {
    const room: any = find(chatRooms, {
      personalCode: hashPersonalChatCode([user.idx, memberIdx]),
    });

    if (room) {
      history.push(`${link.chatroom}/${room.idx}`);
    } else {
      dispatch(emitCreateRoom({
        membersIdx: [memberIdx],
        type: 'personal',
      }));
    }
  }, [chatRooms, dispatch, history, user.idx]);
  
  const onRemoveFriend = useCallback((memberIdx: number) => {
    confirmAlert({
      title: '친구를 삭제하시겠습니까?',
      text: '이전 기록을 복구할 수 없습니다',
      confirmText: '삭제',
    }).then(result => {
      if (result.value) {
        dispatch(fetchRemoveFriendAsync.request(memberIdx));
      }
    });
  }, [dispatch]);

  const friendNodes = friends.map((friend) => friend.name.match(searchWord) && (
    <UserCard
      key={friend.idx}
      title={friend.name}
      desc={friend.intro}
      type="profile"
      imgIds={friend.profileImg !== null ? [
        friend.profileImg.name,
      ]:[]}
      additionalInfo={(
        <DropdownMenu component={<BsThreeDots />}>
          <DropdownMenuItem 
            icon={<BsChatQuote />} 
            text="1대1 채팅"
            onClick={() => onCreatePersonalRoom(friend.idx)} />
          <DropdownMenuItem 
            icon={<FaRegTrashAlt />} 
            text="친구 삭제" 
            onClick={() => onRemoveFriend(friend.idx)} />
        </DropdownMenu>
      )}
    />
  ));

  return (
    <div className="friend-list">
      <div className="friend-list__head">
        <div className="friend-list__title">
          <span>친구</span>
          <span>{friendNodes.length}</span>
        </div>
      </div>
      {
        friends.length > 0 ? (
          <>{friendNodes}</>
        ) : (
          <div className="friend-list__empty">
            <span>아직 친구가 없으시네요</span>
            <span>친구를 추가해보세요!</span>
          </div>
        )
      }
    </div>
  );
}

export default FriendList;