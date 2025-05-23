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
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { enviarNotificacionPush } from "../../service/notifacationService";

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
  const puntajeSimulado = Math.floor(Math.random() * 100);

  await aceptarReto(retoId, puntajeSimulado);
  setToastMsg("¡Reto aceptado!");
  setRetos(retos.filter((r) => r.id !== retoId));

  // 🔔 Notificar al emisor del reto
  try {
    const reto = retos.find((r) => r.id === retoId);
    const db = getFirestore();
    const emisorDoc = await getDoc(doc(db, "usuarios", reto.emisorUid));
    const emisorData = emisorDoc.data();
    const token = emisorData?.fcmToken;

    if (token) {
      await enviarNotificacionPush({
        token,
        title: "¡Aceptaron tu reto!",
        body: `${user?.displayName || "Tu amigo"} aceptó tu reto con ${puntajeSimulado} puntos.`,
        data: {
          tipo: "aceptado",
          receptorUid: user?.uid || "",
        },
      });
    }
  } catch (error) {
    console.error("Error al notificar al emisor:", error);
  }
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
