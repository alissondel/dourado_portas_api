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
      entities: [User, AuthType, State, City],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
    StatesModule,
    CitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
