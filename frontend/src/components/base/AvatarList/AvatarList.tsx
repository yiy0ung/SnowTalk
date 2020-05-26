import React from 'react';
import Avatar, { ImageType } from '../../base/Avatar/Avatar';

import './AvatarList.scss';

type Props = {
  imgIds: ImageType[];
};

function AvatarList({ imgIds }: Props) {
  let Avatars = (<></>);
  const imgUrlList = imgIds.slice(0, 4);
  
  if (imgUrlList.length <= 0 || imgUrlList.length === 1) {
    Avatars = (
      <div className="avatar-list__single">
        <Avatar imageId={imgUrlList[0]} size="medium" />
      </div>
    );
  } else if (imgUrlList.length === 2) {
    Avatars = (
      <div className="avatar-list__duo">
        {
          imgUrlList.map((imgUrl, idx) => (
            <Avatar key={idx} imageId={imgUrl} size="row-medium" />
          ))
        }
      </div>
    )
  } else {
    Avatars = (
      <div className="avatar-list__multi">
        {
          imgUrlList.map((imgUrl, idx) => (
            <Avatar key={idx} imageId={imgUrl} size="small" />
          ))
        }
      </div>
    );
  }

  return (
    <div className="avatar-list">
      {Avatars}
    </div>
  );
}

export default AvatarList;