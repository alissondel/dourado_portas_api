import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

// IMPORTS BRANDS
import { Brand, PaginatedBrandResponse } from "./entities/brand.entity";
import { BrandsService } from "./brands.service";
import { FilterBrandInput } from "./dto/filter-brand.input";
import { CreateBrandInput } from "./dto/create-brand.input";
import { UpdateBrandInput } from "./dto/update-brand.input";

// IMPORTS PAGINATION
import { PaginationArgs } from "../filters/PaginationArgs";

//IMPORT JWT-AUTH-GUARD
import { GqlAuthGuard } from "../auth/jwt-auth.guard";

@Resolver(() => Brand)
export class BrandsResolver {
  constructor(private readonly brandsService: BrandsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Brand)
  async brand(@Args("id") id: number): Promise<Brand> {
    return await this.brandsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedBrandResponse)
  async brands(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterBrandInput) {
    return await this.brandsService.findAll(paginationArgs, filters);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Brand)
  async createBrand(@Args("data") data: CreateBrandInput): Promise<Brand> {
    return await this.brandsService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Brand)
  async updateBrand(@Args("id") id: number, @Args("data") data: UpdateBrandInput): Promise<Brand> {
    return await this.brandsService.update(id, data);
  }

  @Mutation(() => Brand)
  async deleteBrand(@Args("id") id: number) {
    return await this.brandsService.delete(id);
  }
}
