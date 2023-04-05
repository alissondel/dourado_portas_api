import { ObjectType, Field, Int } from "@nestjs/graphql";
import PaginatedResponse from "../../paginations/dto/PaginatedResponse";

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { State } from "../../states/entities/state.entity";
import { User } from "src/modules/users/entities/user.entity";

@ObjectType("City")
@Entity("city")
export class City {
  @PrimaryGeneratedColumn("increment")
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field(() => Int)
  state_id: number;

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

  @ManyToOne(() => State, state => state.cities)
  @JoinColumn({
    name: "state_id",
    referencedColumnName: "id",
  })
  state: State;

  @OneToMany(() => User, user => user.city)
  users?: User[];
}

@ObjectType()
export class PaginatedCityResponse extends PaginatedResponse(City) {}
