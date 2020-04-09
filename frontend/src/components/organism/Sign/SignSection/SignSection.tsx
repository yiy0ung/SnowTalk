import React from 'react';

import logo from 'assets/image/logo.png';
import { SignLoginForm } from '../SignLoginForm';

import './SignSection.scss';

function SignSection() {
  return (
    <div className="sign-section">
      <div className="sign-section__body">
        <div className="sign-section__logo">
          <img src={logo} alt="logo" />
        </div>
        <SignLoginForm />
      </div>
      <div className="sign-section__foot">
        <span>회원가입</span>
        <span>개발자 정보</span>
      </div>
    </div>
  );
}

export default SignSection;