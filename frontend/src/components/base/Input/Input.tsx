import React, { FormEvent } from 'react';
import { FiSearch } from 'react-icons/fi';

import './Input.scss';

type Props = {
  value: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  placeholder: string;
};

function Input({ value, onChange, placeholder }: Props) {
  return (
    <div className="input">
      <div className="input__icon">
        <FiSearch />
      </div>
      <div className="input__area">
        <input 
          className="input__text"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Input;