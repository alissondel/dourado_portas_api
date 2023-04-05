import { InputType, Field } from "@nestjs/graphql";

import { IsEmail, IsString } from "class-validator";

@InputType()
export class AuthInput {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;
}
