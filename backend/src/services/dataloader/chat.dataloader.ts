import { Service } from "typedi";
import DataLoader from 'dataloader';
import { InjectRepository } from "typeorm-typedi-extensions";
import { groupBy } from 'lodash';

import { ChatMessage } from "../../database/models/ChatMessage";
import { ChatParticipant } from "../../database/models/ChatParticipant";
import { ChatParticipantRepository } from "../../database/repositories/chatParticipant.repository";
import { ChatMessageRepository } from "../../database/repositories/chatMessage.repository";

@Service()
export class ChatDataloader {
  public participantLoader: DataLoader<number, ChatParticipant[]>;
  public messageLoader: DataLoader<number, ChatMessage[]>;

  constructor(
    @InjectRepository() private readonly chatParticipantRepo: ChatParticipantRepository,
    @InjectRepository() private readonly chatMessageRepo: ChatMessageRepository,
  ) {
    this.participantLoader = new DataLoader(this.chatParticipantByRoomIdxs);
    this.messageLoader = new DataLoader(this.chatMessageByRoomIdxs);
  }

  private chatParticipantByRoomIdxs = async (roomIdxs: readonly number[]) => {
    const chatParticipants = await this.chatParticipantRepo.getParticipantByRoomIdxs(roomIdxs);
    const participants = groupBy(chatParticipants, 'chatRoomIdx');

    return roomIdxs.map(roomIdx => 
      Array.isArray(participants[roomIdx]) ? participants[roomIdx] : []);
  };

  private chatMessageByRoomIdxs = async (roomIdxs: readonly number[]) => {
    return [];
  };
}
