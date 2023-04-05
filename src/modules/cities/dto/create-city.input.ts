import { InputType, Field, Int } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsBoolean, IsDate, IsNumber } from "class-validator";

@InputType()
export class CreateCityInput {
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  name: string;

  @IsBoolean()
  @IsNotEmpty({ message: "Precisa ser verdadeiro ou falso" })
  @Field({ nullable: true, defaultValue: true })
  active!: boolean;

  @IsDate()
  @Field({ nullable: true })
  createdAt!: Date;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int)
  state_id: number;
}
