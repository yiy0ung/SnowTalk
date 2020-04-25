import React, { useCallback } from 'react';
import useAuth from 'utils/hooks/useAuth';
import { MainTemplate } from '../components/organism/template/MainTemplate';
import { useDispatch } from 'react-redux';
import { emitGetRooms } from 'store/reducers/chatSocket.reducer';

function Home() {
  useAuth();
  const dispatch = useDispatch();

  const onGetRooms = useCallback(() => {
    dispatch(emitGetRooms());
  }, [dispatch]);

  return (
    <MainTemplate>
      <div>qwe</div>
      <button onClick={onGetRooms}>getRooms</button>
    </MainTemplate>
  );
}

export default Home;