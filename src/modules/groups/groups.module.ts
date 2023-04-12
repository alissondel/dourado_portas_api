import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS GROUPS
import { GroupsService } from "./groups.service";
import { GroupsResolver } from "./groups.resolver";
import { Group } from "./entities/group.entity";

// IMPORTS PRODUCT
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [TypeOrmModule.forFeature([Group]), forwardRef(() => ProductsModule)],
  providers: [GroupsResolver, GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
