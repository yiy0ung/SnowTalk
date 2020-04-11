import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { SignSection } from 'components/organism/Sign/SignSection';
import link from 'config/link';
import { existToken } from 'utils/token';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

function Sign() {
  const { isLogin } = useSelector((store: RootState) => store.member);
  const history = useHistory();

  useEffect(() => {
    const logined = existToken() !== null;

    if (isLogin && logined) {
      history.push(link.home);
    }
  }, [history, isLogin]);

  return (
    <SignSection />
  );
}

export default Sign;