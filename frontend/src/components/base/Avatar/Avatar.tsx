import React, { CSSProperties } from 'react';
import server from 'config/server';
import defaultImg from 'assets/image/default-profile.jpg';
import './Avatar.scss';

export type ImageType = string|null|undefined;

export type Props = {
  imageId?: ImageType;
  size?: 'xlarge'|'large'|'medium'|'row-medium'|'small';
};

function Avatar({ imageId, size='medium' }: Props) {
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
      <img src={imageId ? `${server.imgServer}/${imageId}` : defaultImg} alt="profile-img" />
    </div>
  );
}

export default Avatar;