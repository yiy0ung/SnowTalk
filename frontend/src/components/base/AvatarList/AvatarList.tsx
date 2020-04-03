import React from 'react';
import Avatar from '../../base/Avatar/Avatar';

import './AvatarList.scss';

type Props = {
  imgUrls: string[];
};

function AvatarList({ imgUrls }: Props) {
  let Avatars = (<></>);
  const imgUrlList = imgUrls.slice(0, 4);
  
  if (imgUrlList.length === 1) {
    Avatars = (
      <Avatar url={imgUrlList[0]} size="medium" />
    );
  } else if (imgUrlList.length === 2) {
    Avatars = (
      <div className="avatar-list__duo">
        {
          imgUrlList.map((imgUrl, idx) => (
            <Avatar key={idx} url={imgUrl} size="row-medium" />
          ))
        }
      </div>
    )
  } else {
    Avatars = (
      <div className="avatar-list__multi">
        {
          imgUrlList.map((imgUrl, idx) => (
            <Avatar key={idx} url={imgUrl} size="small" />
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