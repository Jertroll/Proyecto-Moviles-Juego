// src/components/Retos/RetosRecibidos.tsx
import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonToast,
} from "@ionic/react";
import { obtenerRetosPendientes, aceptarReto } from "../../service/retoService";
import { useAuth } from "../../context/AuthContext";

const RetosRecibidos: React.FC = () => {
  const { user } = useAuth();
  const [retos, setRetos] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    if (user) {
      obtenerRetosPendientes(user.uid).then(setRetos);
    }
  }, [user]);

  const handleAceptar = async (retoId: string) => {
    const puntajeSimulado = Math.floor(Math.random() * 100); // reemplaza con el puntaje real si aplica
    await aceptarReto(retoId, puntajeSimulado);
    setToastMsg("¡Reto aceptado!");
    setRetos(retos.filter((r) => r.id !== retoId));
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Retos Recibidos</h2>
        <IonList>
          {retos.map((reto) => (
            <IonItem key={reto.id}>
              <IonLabel>
                <p>De: {reto.emisorUid}</p>
                <p>Puntaje: {reto.puntajeEmisor}</p>
              </IonLabel>
              <IonButton onClick={() => handleAceptar(reto.id)}>Aceptar</IonButton>
            </IonItem>
          ))}
        </IonList>
        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastMsg("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default RetosRecibidos;
