import React, { ReactNode } from 'react';

import './DropdownMenuItem.scss';

type Props = {
  icon?: ReactNode;
  text: string;
  onClick: () => void;
};

function DropdownMenuItem({ icon, text, onClick }: Props) {
  return (
    <div className="dropdown-item" onClick={onClick}>
      <div className="dropdown-item__icon">
        {icon}
      </div>
      <div className="dropdown-item__text">{text}</div>
    </div>
  );
}

export default DropdownMenuItem;