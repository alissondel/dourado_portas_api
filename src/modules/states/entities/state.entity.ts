import { ObjectType, Field, Int } from "@nestjs/graphql";
import PaginatedResponse from "../../paginations/dto/PaginatedResponse";

import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { City } from "../../cities/entities/city.entity";

@ObjectType("State")
@Entity("state")
export class State {
  @PrimaryGeneratedColumn("increment")
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  uf: string;

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

  @OneToMany(() => City, city => city.state)
  cities?: City[];
}

@ObjectType()
export class PaginatedStateResponse extends PaginatedResponse(State) {}
