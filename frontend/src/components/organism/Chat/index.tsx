import React, { useState, useCallback, ChangeEvent } from 'react';
import { IoMdAdd } from 'react-icons/io';

import { ContentTemplate } from '../template/ContentTemplate';
import { Header } from 'components/base/Header';
import { Input } from 'components/base/Input';
import { WithModal } from 'components/base/WithModal';
import { ChatRoomList } from './ChatRoomList';
import { ChatMemberModal } from './ChatMemberModal';

function Chat() {
  const [searchChat, setSearchChat] = useState('');

  const onChangeSearchChat = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchChat(e.target.value);
  }, []);

  return (
    <ContentTemplate
      headerComponent={(
        <>
          <Header title="채팅">
            <WithModal modal={ChatMemberModal} modalProps={{type: 'create'}}>
              <IoMdAdd />
            </WithModal>
          </Header>
          <Input 
            value={searchChat}
            onChange={onChangeSearchChat} 
            placeholder="채팅방 이름, 참여자 검색" />
        </>
      )}
    >
      <ChatRoomList searchChat={searchChat} />
    </ContentTemplate>
  );
}

export default Chat;