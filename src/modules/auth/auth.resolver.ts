import { Resolver, Args, Mutation } from "@nestjs/graphql";

//Import Auth
import { AuthType } from "./entities/auth.type";
import { AuthInput } from "./dto/auth.input";
import { AuthService } from "./auth.service";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthType)
  public async authenticate(@Args("data") data: AuthInput): Promise<AuthType> {
    const response = await this.authService.validateUser(data);

    return {
      user: response.user,
      token: response.token,
    };
  }
}
