import React from 'react';
import { UserCard } from 'components/common/UserCard';

import './FriendList.scss';

type Props = {

};

function FriendList() {
  const friends = [1,2,3,4,5,6,7,8,9];

  return (
    <div className="friend-list">
      <div className="friend-list__head">
        <div className="friend-list__title">
          <span>친구</span>
          <span>{friends.length}</span>
        </div>
      </div>
      <UserCard
        title="봇1"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="봇2"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="봇3"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="봇4"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="봇5"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="봇6"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="봇7"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="봇8"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
      <UserCard
        title="bot9"
        desc="멋진 일이 일어났으면 좋겠다"
        type="profile"
        imgUrls={[
          "https://i.stack.imgur.com/34AD2.jpg",
        ]}
      />
    </div>
  );
}

export default FriendList;