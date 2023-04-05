import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS CITY
import { CitiesService } from "./cities.service";
import { CitiesResolver } from "./cities.resolver";
import { City } from "./entities/city.entity";

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CitiesResolver, CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
