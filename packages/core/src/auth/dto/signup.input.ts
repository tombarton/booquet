import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field({ description: 'Set auth cookies after signup', nullable: true })
  autoLogin: boolean;
}
