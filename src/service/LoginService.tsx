import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonLoading,
} from "@ionic/react";
import { auth, messaging } from "../config/firebaseConfig";
import { getToken } from "firebase/messaging";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./LoginService.css";

const LoginService: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const vapidKey =
  "BAffDkGrxLFl2QWIWxfnh4MaTZmqnYgmrM-ddelh37V_dkLlyfmExc6e5yzL252bUHTsuqSLSNSRsMAwyTIRL_s";
    const guardarTokenDispositivo = async (uid: string, email: string) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Permiso de notificaciones no otorgado");
        return;
      }

      const token = await getToken(messaging, {
        vapidKey,
      });

      if (token) {
        const db = getFirestore();
        await setDoc(
          doc(db, "usuarios", uid),
          {
            tokenDispositivo: token,
            correo: email,
          },
          { merge: true }
        );
        console.log("Token y correo guardados en Firebase:", token, email);
      } else {
        console.warn(
          "No se pudo obtener el token. Asegúrate de que el SW esté registrado y se haya dado permiso."
        );
      }
    } catch (error) {
      console.error("Error al obtener el token de dispositivo:", error);
    }
  };
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await guardarTokenDispositivo(userCredential.user.uid, email);
      history.replace("/");
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };


  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      history.replace("/");
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <IonLoading isOpen message="Procesando..." />;
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <IonItem lines="none">
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value ?? "")}
            required
          />
        </IonItem>
        <IonItem lines="none">
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value ?? "")}
            required
          />
        </IonItem>
        {error && <IonText color="danger">{error}</IonText>}
        <IonButton expand="block" type="submit" disabled={!email || !password} className="main-button">
          Iniciar Sesión
        </IonButton>
      </form>
      <IonButton
        expand="block"
        color="primary"
        onClick={handleRegister}
        disabled={!email || !password}
        className="main-button"
        style={{ marginTop: "1rem" }}
      >
        Registrar
      </IonButton>
    </div>
  );
};

export default LoginService;
