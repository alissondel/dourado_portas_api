import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS STATE
import { StatesService } from "./states.service";
import { StatesResolver } from "./states.resolver";
import { State } from "./entities/state.entity";
import { CitiesModule } from "../cities/cities.module";

@Module({
  imports: [TypeOrmModule.forFeature([State]), CitiesModule],
  providers: [StatesResolver, StatesService],
})
export class StatesModule {}
