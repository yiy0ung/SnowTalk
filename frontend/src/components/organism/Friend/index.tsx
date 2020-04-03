import React, { useState, useCallback } from 'react';

import { ContentTemplate } from '../template/ContentTemplate';
import { Header } from 'components/base/Header';
import { Input } from 'components/base/Input';
import { FriendSection } from './FriendSection';

function Friend() {
  const [searchWord, setSearchWord] = useState<string>('');

  const onChangeSearchWord = useCallback((e) => {
    setSearchWord(e.target.value);
  }, []);

  return (
    <ContentTemplate
      headerComponent={(
        <>
          <Header title="친구" />
          <Input value={searchWord} onChange={onChangeSearchWord} placeholder="이름 검색" />
        </>
      )}
    >
      <FriendSection searchWord={searchWord} />
    </ContentTemplate>
  );
}

export default Friend;