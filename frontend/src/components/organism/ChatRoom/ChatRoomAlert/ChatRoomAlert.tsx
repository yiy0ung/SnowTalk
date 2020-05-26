import React from 'react';

import './ChatRoomAlert.scss';

type AlertOption = {
  name: string;
  onClick: () => void;
};

type Props = {
  text: string;
  options: AlertOption[];
};

function ChatRoomAlert({ text, options }: Props) {
  const optionNodes = options.map((option, idx) => (
    <div key={idx} className="chat-alert__option" onClick={option.onClick}>
      <span>{option.name}</span>
    </div>
  ));

  return (
    <div className="chat-alert-wrap">
      <div className="chat-alert">
        <div className="chat-alert__text">
          {text}
        </div>
        <div className="chat-alert__options">
          {optionNodes}
        </div>
      </div>
    </div>
  );
}

export default ChatRoomAlert;