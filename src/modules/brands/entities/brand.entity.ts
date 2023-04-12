import { ObjectType, Field, Int } from "@nestjs/graphql";
import PaginatedResponse from "../../paginations/dto/PaginatedResponse";

import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Product } from "src/modules/products/entities/product.entity";

@ObjectType("Brand")
@Entity("brand")
export class Brand {
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

  @OneToMany(() => Product, product => product.brand)
  products?: Product[];
}

@ObjectType()
export class PaginatedBrandResponse extends PaginatedResponse(Brand) {}
