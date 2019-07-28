import { Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Tweet } from "./Tweet.entity";

@Entity()
export class TwitterUser {
  @PrimaryColumn()
  public handle!: string;

  @OneToMany(type => Tweet, tweet => tweet.twitterUser)
  public tweets!: Tweet[];
}
