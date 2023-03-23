import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  perPage: number;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  currentPage: number;
}
