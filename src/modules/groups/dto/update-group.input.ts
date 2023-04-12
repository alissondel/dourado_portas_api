import { InputType, Field } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsDate, IsOptional } from "class-validator";

@InputType()
export class UpdateGroupInput {
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  description: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  updatedAt!: Date;
}
