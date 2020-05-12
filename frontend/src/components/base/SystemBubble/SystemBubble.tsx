import React from 'react';
import moment from 'moment';

import './SystemBubble.scss';

type Props = {
  message: string;
  option?: {
    date?: boolean;
  };
}

function DateBlock({ message, option }: Props) {
  let messageStr = message;

  if (option?.date) {
    messageStr = moment(message).format('YYYY년 M월 D일').toString();
  }

  return (
    <div className="dateblock">
      <span>{messageStr}</span>
    </div>
  );
}

export default DateBlock;