import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsThreeDots, BsChatQuote } from 'react-icons/bs';
import Swal from 'sweetalert2';

import { Member } from 'utils/types/entity.type';
import { fetchRemoveFriendAsync } from 'store/reducers/member.reducer';
import { UserCard } from 'components/common/UserCard';

import './FriendList.scss';
import { DropdownMenu } from 'components/base/DropdownMenu';
import { DropdownMenuItem } from 'components/base/DropdownMenu/DropdownMenuItem';
import { emitCreateRoom } from 'store/reducers/chatSocket.reducer';

type Props = {
  friends: Member[];
};

function FriendList({ friends }: Props) {
  const dispatch = useDispatch();

  const onCreateChatRoom = useCallback((memberIdx: number) => {
    dispatch(emitCreateRoom({
      membersIdx: [memberIdx],
      type: 'personal',
    }));
  }, [dispatch]);
  
  const onRemoveFriend = useCallback((memberIdx: number) => {
    Swal.fire({
      title: '친구를 삭제하시겠습니까?',
      text: '이전 기록을 복구할 수 없습니다',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.value) {
        dispatch(fetchRemoveFriendAsync.request(memberIdx));
      }
    });
  }, [dispatch]);

  const friendNodes = friends.map((friend) => (
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
            onClick={() => onCreateChatRoom(friend.idx)} />
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
        friendNodes.length > 0 ? (
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