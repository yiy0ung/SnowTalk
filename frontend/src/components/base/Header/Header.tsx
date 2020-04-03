import React, { ReactNode } from 'react';

import './Header.scss';

type Props = {
  title: string;
  children?: ReactNode;
};

function Header({ title, children }: Props) {
  return (
    <div className="header">
      <div>
        {title}
      </div>
      {
        children && (
          <div className="header__options">
            {children}
          </div>
        )
      }
    </div>
  );
}

export default Header;