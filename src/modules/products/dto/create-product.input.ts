import { InputType, Field, Int } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsBoolean, IsDate, IsNumber } from "class-validator";

@InputType()
export class CreateProductInput {
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  code: string;

  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  description: string;

  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  color: string;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  unity: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  height: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  length: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  width: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  thickness: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  weight: number;

  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  warranty: string;

  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field()
  typeWood: string;

  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field()
  frameWidth: number;

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
  brand_id: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int)
  subgroup_id: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int)
  group_id: number;
}
