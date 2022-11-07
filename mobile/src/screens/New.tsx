import { VStack, Heading, Text, useToast } from "native-base";
import Logo from "../assets/logo.svg";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";

export function New() {
  const [title, setTitle] = useState("");
  const [isLodingButton, setIsLoading] = useState(false);

  const toast = useToast();

  async function handleCreate () {
    console.log(!title.trim())
    if (!title.trim()) {
      return toast.show({
        title: "Esqueceu o nome do seu bolão",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoading(true);

      await api.post("/pool", { title });
      setTitle("")
      
      toast.show({
        title: "Bolão criado",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      toast.show({
        title: "Deu ruim",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);

    }
  };

  return (
    <VStack flex={1} bgColor="blueGray.900">
      <Header title="Criar novo bolão"></Header>

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
      </VStack>
      <Heading
        fontFamily="heading"
        color="white"
        fontSize="xl"
        my={8}
        textAlign="center"
      >
        Crie seu próprio bolão da copa e compartilhe com seus amigos!
      </Heading>
      <Input
        mb={2}
        placeholder="Qual o nome do seu bolão?"
        value={title}
        onChangeText={setTitle}
      />
      <Button
        title="CRIE SEU BOLÃO"
        onPress={handleCreate}
        isLoading={isLodingButton}
      />
      <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
        Após criar o bolão, você receberá um código único que poderá usar para
        convidar outras pessoas
      </Text>
    </VStack>
  );
}
