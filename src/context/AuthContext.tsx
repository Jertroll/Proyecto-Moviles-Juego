import { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configura la persistencia antes de suscribirte al estado
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Ahora que la persistencia está lista, suscríbete al estado de autenticación
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error al configurar persistencia:", error);
        setLoading(false); // Para que no quede cargando eternamente si falla
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
