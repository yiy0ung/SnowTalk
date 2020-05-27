import React from 'react';
import './SignInput.scss';

type Props = {
  type: 'text'|'password';
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
};

function SignInput({
  type,
  value,
  onChange,
  placeholder,
  onKeyUp,
}: Props) {
  return (
    <input 
      className="sign-input"
      type={type}
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      placeholder={placeholder} />
  );
}

export default SignInput;