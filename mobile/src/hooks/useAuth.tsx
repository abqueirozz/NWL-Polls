import { useContext } from "react";

import { AuthContext, authContextProps } from "../contexts/auth";

export function useAuth(): authContextProps {
  const context = useContext(AuthContext);

  return context;
}
