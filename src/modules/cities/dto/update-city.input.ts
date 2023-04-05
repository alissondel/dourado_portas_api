import { InputType, Field, Int } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber } from "class-validator";

@InputType()
export class UpdateCityInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  name?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  updatedAt!: Date;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int)
  state_id?: number;
}
