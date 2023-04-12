import { InputType, Field, Int } from "@nestjs/graphql";

import { IsNotEmpty, IsString, IsDate, IsOptional, IsNumber } from "class-validator";
@InputType()
export class UpdateProductInput {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field({ nullable: true })
  code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field({ nullable: true })
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field({ nullable: true })
  color?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  unity?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  height?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  length?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  width?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  thickness?: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  weight?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field({ nullable: true })
  warranty?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: "Caracteres Invalidos" })
  @Field({ nullable: true })
  typeWood?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: "Numeros Invalidos" })
  @Field({ nullable: true })
  frameWidth?: number;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  updatedAt!: Date;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int, { nullable: true })
  brand_id?: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int, { nullable: true })
  subgroup_id?: number;

  @IsNumber()
  @IsNotEmpty({ message: "Numero Inexistente!" })
  @Field(() => Int, { nullable: true })
  group_id?: number;
}
