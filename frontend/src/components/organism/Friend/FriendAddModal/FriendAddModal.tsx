import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useInput from 'utils/hooks/useInput';
import { RootState } from 'store/reducers';
import { fetchAppendFriendAsync } from 'store/reducers/member.reducer';
import { Button } from 'components/base/Button';
import { SimpleInput } from 'components/base/SimpleInput';

import './FriendAddModal.scss';

type Props = {
  onClose: Function;
};

function FriendAddModal({ onClose }: Props) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.member);
  const friendId = useInput('');

  const onAppendFriend = useCallback(() => {
    const value = parseInt(friendId.value, 10);

    friendId.setValue('');
    if (!Number.isInteger(value)) {
      return;
    }

    dispatch(fetchAppendFriendAsync.request(value));
    onClose();
  }, [dispatch, friendId, onClose]);

  return (
    <div className="friend-add-modal">
      <div className="friend-add-modal__main">
        <div className="friend-add-modal__title">
          <span>친구 추가</span>
        </div>
        <div className="friend-add-modal__sec">
          <div className="friend-add-modal__sec-my">
            {user.friendId}
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
          <Button onClick={onAppendFriend}>친구 추가</Button>
        </div>
      </div>
    </div>
  );
}

export default FriendAddModal;