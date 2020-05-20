import React from 'react';
import moment from 'moment';

import './SpeechBubble.scss';

type Props = {
  someone: boolean;
  message: string;
  date: string;
};

function SpeechBubble({ someone, message, date }: Props) {
  const displayDate = moment(date).format('h:m a').toString();
  
  if (someone === false) {
    return (
      <div className="speech-bubble speech-bubble-me">
        <div className="speech-bubble__date">
          <span>{displayDate}</span>
        </div>
        <div className="speech-bubble__message speech-bubble-me__message">
          <pre>{message}</pre>
        </div>
        <div>
          <div className="speech-bubble-me__tip"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="speech-bubble">
      <div>
        <div className="speech-bubble__tip"></div>
      </div>
      <div className="speech-bubble__message">
        {message}
      </div>
      <div className="speech-bubble__date">
        <span>{displayDate}</span>
      </div>
    </div>
  );
}

export default SpeechBubble;