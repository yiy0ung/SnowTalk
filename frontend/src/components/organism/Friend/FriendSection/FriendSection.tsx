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
  const memberStore = useSelector((store: RootState) => store.member);
  const { member, friends } = memberStore;

  return (
    <div className="friend-section">
      {
        searchWord.length <= 0 && (
          <>
            <UserCard
              title={member.name}
              desc={member.intro}
              type="profile"
              imgIds={member.profileImg !== null ? [
                member.profileImg.name,
              ]:[]}
              avatar={{ size: 'xlarge' }}
            />
          </>
        )
      }
      <FriendList friends={friends} />
    </div>
  );
}

export default FriendSection;