import { NestFactory } from "@nestjs/core";

// IMPORT APP MODULE
import { AppModule } from "./app.module";

// IMPORT DOTENV
import * as dotenv from "dotenv";

// IMPORT INTERCEPTORS
import { ConflictInterceptor } from "./common/errors/interceptors/conflict.interceptors";
import { UnauthorizedInterceptor } from "./common/errors/interceptors/unauthorized.interceptors";
import { NotFoundInterceptor } from "./common/errors/interceptors/notfound.interceptors";

dotenv.config();

const port = normalizePort(process.env.PORT || "8080");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ConflictInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());
  app.useGlobalInterceptors(new NotFoundInterceptor());

  await app.listen(Number(port));
  console.log(`🚀 Server is running at port: http://localhost:${port} 🚀`);
}

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val;

  if (port >= 0) return port;

  return false;
}

bootstrap();
