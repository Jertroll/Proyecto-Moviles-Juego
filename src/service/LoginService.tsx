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
import { auth } from "../config/firebaseConfig";

const LoginEmailAndPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.replace("/home");
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
      history.replace("/home");
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <IonLoading isOpen message="Procesando..." />;
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value ?? "")}
            required
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value ?? "")}
            required
          />
        </IonItem>
        <IonButton expand="block" type="submit" disabled={!email || !password}>
          Login
        </IonButton>
      </form>
      <IonButton
        expand="block"
        color="primary"
        onClick={handleRegister}
        disabled={!email || !password}
        style={{ marginTop: "1rem", color: "black" }}
      >
        Registrar
      </IonButton>
    </>
  );
};

export default LoginEmailAndPassword;
