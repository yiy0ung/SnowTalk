import React, { FormEvent } from 'react';

import './SimpleInput.scss';

type Props = {
  value: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  placeholder: string;
};

function SimpleInput({ value, onChange, placeholder }: Props) {
  return (
    <input
      className="simple-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default SimpleInput;