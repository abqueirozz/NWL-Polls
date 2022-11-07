import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { api } from "../services/api";

export interface authContextProps {
  user: userProps;
  signIn: () => Promise<void>;
  isLogin: boolean;
}

export interface userProps {
  name: string;
  avatarURL?: string;
}

export const AuthContext = createContext({} as authContextProps);

interface authContextChildren {
  children: ReactNode;
}

WebBrowser.maybeCompleteAuthSession();

export function AuthContextProvider({ children }: authContextChildren) {
  const [user, setUser] = useState<userProps>({} as userProps);
  const [isLogin, setIsLogin] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID ,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ["profile", "email"],
  });

  async function signIn() {
    try {
      console.log(AuthSession.makeRedirectUri({ useProxy: true }));
      setIsLogin(true);
      await promptAsync();
    } catch (error) {

      throw error;
    } finally {
      setIsLogin(false);
    }
  }

  async function signInWithGoogle(access_token: string) {
    console.log("ACCESS TOKEN IS ", access_token);

    try {
      setIsLogin(true);

      const tokenResponse = await api.post("/user", { access_token });

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokenResponse.data.token}`;

      const userInfo = await api.get("/me");
      setUser(userInfo.data.user);

    } catch (error) {
      throw error;
      
    } finally {
      setIsLogin(false);
    }
  }

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        user,
        isLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
