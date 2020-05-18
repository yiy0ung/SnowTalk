import React, { ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import './NameTag.scss';

type Props = {
  name: String;
  onClose?: () => void;
  btnVisible?: boolean;
  highlight?: boolean;
  itemNode?: ReactNode;
};

function NameTag({
  name,
  onClose,
  btnVisible = false,
  highlight = false,
  itemNode,
}: Props) {

  return (
    <div className={`name-tag ${highlight ? 'name-tag__highlight' : ''}`}>
      <span>{name}</span>
      {itemNode && <span>{itemNode}</span>}
      {
        btnVisible && (
          <span onClick={onClose} title="취소">
            <AiOutlineClose />
          </span>
        )
      }
    </div>
  );
}

export default NameTag;