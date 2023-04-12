import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

// IMPORTS GROUPS
import { Group, PaginatedGroupResponse } from "./entities/group.entity";
import { GroupsService } from "./groups.service";
import { CreateGroupInput } from "./dto/create-group.input";
import { FilterGroupInput } from "./dto/filter-group.input";
import { UpdateGroupInput } from "./dto/update-group.input";

// IMPORTS PAGINATION
import { PaginationArgs } from "../filters/PaginationArgs";

//IMPORT JWT-AUTH-GUARD
import { GqlAuthGuard } from "../auth/jwt-auth.guard";

@Resolver(() => Group)
export class GroupsResolver {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Group)
  async group(@Args("id") id: number): Promise<Group> {
    return await this.groupsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedGroupResponse)
  async groups(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterGroupInput) {
    return await this.groupsService.findAll(paginationArgs, filters);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  async createGroup(@Args("data") data: CreateGroupInput) {
    return this.groupsService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  async updateGroup(@Args("id") id: number, @Args("data") data: UpdateGroupInput): Promise<Group> {
    return await this.groupsService.update(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Group)
  async deleteGroup(@Args("id") id: number) {
    return await this.groupsService.delete(id);
  }
}
