import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

// IMPORTS STATES
import { State, PaginatedStateResponse } from "./entities/state.entity";
import { StatesService } from "./states.service";
import { CreateStateInput } from "./dto/create-state.input";
import { UpdateStateInput } from "./dto/update-state.input";
import { FilterStateInput } from "./dto/filter-state.input";

// IMPORTS PAGINATION
import { PaginationArgs } from "../filters/PaginationArgs";

//IMPORT JWT-AUTH-GUARD
import { GqlAuthGuard } from "../auth/jwt-auth.guard";

@Resolver(() => State)
export class StatesResolver {
  constructor(private readonly statesService: StatesService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => State)
  async state(@Args("id") id: number): Promise<State> {
    return await this.statesService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedStateResponse)
  async states(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterStateInput) {
    return await this.statesService.findAll(paginationArgs, filters);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => State)
  async createState(@Args("data") data: CreateStateInput): Promise<State> {
    return await this.statesService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => State)
  async updateState(@Args("id") id: number, @Args("data") data: UpdateStateInput): Promise<State> {
    return await this.statesService.update(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => State)
  async deleteState(@Args("id") id: number): Promise<State> {
    return await this.statesService.delete(id);
  }
}
