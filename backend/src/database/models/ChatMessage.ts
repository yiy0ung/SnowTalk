import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { ChatRoom } from "./ChatRoom";
import { Member } from "./Member";
import { File } from "./File";
import { MessageType } from "../enum/ChatType";

@Entity({ name: 'chat_message' })
export class ChatMessage {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'varchar', length: 1000 })
  message: string;

  @Column({ type: 'enum', enum: MessageType })
  type: MessageType;

  @Column({ type: 'int' })
  deleted: number;

  @Column({ type: 'varchar', name: 'create_at' })
  createAt: string;

  @ManyToOne(type => ChatRoom, chatroom => chatroom.idx, {
    onDelete: 'CASCADE',
  })
  chatRoom: ChatRoom;

  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  member: Member;

  @JoinColumn({
    name: 'file',
  })
  @OneToOne(type => File, file => file.idx, { nullable: true })
  file: File;
}
