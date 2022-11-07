import { FastifyInstance } from "fastify";
import { date, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authJWT";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guess/count", async () => {
    const count = await prisma.guess.count();

    return { count: count };
  });

  fastify.post("/pools/:poolId/games/:gameId/guesses",
    {
      onRequest: [authenticate],
    },
    async (req, res) => {
      console.log(req.params)
      const createGuessObjectParams = z.object({
        poolId: z.string(),
        gameId: z.string(),
      });
      const { gameId, poolId } = createGuessObjectParams.parse(req.params);
      
      const createGuessObjectBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });
      console.log(req.body)
      const { firstTeamPoints, secondTeamPoints } = createGuessObjectBody.parse(req.body);
      console.log("------------------------------------------------------------------------------")

      

      const participant = await prisma.participant.findUnique({
        where: {
          usersId_poolId: {
            poolId,
            usersId: req.user.sub,
          },
        },
      });

      if (!participant) {
        return res.status(400).send("Você não faz parte desse bolão");
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return res.status(400).send("Você já comentou nesse bolão");
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return res.status(400).send("Jogo não encotrado");
      }

      if (game.date < new Date()) {
        return res
          .status(400)
          .send("Você só pode fazer palpites antes do jogo");
      }

      await prisma.guess.create({
        data: {
          gameId,
          participantId: participant.id,
          firstTeamPoint: firstTeamPoints,
          secondTeamPoint: secondTeamPoints,
        },
      });

      return {
        gameId,
        poolId,
        firstTeamPoints,
        secondTeamPoints,
      };
    }
  );
}
