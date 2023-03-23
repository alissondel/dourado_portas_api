import { GraphQLScalarType } from "graphql";
import { Field, ObjectType } from "@nestjs/graphql";
import { ClassType } from "type-graphql";
import { PageInfo } from "../entities/pagination.entity";

export default function PaginatedResponse<TItemsFieldValue>(itemsFieldValue: ClassType<TItemsFieldValue> | GraphQLScalarType) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [itemsFieldValue])
    items: TItemsFieldValue[];

    @Field()
    pagination: PageInfo;
  }
  return PaginatedResponseClass;
}
