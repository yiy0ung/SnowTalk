import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ChatParticipant } from "./ChatParticipant";
import { ChatMessage } from "./ChatMessage";
import { RoomType } from "../enum/ChatType";

@Entity({ name: 'chat_room' })
export class ChatRoom {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({ type: 'int', default: 1 })
  activation: number;

  @Column({ type: 'enum', enum: RoomType })
  type: RoomType;

  @Column({ type: 'varchar', name: 'personal_code', unique: true, nullable: true })
  personalCode: string;

  @OneToMany(type => ChatParticipant, participant => participant.chatRoom)
  participants: ChatParticipant[];

  @OneToMany(type => ChatMessage, message => message.chatRoom)
  messages: ChatMessage[];
}
