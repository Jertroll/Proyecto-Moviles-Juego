import React from 'react';
import { useIonRouter } from '@ionic/react';
import { IonContent, IonPage } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter ();

  const handlePlay = () => {
    console.log("handlePlay ejecutado");
    router.push('/jugar');
  };

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="main-screen"
      >
        <div className="button-container">
          <button className="main-button" onClick={handlePlay}>Jugar</button>
          <button className="main-button">Retar Amigos</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
