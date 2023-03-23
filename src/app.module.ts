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

//IMPORT MODULES
import { UsersModule } from "./modules/users/users.module";
import { User } from "./modules/users/entities/user.entity";

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
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
