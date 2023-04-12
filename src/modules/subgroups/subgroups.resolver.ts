import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

// IMPORTS SUBGROUPS
import { Subgroup, PaginatedSubgroupResponse } from "./entities/subgroup.entity";
import { SubgroupsService } from "./subgroups.service";
import { FilterSubgroupInput } from "./dto/filter-subgroup.input";
import { CreateSubgroupInput } from "./dto/create-subgroup.input";
import { UpdateSubgroupInput } from "./dto/update-subgroup.input";

// IMPORTS PAGINATION
import { PaginationArgs } from "../filters/PaginationArgs";

//IMPORT JWT-AUTH-GUARD
import { GqlAuthGuard } from "../auth/jwt-auth.guard";

@Resolver(() => Subgroup)
export class SubgroupsResolver {
  constructor(private readonly subgroupsService: SubgroupsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Subgroup)
  async subgroup(@Args("id") id: number): Promise<Subgroup> {
    return await this.subgroupsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedSubgroupResponse)
  async subgroups(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterSubgroupInput) {
    return await this.subgroupsService.findAll(paginationArgs, filters);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Subgroup)
  async createSubgroup(@Args("data") data: CreateSubgroupInput): Promise<Subgroup> {
    return await this.subgroupsService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Subgroup)
  async updateSubgroup(@Args("id") id: number, @Args("data") data: UpdateSubgroupInput): Promise<Subgroup> {
    return await this.subgroupsService.update(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Subgroup)
  async deleteSubgroup(@Args("id") id: number) {
    return await this.subgroupsService.delete(id);
  }
}
