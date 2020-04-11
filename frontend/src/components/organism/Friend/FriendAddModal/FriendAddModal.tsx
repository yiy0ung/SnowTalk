import React from 'react';
import { useSelector } from 'react-redux';

import useInput from 'utils/hooks/useInput';
import { RootState } from 'store/reducers';
import { Button } from 'components/base/Button';

import './FriendAddModal.scss';
import { SimpleInput } from 'components/base/SimpleInput';

type Props = {
  onClose: Function;
};

function FriendAddModal({ onClose }: Props) {
  const friendId = useInput('');
  const { member } = useSelector((state: RootState) => state.member);

  return (
    <div className="friend-add-modal">
      <div className="friend-add-modal__main">
        <div className="friend-add-modal__title">
          <span>친구 추가</span>
        </div>
        <div className="friend-add-modal__sec">
          <div className="friend-add-modal__sec-my">
            {member.friendId}
          </div>
          <div>내 친구 ID를 공유해주세요!</div>
        </div>
        <div className="friend-add-modal__add">
          <SimpleInput 
            value={friendId.value} 
            onChange={friendId.onChange}
            placeholder="친구 ID를 입력해주세요" />
        </div>
      </div>

      <div className="friend-add-modal__foot">
        <div>
          <Button onClick={() => {}}>친구 추가</Button>
        </div>
      </div>
    </div>
  );
}

export default FriendAddModal;