import { InputType, Field } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsDate, IsOptional } from "class-validator";

@InputType()
export class UpdateStateInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  uf?: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  updatedAt!: Date;
}
