import React from 'react';
import { MainTemplate } from 'components/organism/template/MainTemplate';
import { MoreSection } from 'components/organism/More/MoreSection';
import { withPopup } from 'components/hoc/withPopup';
import useAuth from 'utils/hooks/useAuth';

function More() {
  useAuth();

  return (
    <MainTemplate>
      <MoreSection/>
    </MainTemplate>
  );
}

export default withPopup(More);