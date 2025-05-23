import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonToast,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import { crearReto } from "../../service/retoService";
import { useAuth } from "../../context/AuthContext";
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { enviarNotificacionPush } from "../../service/notification";

interface Props {
  location: {
    state: {
      puntaje: number;
    };
  };
}

interface Usuario {
  uid: string;
  nombre: string;
  correo?: string;
}

const EnviarReto: React.FC<Props> = ({ location }) => {
  const { user } = useAuth();
  const puntajeActual = location?.state?.puntaje ?? 0;

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [receptorUid, setReceptorUid] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastError, setToastError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const db = getFirestore();
        const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
        const lista: Usuario[] = [];

        usuariosSnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id !== user?.uid) {
            lista.push({
              uid: doc.id,
              nombre: data.nombre || "Sin nombre",
              correo: data.correo || "",
            });
          }
        });

        setUsuarios(lista);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setToastError("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [user]);

  const handleEnviarReto = async () => {
    if (!receptorUid || !user) return;

    try {
      await crearReto(user.uid, receptorUid, puntajeActual);
      setShowToast(true);
      setReceptorUid("");

      // Enviar notificación al receptor
      const db = getFirestore();
      const receptorDocRef = doc(db, "usuarios", receptorUid);
      const receptorDoc = await getDoc(receptorDocRef);

      if (!receptorDoc.exists()) {
        throw new Error("Usuario receptor no encontrado.");
      }

      const receptorData = receptorDoc.data();
      const token = receptorData?.tokenDispositivo;

      if (!token) {
        console.warn("El usuario no tiene un token registrado.");
        return;
      }

      await enviarNotificacionPush({
        token,
        title: "Nuevo reto recibido",
        body: `${user.displayName || "Un jugador"} te ha retado con ${puntajeActual} puntos.`,
        data: {
          tipo: "reto",
          emisorUid: user.uid,
        },
      });
    } catch (error) {
      console.error("Error al enviar reto:", error);
      setToastError("Hubo un error al enviar el reto.");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Enviar reto</h2>

        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <>
            <IonItem>
              <IonLabel>Selecciona un amigo</IonLabel>
              <IonSelect
                placeholder="Selecciona"
                value={receptorUid}
                onIonChange={(e) => setReceptorUid(e.detail.value)}
              >
                {usuarios.map((u) => (
                  <IonSelectOption key={u.uid} value={u.uid}>
                    {u.nombre} ({u.correo})
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {receptorUid && (
              <p>
                Correo seleccionado:{" "}
                {usuarios.find((u) => u.uid === receptorUid)?.correo || "No disponible"}
              </p>
            )}
          </>
        )}

        <p>
          Puntaje actual: <strong>{puntajeActual}</strong>
        </p>

        <IonButton expand="block" onClick={handleEnviarReto} disabled={!receptorUid}>
          Enviar Reto
        </IonButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Reto enviado exitosamente."
          duration={2000}
          color="success"
        />

        <IonToast
          isOpen={!!toastError}
          onDidDismiss={() => setToastError("")}
          message={toastError}
          duration={2500}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default EnviarReto;
