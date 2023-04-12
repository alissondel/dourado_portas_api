import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS PRODUCT
import { ProductsService } from "./products.service";
import { ProductsResolver } from "./products.resolver";
import { Product } from "./entities/product.entity";

// IMPORTS BRAND, GROUP AND SUBGROUP
import { BrandsModule } from "../brands/brands.module";
import { SubgroupsModule } from "../subgroups/subgroups.module";
import { GroupsModule } from "../groups/groups.module";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), forwardRef(() => BrandsModule), forwardRef(() => SubgroupsModule), forwardRef(() => GroupsModule)],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
