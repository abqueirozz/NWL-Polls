import { VStack, Heading } from "native-base";
import Logo from "../assets/logo.svg";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";

export function Find() {
  const { navigate } = useNavigation();
  const [isLodingButton, setIsLoading] = useState(false);
  const [inputPool, setInputPool] = useState("");
  const toast = useToast();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!inputPool.trim()) {
        return toast.show({
          title: "Esqueceu o nome de seu bolão",
          placement: "top",
          bgColor: "yellow.500",
        });
      }

      await api.post("/pool/join", { code: inputPool });
      
      setInputPool("");
      navigate("pools");
    } catch (error) {
      setIsLoading(false);

      console.log(error);
      toast.show({
        title: "Não foi possível encontrar o bolãos",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }
  return (
    <VStack flex={1} bgColor="blueGray.900">
      <Header title="Buscar por código" showBackButton></Header>

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
      </VStack>
      <Heading
        fontFamily="heading"
        color="white"
        fontSize="xl"
        mb={8}
        textAlign="center"
      >
        Encontre um bolão através do seu código único
      </Heading>
      <Input
        mb={2}
        placeholder="Qual o nome do seu bolão?"
        onChangeText={(text) => setInputPool(text)}
        value={inputPool}
      />
      <Button title="BUSCAR BOLÃO" onPress={handleJoinPool} isLoading={isLodingButton} />
    </VStack>
  );
}
