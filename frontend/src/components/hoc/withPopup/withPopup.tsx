import React, { ReactNode } from 'react';

const withPopup = () => (PageComponent: ReactNode) => {
  

  return (
    <>
      {PageComponent}
      <div>qwe</div>
    </>
  )
};

export default withPopup;
