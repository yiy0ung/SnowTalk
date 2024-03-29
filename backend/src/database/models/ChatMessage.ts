import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, RelationId } from "typeorm";
import { ChatRoom } from "./ChatRoom";
import { Member } from "./Member";
import { File } from "./File";
import { MessageType } from "../enum/ChatType";

@Entity({ name: 'chat_message' })
export class ChatMessage {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  message: string;

  @Column({ type: 'enum', enum: MessageType })
  type: MessageType;

  @Column({ type: 'int', nullable: true, default: 0 })
  deleted: number;

  @Column({ type: 'varchar', name: 'create_at' })
  createAt: string;

  @RelationId((message: ChatMessage) => message.chatRoom)
  chatRoomIdx: number;

  @JoinColumn({ name: 'chat_room_idx' })
  @ManyToOne(type => ChatRoom, chatroom => chatroom.idx, {
    onDelete: 'CASCADE',
  })
  chatRoom: ChatRoom;

  @RelationId((message: ChatMessage) => message.member)
  memberIdx: number;

  @JoinColumn({ name: 'member_idx' })
  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  member: Member;

  @JoinColumn({
    name: 'msg_file',
  })
  @OneToOne(type => File, file => file.idx, { nullable: true })
  msgfile: File;
}
