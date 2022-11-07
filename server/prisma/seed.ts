import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  /*
  const user = await prisma.user.create({
    data: {
      name: "Fulano",
      email: "fufu@gmail.com",
      avatarUrl: "https://avatars.githubusercontent.com/u/6067640?v=4",
    },
  });
*/

  const user = {
    name: "Arthur Barbosa Queiroz Bisneto",
    email: "abqbisneto@gmail.com",
    avatarUrl:
      "https://lh3.googleusercontent.com/a/ALm5wu1G2X3rhJozuHZKpeG-fFF8osMO-Cxzn1ebZp26Yg=s96-c",
    id: "cla5wikgw0000d6mgpeoorlg9",
    googleId: "113706618116421911818",
    createdAt: "1667772214304",
  };

  const pool = await prisma.pool.create({
    data: {
      title: "Bolão dos brothers",
      code: "BOL40",
      ownerId: user.id,
      participants: {
        create: {
          usersId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-22T11:42:28.857Z",
      firstTeamCode: "DE",
      secondTeamCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-22T11:42:28.857Z",
      firstTeamCode: "JP",
      secondTeamCode: "AR",
      guesses: {
        create: {
          firstTeamPoint: 2,
          secondTeamPoint: 1,
          participant: {
            connect: {
              usersId_poolId: {
                usersId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
