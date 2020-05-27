import { IsEmail, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
