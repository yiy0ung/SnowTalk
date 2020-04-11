import React, { useState, useCallback } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';

import { ContentTemplate } from '../template/ContentTemplate';
import { Header } from 'components/base/Header';
import { Input } from 'components/base/Input';
import { WithModal } from 'components/base/WithModal';
import { FriendSection } from './FriendSection';
import { FriendAddModal } from './FriendAddModal';

function Friend() {
  const [searchWord, setSearchWord] = useState<string>('');

  const onChangeSearchWord = useCallback((e) => {
    setSearchWord(e.target.value);
  }, []);

  return (
    <ContentTemplate
      headerComponent={(
        <>
          <Header title="친구">
            <WithModal modal={FriendAddModal}>
              {({ onOpen }: any) => (
                <AiOutlineUserAdd onClick={onOpen} />
              )}
            </WithModal>
          </Header>
          <Input value={searchWord} onChange={onChangeSearchWord} placeholder="이름 검색" />
        </>
      )}
    >
      <FriendSection searchWord={searchWord} />
    </ContentTemplate>
  );
}

export default Friend;