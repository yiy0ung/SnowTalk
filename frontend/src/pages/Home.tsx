import React from 'react';
import useAuth from 'utils/hooks/useAuth';
import { MainTemplate } from '../components/organism/template/MainTemplate';
// import { useDispatch } from 'react-redux';
// import { connectChatSocket } from 'store/reducers/chat.reducer';

function Home() {
  useAuth();

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(connectChatSocket());
  // }, [dispatch]);

  return (
    <MainTemplate>
      <div>qwe</div>
    </MainTemplate>
  );
}

export default Home;