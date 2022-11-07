import { Center, Text, Icon } from "native-base";
import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";
import { Fontisto } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

export function SignIn() {
  const {signIn, isLogin} = useAuth()
  return (
    <Center flex={1} bgColor="blueGray.900" p={7}>
      <Logo />\
      
      <Button mt={10} type="secondary" title="Entrar com o google"
              leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />} 
              onPress ={signIn} isLoading={isLogin} _loading={{_spinner:{color: "white"}}}
      ></Button>

      <Text color={"amber.100"} textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {"\n"}
        do seu e-mail para a criação de sua conta.
      </Text>
    </Center>
  );
}
