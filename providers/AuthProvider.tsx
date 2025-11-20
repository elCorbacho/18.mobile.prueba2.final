import { ReactNode, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const login = (email: string, pass: string) => {
    if (!isValidEmail(email)) {
      console.error("Email inválido");
      return false;
    }

    if (!pass || pass.trim() === "") {
      console.error("Contraseña requerida");
      return false;
    }

    setIsLogged(true);
    setUserEmail(email);
    return true;
  };

  const logout = () => {
    setIsLogged(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLogged, login, logout, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
};