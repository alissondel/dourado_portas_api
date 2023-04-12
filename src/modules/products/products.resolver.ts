import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";

// IMPORTS PRODUCTS
import { Product, PaginatedProductResponse } from "./entities/product.entity";
import { ProductsService } from "./products.service";
import { CreateProductInput } from "./dto/create-product.input";
import { FilterProductInput } from "./dto/filter-product.input";
import { UpdateProductInput } from "./dto/update-product.input";

// IMPORTS PAGINATION
import { PaginationArgs } from "../filters/PaginationArgs";

//IMPORT JWT-AUTH-GUARD
import { GqlAuthGuard } from "../auth/jwt-auth.guard";

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Product)
  async product(@Args("id") id: number): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedProductResponse)
  async products(@Args() paginationArgs: PaginationArgs, @Args("filters") filters: FilterProductInput) {
    return await this.productsService.findAll(paginationArgs, filters);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async createProduct(@Args("data") data: CreateProductInput): Promise<Product> {
    return await this.productsService.create(data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async updateProduct(@Args("id") id: number, @Args("data") data: UpdateProductInput) {
    return await this.productsService.update(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Product)
  async deleteProduct(@Args("id") id: number) {
    return await this.productsService.delete(id);
  }
}
