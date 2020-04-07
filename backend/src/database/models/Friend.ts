import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Member } from "./Member";

@Entity({ name: 'friend' })
export class Friend {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  // 자신
  @JoinColumn({
    name: 'follower_member_idx',
  })
  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'CASCADE',
  })
  followerMember: Member;

  // 친구
  @JoinColumn({
    name: 'following_member_idx',
  })
  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'CASCADE',
  })
  followingMember: Member;
}
