import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column("bigint")
  public twitterId!: number;

  @Column()
  public twitterIdString!: string;

  @Column()
  public text!: string;

  @Column()
  public handle!: string;
}
