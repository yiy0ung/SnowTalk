import { findIndex } from 'lodash';
import { Participant, Member, ChatRoomType } from 'utils/types/entity.type';

// 친구 관계일 때 true,
export function checkUserFriends(
  userIdx: number,
  particis: Participant[]|undefined,
  friends: Member[],
  roomType: ChatRoomType,
) {
  if (roomType === 'group') {
    return true;
  }

  const partici = particis?.filter((p) => p.memberIdx !== userIdx);
  if (!partici || partici.length <= 0) { // 상대방이 없음
    return true;
  }

  const idx = findIndex(friends, { idx: partici[0].memberIdx });
  if (idx >= 0) { // 친구임
    return true;
  }

  return false;
}

