import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user';
import { Token } from './token';

@ObjectType()
export class Auth extends Token {
  @Field({ description: 'User details' })
  user: User;
}
