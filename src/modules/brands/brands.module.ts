import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS BRAND
import { BrandsService } from "./brands.service";
import { BrandsResolver } from "./brands.resolver";
import { Brand } from "./entities/brand.entity";

// IMPORTS PRODUCT
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), forwardRef(() => ProductsModule)],
  providers: [BrandsResolver, BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
