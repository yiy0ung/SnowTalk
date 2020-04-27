import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ChatRoom } from "../database/models/ChatRoom";
import { Member } from "../database/models/Member";
import { FileRepository } from "../database/repositories/file.repository";
import { ChatMessageRepository } from "../database/repositories/chatMessage.repository";
import { ChatRoomRepository } from "../database/repositories/chat.repository";

@Service()
export class MessageService {
  constructor(
    @InjectRepository() private readonly chatRoomRepo: ChatRoomRepository,
    @InjectRepository() private readonly chatMsgRepo: ChatMessageRepository,
    @InjectRepository() private readonly fileRepo: FileRepository,
  ) {}
  
  public saveSystemMsg(room: ChatRoom, message: string) {
    return this.chatMsgRepo.saveSystemMessage(room, message);
  }

  public getMessage(roomIdx?: number, lastMessagesIdx?: number) {
    return this.chatMsgRepo.getMessageByChatRoomIdx(roomIdx, lastMessagesIdx);
  }

  public async saveUserMsg({
    roomIdx,
    fileIdx,
    sender,
    message,
  }: UserMessageForm) {
    const room = await this.chatRoomRepo.getRoomsByIdx(roomIdx, 1);

    if (!room || !sender) {
      return {
        success: false,
      };
    }

    const file = await this.fileRepo.getFileByIdx(fileIdx);
    const messageData = await this.chatMsgRepo.saveUserMessage(room, message, sender, file);

    return {
      success: true,
      room,
      messageData,
    }
  }
}

type UserMessageForm = {
  roomIdx: number;
  fileIdx: number;
  sender: Member;
  message: string;
}
