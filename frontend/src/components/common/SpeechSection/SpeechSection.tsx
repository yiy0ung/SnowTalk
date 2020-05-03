import React from 'react';
import { Member, MessageType } from 'utils/types/entity.type';
import { Avatar } from 'components/base/Avatar';

import './SpeechSection.scss';
import { SpeechBubble } from 'components/base/SpeechBubble';

type Props = {
  member?: Member;
  message: string;
  loginMemberId: string;
  messageType: MessageType;
  sendDate: string;
  deleted: number;
};

function SpeechSection({
  member,
  message,
  loginMemberId,
  messageType,
  sendDate,
  // deleted,
}: Props) {


  if (messageType === 'system') {
    return (
      <div className="speech-section-system">
        {message}
      </div>
    );
  }

  if (!member || loginMemberId !== member.id) {
    return (
      <div className="speech-section">
        <div className="speech-section__column">
          <Avatar imageId={member?.profileImg?.name} size="large" />
        </div>
        <div className="speech-section__column speech-section__body">
          <div className="speech-section__speaker">
            {member?.name || '알수없음'}
          </div>
          <SpeechBubble
            someone={true}
            message={message}
            date={sendDate}
          />
        </div>
      </div>
    )
  }

  return (
    <SpeechBubble
      someone={false}
      message={message}
      date={sendDate}
    />
  );
}

export default SpeechSection;