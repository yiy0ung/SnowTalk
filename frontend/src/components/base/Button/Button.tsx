import React, { ReactNode } from 'react';

import './Button.scss';

type Props = {
  onClick: () => void;
  children: ReactNode;
  type?: 'primary'|'secondary';
};

function Button({ onClick, children, type = 'primary' }: Props) {
  const btnStyle = {
    primary: {},
    secondary: {
      backgroundColor: '#fff',
      color: '#282828',
      border: '1px solid #282828',
    },
  };

  return (
    <button className="basic-btn" onClick={onClick} style={btnStyle[type]}>
      <span>{children}</span>
    </button>
  );
}

export default Button;