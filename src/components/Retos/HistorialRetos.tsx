// src/components/Retos/HistorialRetos.tsx
import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { obtenerHistorial } from "../../service/retoService";
import { useAuth } from "../../context/AuthContext";

const HistorialRetos: React.FC = () => {
  const { user } = useAuth();
  const [historial, setHistorial] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      obtenerHistorial(user.uid).then(setHistorial);
    }
  }, [user]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Historial de Retos</h2>
        <IonList>
          {historial.map((reto) => (
            <IonItem key={reto.id}>
              <IonLabel>
                <p>De: {reto.emisorUid}</p>
                <p>Para: {reto.receptorUid}</p>
                <p>Puntajes: {reto.puntajeEmisor} - {reto.puntajeReceptor ?? "Sin jugar"}</p>
                <p>Estado: {reto.estado}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HistorialRetos;
