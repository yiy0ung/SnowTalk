import React, { CSSProperties } from 'react';

import './Avatar.scss';

export type Props = {
  url: string;
  size?: 'xlarge'|'large'|'medium'|'row-medium'|'small';
};

function Avatar({ url, size='medium' }: Props) {
  let style: CSSProperties = {};

  if (size === 'xlarge') {
    style = {
      width: '3.3rem',
      height: '3.3rem',
    };
  } else if (size === 'large') {
    style = {
      width: '2.8rem',
      height: '2.8rem',
    };
  } else if (size === 'medium') {
    style = {
      width: '2.5rem',
      height: '2.5rem',
    };
  } else if (size === 'row-medium') {
    style = {
      width: '1.7rem',
      height: '1.7rem',
    };
  } else {
    style = {
      width: '1.35rem',
      height: '1.35rem',
    };
  }

  return (
    <div className="avatar" style={style}>
      <img src={url} alt="profile-img" />
    </div>
  );
}

export default Avatar;