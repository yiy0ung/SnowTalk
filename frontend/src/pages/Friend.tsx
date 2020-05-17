import React from 'react';
import { MainTemplate } from 'components/organism/template/MainTemplate';
import FriendContent from 'components/organism/Friend';
import { withPopup } from 'components/hoc/withPopup';
import useAuth from 'utils/hooks/useAuth';

function Friend() {
  useAuth();

  return (
    <MainTemplate>
      <FriendContent />
    </MainTemplate>
  );
}

export default withPopup(Friend);