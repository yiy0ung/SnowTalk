import React, { ReactNode } from 'react';

import './Button.scss';

type Props = {
  onClick: () => void;
  children: ReactNode;
  lock?: boolean;
  type?: 'primary'|'secondary';
};

function Button({ onClick, children, type = 'primary', lock = false }: Props) {
  const btnStyle = {
    primary: {},
    secondary: {
      backgroundColor: '#fff',
      color: '#282828',
      border: '1px solid #282828',
    },
  };

  return (
    <button 
      className={`basic-btn ${lock ? 'basic-btn-lock':''}`} 
      onClick={lock ? onClick : undefined}
      style={btnStyle[type]}
    >
      <span>{children}</span>
    </button>
  );
}

export default Button;