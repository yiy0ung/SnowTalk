import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Member } from "./Member";
import { ChatRoom } from "./ChatRoom";

@Entity({ name: 'chat_participant' })
export class ChatParticipant {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname?: string;

  @Column({ type: 'int' })
  activation: number;

  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'CASCADE',
  })
  member: Member;

  @ManyToOne(type => ChatRoom, chatroom => chatroom.idx, {
    onDelete: 'CASCADE',
  })
  chatRoom: ChatRoom;
}
