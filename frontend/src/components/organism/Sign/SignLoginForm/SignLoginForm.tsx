import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import useInput from 'utils/hooks/useInput';
import { fetchLoginAsync } from 'store/reducers/core.reducer';
import { SignInput } from 'components/base/SignInput';
import { Button } from 'components/base/Button';

import './SignLoginForm.scss';

function SignLoginForm() {
  const dispatch = useDispatch();
  const id = useInput('');
  const pw = useInput('');

  const onClickLogin = useCallback(() => {
    dispatch(fetchLoginAsync.request({
      id: id.value,
      pw: pw.value,
    }));
  }, [dispatch, id.value, pw.value]);

  const onEnterLogin = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      onClickLogin();
    }
  }, [onClickLogin]);

  return (
    <div className="sign-login-form">
      <div className="sign-login-form__inputs">
        <SignInput
          type="text" value={id.value} 
          onChange={id.onChange} placeholder="스노우톡 아이디" />
        <SignInput
          type="password" value={pw.value} onKeyUp={onEnterLogin}
          onChange={pw.onChange} placeholder="비밀번호" />
      </div>
      <div className="sign-login-form__btn">
        <Button onClick={onClickLogin}>로그인</Button>
      </div>
    </div>
  );
}

export default SignLoginForm;