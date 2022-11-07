import { VStack, Icon, FlatList } from "native-base";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";
import { useState, useCallback } from "react";
import { PoolCard, PoolCardPros } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { useToast } from "native-base";
import { Loading } from "../components/Loading";

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardPros[]>([]);

  const toast = useToast();

  async function getPools() {
    setIsLoading(true);
    try {
      const poolsResponse = await api.get("/pools");

      setPools(poolsResponse.data);
    } catch (error) {
      toast.show({
        title: "Não foi possível encontrar os bolões",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getPools();
    }, [])
  );

  const navigation = useNavigation();
  return (
    <VStack flex={1} bgColor="blueGray.900">
      <Header title="Meus Bolões" />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÂO"
          onPress={() => navigation.navigate("find")}
          leftIcon={
            <Icon as={Fontisto} name="search" color="black" size="md" />
          }
        />
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigation.navigate("details", { id: item.id })}
            />
          )}
          px={5}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
