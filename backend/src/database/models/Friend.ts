import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Member } from "./Member";

@Entity({ name: 'friend' })
export class Friend {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'CASCADE',
  })
  followingMember: Member;

  @ManyToOne(type => Member, member => member.idx, {
    onDelete: 'CASCADE',
  })
  followerMember: Member;
}
