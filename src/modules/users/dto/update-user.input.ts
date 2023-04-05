import { InputType, Field, Int } from "@nestjs/graphql";

import { IsEmail, IsNotEmpty, IsString, IsDate, IsOptional, IsNumber } from "class-validator";

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  name?: string;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int)
  city_id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty({ message: "Email Invalido!" })
  @Field()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Senha é requirida" })
  @Field()
  password?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  updatedAt!: Date;
}
