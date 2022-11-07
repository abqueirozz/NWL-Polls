import { FlatList, Text } from "native-base";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Game, GameProps } from "../components/Game";

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  async function fetchGames() {
    try {
      const gamesResponse = await api.get(`/pools/${poolId}/game`);
      setGames(gamesResponse.data.games);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return;
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      fetchGames();
    } catch (error) {}
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          onGuessConfirm={() => {
            handleGuessConfirm(item.id);
          }}
          setFirstTeamPoints={(value) => setFirstTeamPoints(value)}
          setSecondTeamPoints={(value) => setSecondTeamPoints(value)}
        />
      )}
    ></FlatList>
  );
}
