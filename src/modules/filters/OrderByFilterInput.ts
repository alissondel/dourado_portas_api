import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class OrderByFilterInput {
  @Field({ defaultValue: "id" })
  key!: string;

  @Field({ defaultValue: "ASC" })
  value!: string;

  @Field({ nullable: true })
  prefix!: string;
}
