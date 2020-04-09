import React from 'react';
import './SignInput.scss';

type Props = {
  type: 'text'|'password';
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

function SignInput({
  type,
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <input 
      className="sign-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder} />
  );
}

export default SignInput;