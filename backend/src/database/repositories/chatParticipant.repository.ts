import { Repository, EntityRepository } from "typeorm";
import { ChatParticipant } from "../models/ChatParticipant";

@EntityRepository(ChatParticipant)
export class ChatParticipantRepository extends Repository<ChatParticipant> {

  
}
