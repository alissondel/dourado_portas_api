import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS BRAND
import { BrandsService } from "./brands.service";
import { BrandsResolver } from "./brands.resolver";
import { Brand } from "./entities/brand.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandsResolver, BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
