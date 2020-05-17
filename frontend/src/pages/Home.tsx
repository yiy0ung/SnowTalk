import React from 'react';
import Chat from 'components/organism/Chat';
import { MainTemplate } from 'components/organism/template/MainTemplate';
import { withPopup } from 'components/hoc/withPopup';
import useAuth from 'utils/hooks/useAuth';

function Home() {
  useAuth();

  return (
    <MainTemplate>
      <Chat />
    </MainTemplate>
  );
}

export default withPopup(Home);