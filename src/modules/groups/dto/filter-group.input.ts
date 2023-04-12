import { Field, InputType, Int } from "@nestjs/graphql";
import { OrderByFilterInput } from "../../filters/OrderByFilterInput";

@InputType()
export class FilterGroupInput {
  @Field(() => Int, { nullable: true })
  id!: number;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  active!: boolean;

  @Field({ nullable: true })
  createdAt!: Date;

  @Field({ nullable: true })
  updatedAt!: Date;

  @Field({ nullable: true })
  order!: OrderByFilterInput;
}
