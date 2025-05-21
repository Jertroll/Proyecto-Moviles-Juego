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
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
}

const EnviarReto: React.FC<Props> = ({ location }) => {
  const { user } = useAuth();
  const puntajeActual = location?.state?.puntaje ?? 0;

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [receptorUid, setReceptorUid] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔍 Cargar usuarios disponibles
  useEffect(() => {
    const fetchUsuarios = async () => {
      const db = getFirestore();
      const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
      const lista: Usuario[] = [];

      usuariosSnapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== user?.uid) {
          lista.push({ uid: doc.id, nombre: data.nombre || "Sin nombre" });
        }
      });

      setUsuarios(lista);
      setLoading(false);
    };

    fetchUsuarios();
  }, [user]);

  const handleEnviarReto = async () => {
    if (!receptorUid || !user) return;

    try {
      await crearReto(user.uid, receptorUid, puntajeActual);
      setShowToast(true);
      setReceptorUid("");
    } catch (error) {
      console.error("Error al enviar reto:", error);
      alert("Hubo un error al enviar el reto.");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Enviar reto</h2>

        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <IonItem>
            <IonLabel>Selecciona un amigo</IonLabel>
            <IonSelect
              placeholder="Selecciona"
              value={receptorUid}
              onIonChange={(e) => setReceptorUid(e.detail.value)}
            >
              {usuarios.map((u) => (
                <IonSelectOption key={u.uid} value={u.uid}>
                  {u.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
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
      </IonContent>
    </IonPage>
  );
};

export default EnviarReto;
