import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS SUBGROUPS
import { SubgroupsService } from "./subgroups.service";
import { SubgroupsResolver } from "./subgroups.resolver";
import { Subgroup } from "./entities/subgroup.entity";

// IMPORTS PRODUCT
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [TypeOrmModule.forFeature([Subgroup]), forwardRef(() => ProductsModule)],
  providers: [SubgroupsResolver, SubgroupsService],
  exports: [SubgroupsService],
})
export class SubgroupsModule {}
