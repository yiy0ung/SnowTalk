import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { existToken } from 'utils/token';
import { RootState } from 'store/reducers';
import { SignSection } from 'components/organism/Sign/SignSection';
import { withPopup } from 'components/hoc/withPopup';
import link from 'config/link';

function Sign() {
  const { isLogin } = useSelector((state: RootState) => state.core);
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

export default withPopup(Sign);