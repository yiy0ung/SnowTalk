import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function ChatRoomTemplate({ children }: Props) {
  return (
    <div style={{ paddingTop: '2.5rem', height: '100%' }}>
      {children}
    </div>
  );
}

export default ChatRoomTemplate;