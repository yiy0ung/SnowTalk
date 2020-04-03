import React from 'react';
import { UserCard } from 'components/common/UserCard';
import { FriendList } from '../FriendList';

import './FriendSection.scss';

type Props = {
  searchWord: string;
};

function FriendSection({ searchWord }: Props) {
  // 스토어에서 친구 목록 불러오기
  const myComponent = '';

  return (
    <div className="friend-section">
      {
        searchWord.length <= 0 ? (
          <>
            <UserCard
              title="이진영"
              desc="멋진 일이 일어났으면 좋겠다"
              type="profile"
              imgUrls={[
                "https://i.stack.imgur.com/34AD2.jpg",
              ]}
              avatar={{ size: 'xlarge' }}
            />
            <FriendList />
          </>
        ) : (
          <FriendList />
        )
      }
    </div>
  );
}

export default FriendSection;