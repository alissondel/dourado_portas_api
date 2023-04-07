import { Module } from "@nestjs/common";
import { join } from "path";

// IMPORT DOTENV
import * as dotenv from "dotenv";
dotenv.config();

// IMPORT TYPEORM
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORT GRAPHQL
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

//IMPORT USER
import { UsersModule } from "./modules/users/users.module";
import { User } from "./modules/users/entities/user.entity";

//IMPORT AUTH
import { AuthModule } from "./modules/auth/auth.module";
import { AuthType } from "./modules/auth/entities/auth.type";

//IMPORT STATE
import { StatesModule } from "./modules/states/states.module";
import { State } from "./modules/states/entities/state.entity";

//IMPORT CITY
import { CitiesModule } from "./modules/cities/cities.module";
import { City } from "./modules/cities/entities/city.entity";

//IMPORT BRAND
import { BrandsModule } from "./modules/brands/brands.module";
import { Brand } from "./modules/brands/entities/brand.entity";

//IMPORT SUBGROUP
import { SubgroupsModule } from "./modules/subgroups/subgroups.module";
import { Subgroup } from "./modules/subgroups/entities/subgroup.entity";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema/schema.gql"),
      sortSchema: true,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [User, AuthType, State, City, Brand, Subgroup],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
    StatesModule,
    CitiesModule,
    BrandsModule,
    SubgroupsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
