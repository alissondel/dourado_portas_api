import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

// IMPORTS USER
import { User, PaginatedUserResponse } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { FilterUserInput } from "./dto/filter-user.input";

// IMPORTS PAGINATION
import { PaginationArgs } from "../filters/PaginationArgs";

//IMPORT JWT-AUTH-GUARD
import { GqlAuthGuard } from "../auth/jwt-auth.guard";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Args("id") id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async userByEmail(@Args("email") email: string): Promise<User> {
    return await this.usersService.findEmail(email);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedUserResponse)
  async users(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterUserInput) {
    return await this.usersService.findAll(paginationArgs, filters);
  }

  @Mutation(() => User)
  async createUser(@Args("data") data: CreateUserInput): Promise<User> {
    return await this.usersService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(@Args("id") id: number, @Args("data") data: UpdateUserInput): Promise<User> {
    return await this.usersService.update(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async deleteUser(@Args("id") id: number): Promise<User> {
    return await this.usersService.delete(id);
  }
}
