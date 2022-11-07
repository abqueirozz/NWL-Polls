import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { makeid } from "../lib/utils";
import { authenticate } from "../plugins/authJWT";

export async function gameRoutes(fastify: FastifyInstance) {
  fastify.get("/pools/:id/game",
    {
      onRequest: [authenticate],
    },
    async (req, res) => {
      const createPoolObject = z.object({
        id: z.string(),
      });

      const { id } = createPoolObject.parse(req.params);

      const game = await prisma.game.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          guesses: {
            where: {
              participant: {
                usersId: req.user.sub,
                poolId: id,
              },
            },
          },
        },
      });

      return {
        games: game.map((g) => {
          return {
            ...g,
            guess: g.guesses.length > 0 ? g.guesses[0] : null,
            guesses: undefined,
          };
        }),
      };
    }
  );
}
