import React from 'react';
import moment from 'moment';

import './DateBlock.scss';

type Props = {
  date: string;
}

function DateBlock({ date }: Props) {
  return (
    <div className="dateblock">
      <span>{moment(date).format('YYYY년 M월 D일').toString()}</span>
    </div>
  );
}

export default DateBlock;