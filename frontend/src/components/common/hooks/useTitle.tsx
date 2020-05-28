import { Participant, ChatRoomType, Member } from "utils/types/entity.type";

const useTitle = (userIdx: number, participants: Participant[], roomType: ChatRoomType) => {
  console.log("useTitle");
  let activeMembers: Member[] = [];
  let roomTitle: string[] = []; // 방 제목
  let profileImgs = []; // 프로필 uuid's

  for (const partici of participants) {
    // 자신 제외 
    // 개인 채팅방이라면 상대의 활성화 여부와 상관없이 추가
    // 그룹이라면 활성화된 회원만 추가
    if (partici.member.idx !== userIdx
      && (roomType === 'personal' || partici.activation !== 0)) {
      activeMembers.push(partici.member);
      profileImgs.push(partici.member.profileImg?.name);
      roomTitle.push(partici.member.name);
    }
  }

  return {
    activeMembers,
    roomTitle,
    profileImgs,
  };
};

export default useTitle;
