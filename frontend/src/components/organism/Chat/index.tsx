import React from 'react';
import { IoMdAdd } from 'react-icons/io';

import useInput from 'utils/hooks/useInput';
import { ContentTemplate } from '../template/ContentTemplate';
import { Header } from 'components/base/Header';
import { Input } from 'components/base/Input';
import { WithModal } from 'components/base/WithModal';
import { ChatRoomList } from './ChatRoomList';
import { ChatMemberModal } from './ChatMemberModal';

function Chat() {
  const searchChat = useInput('');

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
            value={searchChat.value}
            onChange={searchChat.onChange} 
            placeholder="채팅방 이름, 참여자 검색" />
        </>
      )}
    >
      <ChatRoomList searchChat={searchChat.value} />
    </ContentTemplate>
  );
}

export default Chat;