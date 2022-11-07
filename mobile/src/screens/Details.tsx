import { useToast, VStack, HStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { api } from "../services/api";
import { useEffect, useState } from "react";
import { PoolCardPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";
import { Share } from "react-native";

interface RouteParams {
  id: string;
}

export function Details() {
  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const [poolDetails, setPoolDetail] = useState<PoolCardPros>(
    {} as PoolCardPros
  );
  const [optionSelected, setOptionSelected] = useState<
    "Seus palpites" | "Ranking do grupo"
  >("Seus palpites");

  async function fetchPools() {
    try {
      const detailsResponse = await api.get(`/pools/${id}`);
      setPoolDetail(detailsResponse.data);
    } catch (error) {
      toast.show({
        title: "Não foi possível encontrar o bolãos",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function handleShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  useEffect(() => {
    fetchPools();
  }, [id]);

  return (
    <VStack flex={1} bgColor="blueGray.900">
      <Header title={poolDetails.title} showBackButton showShareButton onShare={handleShare} />
      {poolDetails._count?.participants > 0 ? (
        <VStack>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="blueGray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "Seus palpites"}
              onPress={() => setOptionSelected("Seus palpites")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "Ranking do grupo"}
              onPress={() => setOptionSelected("Ranking do grupo")}
            />
          </HStack>

          <Guesses poolId={poolDetails.id}></Guesses>
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
