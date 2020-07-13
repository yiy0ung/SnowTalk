import React, { useCallback, ReactNode } from 'react';
import { Picker } from 'emoji-mart';

import 'emoji-mart/css/emoji-mart.css'
import './EmojiPicker.scss';

type Props = {
  children: ReactNode;
  visible: boolean;
  onClose: () => void;
  onClickIcon: Function;
};

function EmojiPicker({ children, visible, onClose, onClickIcon }: Props) {
  const onAddEmoji = useCallback((emoji) => {
    onClickIcon(emoji.native);
    onClose();
  }, [onClickIcon, onClose]);

  return (
    <span className="emoji-picker">
      <div className="emoji-picker__hidden">
        <div className="emoji-picker__viewer" style={visible ? {}:{ display: 'none' }}>
          <Picker
            set="google"
            title='Pick your emoji…' emoji='point_up'
            onSelect={onAddEmoji} />
        </div>
      </div>
      
      <div>{children}</div>
    </span>
  );
}

export default EmojiPicker;