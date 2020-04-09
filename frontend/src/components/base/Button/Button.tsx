import React, { ReactNode } from 'react';

import './Button.scss';

type Props = {
  onClick: () => void;
  children: ReactNode;
};

function Button({ onClick, children }: Props) {
  return (
    <button className="basic-btn" onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}

export default Button;