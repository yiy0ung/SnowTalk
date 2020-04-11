import React from 'react';
import { UserCard } from 'components/common/UserCard';
import { Member } from 'utils/types/entity.type';

import './FriendList.scss';

type Props = {
  friends: Member[];
};

function FriendList({ friends }: Props) {
  const friendNodes = friends.map((friend) => (
    <UserCard
      key={friend.idx}
      title={friend.name}
      desc={friend.intro}
      type="profile"
      imgUrls={[]}
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
            <span>친구를 추가해보세요!</span>
          </div>
        )
      }
    </div>
  );
}

export default FriendList;