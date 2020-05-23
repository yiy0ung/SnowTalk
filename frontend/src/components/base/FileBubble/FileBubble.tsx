import React from 'react';
import { FileState } from 'utils/types/entity.type';
import server from 'config/server';

import './FileBubble.scss';
import moment from 'moment';

type Props = { 
  file: FileState;
  someone: boolean;
  date: string;
};

function FileBubble({ file, date, someone }: Props) {
  const displayDate = moment(date).format('h:m a').toString();

  return (
    <div className={`file-bubble ${someone ? '':'file-bubble-me'}`}>
      <div className="file-bubble__content">
        <img src={`${server.imgServer}/${file.name}`} alt="user_file_message" />
      </div>
      <div className="file-bubble__date">
        <span>{displayDate}</span>
      </div>
    </div>
  );
}

export default FileBubble;