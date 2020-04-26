import React, { useState, useCallback, ChangeEvent } from 'react';
import { ContentTemplate } from '../template/ContentTemplate';
import { Header } from 'components/base/Header';
import { Input } from 'components/base/Input';
import { ChatRoomList } from './ChatRoomList';

function Chat() {
  const [searchChat, setSearchChat] = useState('');

  const onChangeSearchChat = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchChat(e.target.value);
  }, []);

  return (
    <ContentTemplate
      headerComponent={(
        <>
          <Header title="채팅"/>
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