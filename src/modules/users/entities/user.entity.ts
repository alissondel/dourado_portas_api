import { ObjectType, Field } from "@nestjs/graphql";
import PaginatedResponse from "../../paginations/dto/PaginatedResponse";

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType("User")
@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ name: "phone_number" })
  @Field()
  phoneNumber: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  active: boolean;

  @Column({ name: "created_at", type: "timestamptz" })
  @Field()
  createdAt: Date;

  @Column({ name: "updated_at", type: "timestamptz", nullable: true })
  @Field()
  updatedAt: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  @Field()
  deletedAt: Date;
}

@ObjectType()
export class PaginatedUserResponse extends PaginatedResponse(User) {}
