import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/reducers';
import { ContentTemplate } from 'components/organism/template/ContentTemplate';
import { Header } from 'components/base/Header';
import { UserCard } from 'components/common/UserCard';
import { MoreList } from '../MoreList';

function MoreSection() {
  const { user } = useSelector((state: RootState) => state.member);

  return (
    <ContentTemplate
      headerComponent={(
        <>
          <Header title="더보기" />
        </>
      )}
    >
      <UserCard
        title={user.name}
        desc={user.intro}
        imgIds={user.profileImg !== null ? [
          user.profileImg.name,
        ]:[]}
        avatar={{ size: 'xlarge' }}
        type="profile"
      />
      <MoreList />
    </ContentTemplate>
  );
}

export default MoreSection;