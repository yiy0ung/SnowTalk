import React from 'react';
import useAuth from 'utils/hooks/useAuth';
import { MainTemplate } from '../components/organism/template/MainTemplate';

function Home() {
  useAuth();

  return (
    <MainTemplate>
      <div>qwe</div>
    </MainTemplate>
  );
}

export default Home;