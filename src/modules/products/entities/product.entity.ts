import { ObjectType, Field, Int } from "@nestjs/graphql";
import PaginatedResponse from "../../paginations/dto/PaginatedResponse";

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import { Brand } from "src/modules/brands/entities/brand.entity";
import { Subgroup } from "src/modules/subgroups/entities/subgroup.entity";
import { Group } from "src/modules/groups/entities/group.entity";

@ObjectType("Product")
@Entity("product")
export class Product {
  @PrimaryGeneratedColumn("increment")
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  code: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  color: string;

  @Column({ type: "float" })
  @Field()
  unity: number;

  @Column({ type: "float" })
  @Field()
  price: number;

  @Column({ type: "float" })
  @Field()
  height: number;

  @Column({ type: "float" })
  @Field()
  length: number;

  @Column({ type: "float" })
  @Field()
  width: number;

  @Column({ type: "float" })
  @Field()
  thickness: number;

  @Column({ type: "float" })
  @Field()
  weight: number;

  @Column()
  @Field()
  warranty: string;

  @Column({ name: "type_wood", type: "varchar" })
  @Field()
  typeWood: string;

  @Column({ name: "frame_width", type: "float" })
  @Field()
  frameWidth: number;

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

  @Column()
  @Field(() => Int)
  brand_id: number;

  @Column()
  @Field(() => Int)
  subgroup_id: number;

  @Column()
  @Field(() => Int)
  group_id: number;

  @ManyToOne(() => Brand, brand => brand.products)
  @JoinColumn({
    name: "brand_id",
    referencedColumnName: "id",
  })
  @Field(() => Brand)
  brand: Brand;

  @ManyToOne(() => Subgroup, subgroup => subgroup.products)
  @JoinColumn({
    name: "subgroup_id",
    referencedColumnName: "id",
  })
  @Field(() => Subgroup)
  subgroup: Subgroup;

  @ManyToOne(() => Group, group => group.products)
  @JoinColumn({
    name: "group_id",
    referencedColumnName: "id",
  })
  @Field(() => Group)
  group: Group;
}

@ObjectType()
export class PaginatedProductResponse extends PaginatedResponse(Product) {}
