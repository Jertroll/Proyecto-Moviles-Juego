import React from 'react';
import { useIonRouter, IonContent, IonPage } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter();

  // Función reutilizable para navegar
  const navigateTo = (path: string) => {
    console.log(`Navegando a ${path}`);
    router.push(path);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="main-screen">
        <div className="button-container">
          <button className="main-button" onClick={() => navigateTo('/jugar')}>
            Jugar
          </button>
          <button className="main-button" onClick={() => navigateTo('/enviar-reto')}>
            Retar Amigos
          </button>
          <button className="main-button" onClick={() => navigateTo('/retos-recibidos')}>
            Retos Recibidos
          </button>
          <button className="main-button" onClick={() => navigateTo('/historial-retos')}>
            Historial De Retos
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
