// user-follow.entity.ts
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.entity';

// Entity representing a follow relationship between users
@Entity('user_follows')
@ObjectType()
export class UserFollow {
  @PrimaryColumn('uuid')
  @Field()
  follower_id!: string;

  @PrimaryColumn('uuid')
  @Field()
  following_id!: string;

  @CreateDateColumn()
  @Field()
  followed_at!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower!: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  followingUser!: User;
}