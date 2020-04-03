import React, { ReactNode } from 'react';

import './ContentTemplate.scss';

type Props = {
  headerComponent: ReactNode;
  children: ReactNode;
};

function ContentTemplate({ headerComponent, children }: Props) {
  return (
    <main className="content-temp">
      <div className="content-temp__head">
        {headerComponent}
      </div>
      <div className="content-temp__body">
        {children}
      </div>
    </main>
  );
}

export default ContentTemplate;