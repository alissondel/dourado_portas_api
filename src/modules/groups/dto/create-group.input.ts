import { InputType, Field } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsBoolean, IsDate } from "class-validator";

@InputType()
export class CreateGroupInput {
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  description: string;

  @IsBoolean()
  @IsNotEmpty({ message: "Precisa ser verdadeiro ou falso" })
  @Field({ nullable: true, defaultValue: true })
  active!: boolean;

  @IsDate()
  @Field({ nullable: true })
  createdAt!: Date;
}
