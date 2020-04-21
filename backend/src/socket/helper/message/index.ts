import { Member } from "../../../database/models/Member";

export function invitingMsg(host: Member, guests: Member[]): string {
  let message = '';

  if (guests.length > 1) {
    message = `${host.name} 님이 ${guests[0].name} 외 ${guests.length - 1}명을 초대했습니다`;
  } else if (guests.length === 1) {
    message = `${host.name} 님이 ${guests[0].name}님을 초대했습니다`;
  }

  return message;
}

export function leavingMsg(leavingMember: Member): string {
  return `${leavingMember.name} 님이 채팅방을 나갔습니다`;
}
