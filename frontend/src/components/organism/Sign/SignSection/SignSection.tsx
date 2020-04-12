import React, { useState } from 'react';

import logo from 'assets/image/logo.png';
import { SignLoginForm } from '../SignLoginForm';
import { SignUpModal } from '../SignUpModal';

import './SignSection.scss';

function SignSection() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="sign-section">
      <div className="sign-section__body">
        <div className="sign-section__logo">
          <img src={logo} alt="logo" />
        </div>
        <SignLoginForm />
      </div>
      <div className="sign-section__foot">
        <span onClick={() => setVisible(true)}>회원가입</span>
        <span>개발자 정보</span>
      </div>
      <SignUpModal 
        visible={visible} 
        onClose={() => setVisible(false)}
        type="signup" />
    </div>
  );
}

export default SignSection;