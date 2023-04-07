import { ObjectType, Field, Int } from "@nestjs/graphql";
import PaginatedResponse from "../../paginations/dto/PaginatedResponse";

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType("Subgroup")
@Entity("subgroup")
export class Subgroup {
  @PrimaryGeneratedColumn("increment")
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  active: boolean;

  @Column({ name: "created_at", type: "timestamptz" })
  @Field()
  createdAt: Date;

  @Column({ name: "updated_at", type: "timestamptz", nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  @Field({ nullable: true })
  deletedAt?: Date;
}

@ObjectType()
export class PaginatedSubgroupResponse extends PaginatedResponse(Subgroup) {}
