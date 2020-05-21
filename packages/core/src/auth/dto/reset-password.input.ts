import { IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty()
  resetTokenHash: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @Field({ nullable: true })
  autoLogin: boolean;
}
