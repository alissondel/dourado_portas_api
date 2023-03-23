import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

// IMPORTS USER
import { User, PaginatedUserResponse } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { FilterUserInput } from "./dto/filter-user.input";

// IMPORTS Pagination
import { PaginationArgs } from "../filters/PaginationArgs";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async user(@Args("id") id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Query(() => User)
  async userByEmail(@Args("email") email: string): Promise<User> {
    return await this.usersService.findEmail(email);
  }

  @Query(() => PaginatedUserResponse)
  async users(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterUserInput) {
    return await this.usersService.findAll(paginationArgs, filters);
  }

  @Mutation(() => User)
  async createUser(@Args("data") data: CreateUserInput): Promise<User> {
    return await this.usersService.create(data);
  }

  @Mutation(() => User)
  async updateUser(@Args("id") id: number, @Args("data") data: UpdateUserInput): Promise<User> {
    return await this.usersService.update(id, data);
  }

  @Mutation(() => User)
  async deleteUser(@Args("id") id: number): Promise<User> {
    return await this.usersService.delete(id);
  }
}
