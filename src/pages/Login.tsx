import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import LoginService from "../service/LoginService";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ingreso</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>Ingreso</IonTitle>
          </IonToolbar>
        </IonHeader>
        <LoginService />
      </IonContent>
    </IonPage>
  );
};

export default Login;
