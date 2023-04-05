import { InputType, Field, Int } from "@nestjs/graphql";

import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsDate, IsNumber } from "class-validator";

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  name: string;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int)
  city_id: number;

  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty({ message: "Email Invalido!" })
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Senha é requirida" })
  @Field()
  password: string;

  @IsBoolean()
  @IsNotEmpty({ message: "Precisa ser verdadeiro ou falso" })
  @Field({ nullable: true, defaultValue: true })
  active!: boolean;

  @IsDate()
  @Field({ nullable: true })
  createdAt!: Date;
}
