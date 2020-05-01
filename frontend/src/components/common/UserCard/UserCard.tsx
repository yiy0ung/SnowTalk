import React, { ReactNode } from 'react';
import { AvatarList } from 'components/base/AvatarList';
import Avatar, { Props as AvatarProps, ImageType } from 'components/base/Avatar/Avatar';

import './UserCard.scss';

type Props = {
  title: string;
  subtitle?: ReactNode;
  desc: string;
  imgIds: ImageType[];
  type: 'profile'|'chat';
  avatar?: Pick<AvatarProps, "size">;
  additionalInfo?: ReactNode|string;
};

function UserCard({ title, subtitle, desc, imgIds, type, avatar, additionalInfo }: Props) {
  const userProfile = type === 'profile' ? (
    <Avatar imageId={imgIds[0]} size={avatar?.size} />
  ) : (
    <AvatarList imgIds={imgIds} />
  );
  
  return (
    <div tabIndex={0} className="user-card">
      <div className="user-card__column">
        {userProfile}    
      </div>
      <div className="user-card__column user-card__content">
        <div className="user-card__head">
          <span className="user-card__title">{title}</span>
          {subtitle && <span className="user-card__subtitle">{subtitle}</span>}
        </div>
        {desc && <span className="user-card__desc">{desc}</span>}
      </div>
      <div className="user-card__column user-card__additional">
        {additionalInfo}
      </div>
    </div>
  );
}

export default UserCard;