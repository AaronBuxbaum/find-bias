import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

import { TwitterUser } from "./twitterUser";

@Entity()
export class Tweet {
  @Column()
  public text!: string;

  @PrimaryColumn("bigint")
  public twitterId!: number;

  @Column()
  public twitterIdString!: string;

  @ManyToOne(type => TwitterUser, twitterUser => twitterUser.tweets)
  public twitterUser!: TwitterUser;
}
