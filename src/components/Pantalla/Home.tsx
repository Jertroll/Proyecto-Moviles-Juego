import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  const handlePlay = () => {
    history.push('/jugar');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="main-screen">
        <div className="button-container">
          <button className="main-button" onClick={handlePlay}>Jugar</button>
          <button className="main-button">Retar Amigos</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
