import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'file' })
export class File {
  @PrimaryGeneratedColumn({ type: 'int' })
  idx: number;

  @Column({ type: 'varchar', length: 100 })
  url: string;

  @Column({ type: 'varchar', length: 20 })
  extend: string;
}
