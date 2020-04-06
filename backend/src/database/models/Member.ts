import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { ChatParticipant } from "./ChatParticipant";
import { ChatMessage } from "./ChatMessage";
import { Friend } from "./Friend";
import { File } from "./File";

@Entity()
export class Member {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'int', name: 'friend_id', unique: true })
  friendId: number;

  @Column({ type: 'varchar', length: 40, unique: true })
  id: string;

  @Column({ type: 'varchar', length: 400 })
  pw: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  intro?: string;

  // Relations
  @JoinColumn({
    name: 'profile_img'
  })
  @OneToOne(type => File, file => file.idx, {
    onDelete: 'SET NULL',
  })
  profileImg: File;

  @OneToMany(type => ChatParticipant, participant => participant.member)
  participations: ChatParticipant[];

  @OneToMany(type => ChatMessage, message => message.member)
  chatMessages: ChatMessage[];

  @OneToMany(type => Friend, friend => friend.followingMember)
  followings: Friend[];

  @OneToMany(type => Friend, friend => friend.followerMember)
  followers: Friend[];
}
