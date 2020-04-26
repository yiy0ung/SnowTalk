import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, JoinColumn } from "typeorm";
import { Member } from "./Member";
import { ChatRoom } from "./ChatRoom";

@Entity({ name: 'chat_participant' })
export class ChatParticipant {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname?: string;

  @Column({ type: 'int', default: 1 })
  activation: number;

  // @JoinColumn({ name: 'member_idx' })
  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'CASCADE',
  })
  member: Member;

  // @JoinColumn({ name: 'chat_room_idx' })
  @ManyToOne(type => ChatRoom, chatroom => chatroom.idx, {
    onDelete: 'CASCADE',
  })
  chatRoom: ChatRoom;
}
