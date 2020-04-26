import React from 'react';
import { MainTemplate } from 'components/organism/template/MainTemplate';
import Chat from 'components/organism/Chat';
import useAuth from 'utils/hooks/useAuth';

function Home() {
  useAuth();

  return (
    <MainTemplate>
      <Chat />
    </MainTemplate>
  );
}

export default Home;