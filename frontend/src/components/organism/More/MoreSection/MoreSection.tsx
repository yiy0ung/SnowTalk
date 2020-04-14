import React from 'react';
import { useSelector } from 'react-redux';

import server from 'config/server';
import { RootState } from 'store/reducers';
import { ContentTemplate } from 'components/organism/template/ContentTemplate';
import { Header } from 'components/base/Header';
import { UserCard } from 'components/common/UserCard';
import { MoreList } from '../MoreList';

function MoreSection() {
  const memberStore = useSelector((state: RootState) => state.member);
  const { member } = memberStore;

  return (
    <ContentTemplate
      headerComponent={(
        <>
          <Header title="더보기" />
        </>
      )}
    >
      <UserCard
        title={member.name}
        desc={member.intro}
        imgUrls={member.profileImg !== null ? [
          `${server.imgServer}/${member.profileImg.name}`,
        ]:[]}
        avatar={{ size: 'xlarge' }}
        type="profile"
      />
      <MoreList />
    </ContentTemplate>
  );
}

export default MoreSection;