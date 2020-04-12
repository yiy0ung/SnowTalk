import React, { useCallback } from 'react';
import Swal from 'sweetalert2';

import { UserCard } from 'components/common/UserCard';
import { Member } from 'utils/types/entity.type';
import { FaRegTrashAlt } from 'react-icons/fa';

import './FriendList.scss';
import { fetchRemoveFriendAsync } from 'store/reducers/member.reducer';
import { useDispatch } from 'react-redux';

type Props = {
  friends: Member[];
};

function FriendList({ friends }: Props) {
  const dispatch = useDispatch();
  
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
    })
  }, [dispatch]);

  const friendNodes = friends.map((friend) => (
    <UserCard
      key={friend.idx}
      title={friend.name}
      desc={friend.intro}
      type="profile"
      imgUrls={[]}
      additionalInfo={(
        <FaRegTrashAlt 
          className="friend-list__item-option remove"
          onClick={() => onRemoveFriend(friend.idx)} 
          title="친구 삭제" />
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