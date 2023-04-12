import { Field, InputType, Int } from "@nestjs/graphql";
import { OrderByFilterInput } from "../../filters/OrderByFilterInput";

@InputType()
export class FilterProductInput {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field({ nullable: true })
  code!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  color!: string;

  @Field({ nullable: true })
  unity!: number;

  @Field({ nullable: true })
  price!: number;

  @Field({ nullable: true })
  height!: number;

  @Field({ nullable: true })
  length!: number;

  @Field({ nullable: true })
  width!: number;

  @Field({ nullable: true })
  thickness!: number;

  @Field({ nullable: true })
  weight!: number;

  @Field({ nullable: true })
  warranty!: string;

  @Field({ nullable: true })
  typeWood!: string;

  @Field({ nullable: true })
  frameWidth!: number;

  @Field({ nullable: true })
  active!: boolean;

  @Field({ nullable: true })
  state!: string;

  @Field({ nullable: true })
  createdAt!: Date;

  @Field({ nullable: true })
  updatedAt!: Date;

  @Field({ nullable: true })
  order!: OrderByFilterInput;

  @Field(() => Int, { nullable: true })
  id_brand!: number;

  @Field(() => Int, { nullable: true })
  id_subgroup!: number;

  @Field(() => Int, { nullable: true })
  id_group!: number;
}
