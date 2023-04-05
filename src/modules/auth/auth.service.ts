import { Injectable, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

// IMPORT USER SERVICE
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

// IMPORTS AUTH
import { AuthType } from "./entities/auth.type";
import { AuthInput } from "./dto/auth.input";

// Import MD5
import * as md5 from "md5";

// IMPORTS DOTENV
import * as dotenv from "dotenv";
dotenv.config();

// IMPORT ERROR
import { UnauthorizedError } from "src/common/errors/types/UnauthorizedError";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user = await this.usersService.findEmail(data.email);

    if (md5(data.password + process.env.SECRET_PASSWORD) != user.password) {
      throw new UnauthorizedError("Senha Incorreta");
    }

    const token = await this.jwtToken(user);

    return {
      user,
      token,
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    return this.jwtService.signAsync(payload);
  }

  private jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException("Não autorizado.");
    }
    const [, token] = authHeader.split(" ");

    return token;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return this.jwtExtractor;
  }
}
