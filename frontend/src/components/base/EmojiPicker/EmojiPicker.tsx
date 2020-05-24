import React, { useCallback, ReactNode } from 'react';
import Picker, { IEmojiData } from 'emoji-picker-react';

import './EmojiPicker.scss';

type Props = {
  children: ReactNode;
  visible: boolean;
  onClose: () => void;
  onClickIcon: Function;
};

function EmojiPicker({ children, visible, onClose, onClickIcon }: Props) {
  const onAddEmoji = useCallback((event, emojiObject: IEmojiData) => {
    onClickIcon(emojiObject.emoji);
    onClose();
  }, [onClickIcon, onClose]);

  return (
    <span className="emoji-picker">
      <div className="emoji-picker__hidden">
        <div className="emoji-picker__viewer" style={visible ? {}:{ display: 'none' }}>
          <Picker onEmojiClick={onAddEmoji} />
        </div>
      </div>
      
      <div>{children}</div>
    </span>
  );
}

export default EmojiPicker;