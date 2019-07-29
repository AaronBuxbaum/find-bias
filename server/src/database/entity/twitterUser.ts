import { Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Tweet } from "./tweet";

@Entity()
export class TwitterUser {
  @PrimaryColumn()
  public handle!: string;

  @OneToMany(type => Tweet, tweet => tweet.twitterUser)
  public tweets!: Tweet[];
}
