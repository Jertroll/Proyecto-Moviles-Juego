import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import {
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
  IonLoading,
} from "@ionic/react";
import "./LoginService.css";

const LoginService: React.FC = () => {
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
