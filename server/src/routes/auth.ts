import { prisma } from "../lib/prisma";
import { z } from "zod";
import fetch from "node-fetch";
import { authenticate } from "../plugins/authJWT";
import { FastifyInstance } from "fastify";

export async function authsRoutes(fastify: FastifyInstance) {
  fastify.get("/me",
    {
      onRequest: [authenticate],
    },
    async (req) => {
      return { user: req.user };
    }
  );

  fastify.post("/user", async (req, res) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });
    console.log(req.body)

    const { access_token } = createUserBody.parse(req.body);
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`
        },
      }
    );

    const userData = await userResponse.json();

    const userInfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });

    const userinfo = userInfoSchema.parse(userData);

    let user = await prisma.user.findUnique({
      where: {
        googleId: userinfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userinfo.email,
          name: userinfo.name,
          avatarUrl: userinfo.picture,
          googleId: userinfo.id,
        },
      });
    }

    const token = fastify.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: "7 days",
      }
    );
    //console.log(user)
    return { token };
  });
}
