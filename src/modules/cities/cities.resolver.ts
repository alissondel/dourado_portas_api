import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

// IMPORTS CITIES
import { City, PaginatedCityResponse } from "./entities/city.entity";
import { CitiesService } from "./cities.service";
import { FilterCityInput } from "./dto/filter-city.input";
import { CreateCityInput } from "./dto/create-city.input";
import { UpdateCityInput } from "./dto/update-city.input";

// IMPORTS PAGINATION
import { PaginationArgs } from "../filters/PaginationArgs";

//IMPORT JWT-AUTH-GUARD
import { GqlAuthGuard } from "../auth/jwt-auth.guard";

@Resolver(() => City)
export class CitiesResolver {
  constructor(private readonly citiesService: CitiesService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => City)
  async city(@Args("id") id: number): Promise<City> {
    return await this.citiesService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedCityResponse)
  async cities(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterCityInput) {
    return await this.citiesService.findAll(paginationArgs, filters);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => City)
  async createCity(@Args("data") data: CreateCityInput): Promise<City> {
    return await this.citiesService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => City)
  async updateCity(@Args("id") id: number, @Args("data") data: UpdateCityInput): Promise<City> {
    return await this.citiesService.update(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => City)
  async deleteCity(@Args("id") id: number) {
    return await this.citiesService.delete(id);
  }
}
