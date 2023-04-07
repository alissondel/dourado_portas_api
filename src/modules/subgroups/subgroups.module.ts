import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS SUBGROUPS
import { SubgroupsService } from "./subgroups.service";
import { SubgroupsResolver } from "./subgroups.resolver";
import { Subgroup } from "./entities/subgroup.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Subgroup])],
  providers: [SubgroupsResolver, SubgroupsService],
  exports: [SubgroupsService],
})
export class SubgroupsModule {}
