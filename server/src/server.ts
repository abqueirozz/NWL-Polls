import Fastify, { fastify } from "fastify";
import cors from "@fastify/cors";
import { poolRoutes } from "./routes/pool";
import { guessRoutes } from "./routes/guess";
import { authsRoutes } from "./routes/auth";
import jwt from "@fastify/jwt";
import { gameRoutes } from "./routes/game";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: "mariaclarabatista",
  });

  await fastify.register(poolRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(authsRoutes);
  await fastify.register(gameRoutes);


  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
