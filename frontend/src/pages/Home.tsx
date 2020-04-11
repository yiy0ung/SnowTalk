import React from 'react';
import { MainTemplate } from '../components/organism/template/MainTemplate';
import useAuth from 'utils/hooks/useAuth';

function Home() {
  useAuth();

  return (
    <MainTemplate>
      <div>qwe</div>
    </MainTemplate>
  );
}

export default Home;