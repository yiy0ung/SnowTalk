import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/reducers';
import { UserCard } from 'components/common/UserCard';
import { FriendList } from '../FriendList';

import './FriendSection.scss';

type Props = {
  searchWord: string;
};

function FriendSection({ searchWord }: Props) {
  const { user, friends } = useSelector((state: RootState) => state.member);

  return (
    <div className="friend-section">
      {
        searchWord.length <= 0 && (
          <>
            <UserCard
              title={user.name}
              desc={user.intro}
              type="profile"
              imgIds={user.profileImg !== null ? [
                user.profileImg.name,
              ]:[]}
              avatar={{ size: 'xlarge' }}
            />
          </>
        )
      }
      <FriendList searchWord={searchWord} friends={friends} />
    </div>
  );
}

export default FriendSection;