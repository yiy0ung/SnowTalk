import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ChatParticipant } from "./ChatParticipant";
import { ChatMessage } from "./ChatMessage";

@Entity({ name: 'chat_room' })
export class ChatRoom {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column({ type: 'int' })
  activation: number;

  @OneToMany(type => ChatParticipant, participant => participant.member)
  participants: ChatParticipant[];

  @OneToMany(type => ChatMessage, message => message.chatRoom)
  messages: ChatMessage[];
}
