import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { makeid } from "../lib/utils";
import { authenticate } from "../plugins/authJWT";

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get("/pool/count", async () => {
    const count = await prisma.pool.count();

    return { count: count };
  });

  fastify.post("/pool", async (req, res) => {
    const createPoolBody = z.object({
      title: z.string(),
    });

    const { title } = createPoolBody.parse(req.body);
    const code = makeid(8);

    try {
      await req.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: req.user.sub,
          participants: {
            create: {
              usersId: req.user.sub,
            },
          },
        },
      });
    } catch (error) {
      await prisma.pool.create({
        data: {
          title,
          code,
        },
      });
    }
    res.status(201).send(code);
  });

  fastify.post("/pool/join",
    {
      onRequest: [authenticate],
    },
    async (req, res) => {
      const joinPoolObject = z.object({
        code: z.string(),
      });

      const { code } = joinPoolObject.parse(req.body);

      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              usersId: req.user.sub,
            },
          },
        },
      });

      if (!pool) {
        return res.status(400).send({ message: "Bolão não encontrado." });
      }

      if (pool.participants.length > 0) {
        return res
          .status(400)
          .send({ message: "Você já faz parte desse bolão." });
      }

      if (!pool.ownerId) {
        await prisma.pool.update({
          where: {
            id: pool.id,
          },
          data: {
            ownerId: req.user.sub,
          },
        });
      }

      await prisma.participant.create({
        data: {
          poolId: pool.id,
          usersId: req.user.sub,
        },
      });
      return res.status(201).send("Voc^agora está participando desse bolão.");
    }
  );

  fastify.get("/pools",
    {
      onRequest: [authenticate],
    },
    async (req, res) => {
      const pools = prisma.pool.findMany({
        where: {
          participants: {
            some: {
              usersId: req.user.sub,
            },
          },
        },
        include: {
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  avatarUrl: true,
                  name: true
                },
              },
            },
            take: 4,
          },
          _count: {
            select: {
              participants: true,
            },
          },
          owner: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });

      return pools;
    }
  );

  fastify.get("/pools/:id",
    {
      onRequest: [authenticate],
    },
    async (req, res) => {
      const createPoolObject = z.object({
        id: z.string(),
      });

      const { id } = createPoolObject.parse(req.params);

      const pool = prisma.pool.findUnique({
        where: {
          id,
        },
        include: {
          participants: {
            select: {
              id: true,
              user: {
                select: {
                  avatarUrl: true,
                },
              },
            },
            take: 4,
          },
          _count: {
            select: {
              participants: true,
            },
          },
          owner: {
            select: {
              name: true,
              id: true
            },
          },
        },
      });

      return pool;
    }
  );
}
