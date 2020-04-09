import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SignSection } from 'components/organism/Sign/SignSection';
import { RootState } from 'store/reducers';
import link from 'config/link';

type Props = {
  history: any;
}

function Sign({ history }: Props) {
  const memberStore = useSelector((stores: RootState) => stores.member);

  useEffect(() => {
    if (memberStore.isLogin === true && localStorage.getItem('refresh')) {
      history.push(link.home);
    }
  }, [history, memberStore.isLogin]);

  return (
    <SignSection />
  );
}

export default withRouter(Sign);