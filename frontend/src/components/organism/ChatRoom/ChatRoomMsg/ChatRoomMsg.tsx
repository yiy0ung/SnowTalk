import React, { Fragment } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { RootState } from 'store/reducers';
import { ChatRoom } from 'utils/types/entity.type';
import { SpeechSection } from 'components/common/SpeechSection';
import { DateBlock } from 'components/base/DateBlock';

import './ChatRoomMsg.scss';

type Props = {
  roomInfo: ChatRoom;
};

function ChatRoomMsg({ roomInfo }: Props) {
  const { member: logedMember } = useSelector((state: RootState) => state.member);
  const { messages } = roomInfo;

  const messageBubbles = messages.map((messageItem, index) => {
    const { idx, message, createAt, type, member, deleted } = messageItem;
    const provMessage = messages[index - 1];
    let dateSection = null;

    if (provMessage 
      && moment(provMessage.createAt).diff(moment(createAt), 'days') >= 1) {
      dateSection = (<DateBlock date={provMessage.createAt}/>);
    }

    return (
      <Fragment key={idx}>
        {dateSection}
        <SpeechSection
          messageType={type}
          loginMemberId={logedMember.id}
          member={member}
          message={message}
          sendDate={createAt}
          deleted={deleted} />
      </Fragment>
    );
  });

  return (
    <div className="chatroom-msg">
      {messageBubbles}
    </div>
  );
}

export default ChatRoomMsg;