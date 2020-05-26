
export enum ChatListener {
  chatError = 'chat-error',
  sendMsg = 'send-message',
  receiveMsg = 'receive-message',
  addRoomMember = 'add-room-member',
  getRooms = 'get-rooms',
  createRoom = 'create-room', // host
  createdRoom = 'created-room', // guest
  inviteRoom = 'invite-room', // host
  invitedRoom = 'invited-room', // guest
  leaveRoom = 'leave-room',
  leaveRoomMember = 'leave-room-member',
};
