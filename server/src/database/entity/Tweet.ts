import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("bigint")
  twitterId!: number;

  @Column()
  twitterIdString!: string;

  @Column()
  text!: string;

  @Column()
  handle!: string;
}
