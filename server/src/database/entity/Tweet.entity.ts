import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tweet {
  @Column()
  public handle!: string;

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public text!: string;

  @Column("bigint")
  public twitterId!: number;

  @Column()
  public twitterIdString!: string;
}
