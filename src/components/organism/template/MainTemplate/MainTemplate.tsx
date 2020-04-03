import React, { ReactNode } from 'react';
import { SideNavBar } from 'components/base/SideNavBar';

import './MainTemplate.scss';

type Props = {
  children: ReactNode;
};

function MainTemplate({ children }: Props) {
  return (
    <div className="main-template">
      <div className="main-template__nav">
        <SideNavBar />
      </div>

      <div className="main-template__content">
        {children}
      </div>
    </div>
  );
}

export default MainTemplate;