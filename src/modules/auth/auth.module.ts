import { Module } from "@nestjs/common";

// IMPORT TYPEORM
import { TypeOrmModule } from "@nestjs/typeorm";

// IMPORTS AUTH
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

// IMPORTS USER
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

// IMPORTS JWT
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION,
      },
    }),
  ],
  providers: [AuthService, AuthResolver, UsersService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
