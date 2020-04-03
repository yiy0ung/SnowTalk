import React, { ReactNode } from 'react';
import { AvatarList } from 'components/base/AvatarList';
import Avatar, { Props as AvatarProps } from 'components/base/Avatar/Avatar';

import './UserCard.scss';

type Props = {
  title: string;
  desc: string;
  imgUrls: string[];
  type: 'profile'|'chat';
  avatar?: Pick<AvatarProps, "size">;
  additionalInfo?: ReactNode|string;
};

function UserCard({ title, desc, imgUrls, type, avatar, additionalInfo }: Props) {
  const userProfile = type === 'profile' ? (
    <Avatar url={imgUrls[0]} size={avatar?.size} />
  ) : (
    <AvatarList imgUrls={imgUrls} />
  );
  
  return (
    <div tabIndex={0} className="user-card">
      <div className="user-card__column">
        {userProfile}    
      </div>
      <div className="user-card__column user-card__content">
        <span className="user-card__title">{title}</span>
        <span className="user-card__desc">{desc}</span>
      </div>
      <div className="user-card__column user-card__additional">
        {additionalInfo}
      </div>
    </div>
  );
}

export default UserCard;