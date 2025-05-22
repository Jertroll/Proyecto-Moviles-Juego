import React from "react";
import { useIonRouter, IonContent, IonPage } from "@ionic/react";
import "./Home.css";
import { useAuth } from "../../context/AuthContext";
import Login from "../../pages/Login";

const Home: React.FC = () => {
  const router = useIonRouter();
  const { user, loading } = useAuth();

  const navigateTo = (path: string) => {
    console.log(`Navegando a ${path}`);
    router.push(path);
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="main-screen">
          <p style={{ textAlign: "center" }}>Cargando...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="main-screen">
        {user ? (
          <div className="button-container">
            <button
              className="main-button"
              onClick={() => navigateTo("/jugar")}
            >
              Jugar
            </button>
            <button
              className="main-button"
              onClick={() => navigateTo("/enviar-reto")}
            >
              Retar Amigos
            </button>
            <button
              className="main-button"
              onClick={() => navigateTo("/retos-recibidos")}
            >
              Retos Recibidos
            </button>
            <button
              className="main-button"
              onClick={() => navigateTo("/historial-retos")}
            >
              Historial De Retos
            </button>
          </div>
        ) : (
          <div className="button-container">
            <button
              className="main-button"
              onClick={() => navigateTo("/login")}
            >
              ¡Inicia Sesion!
            </button>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
