import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { IonInput, IonButton, IonItem, IonLabel, IonText, IonLoading } from "@ionic/react";
import { auth } from "../config/firebaseConfig";

const RegisterEmailAndPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      history.replace("/home"); // redirige al usuario después del registro
    } catch (error: any) {
      setError(error.message);
    }

    setLoading(false);
  };

  if (loading) {
    return <IonLoading isOpen message='Creando cuenta...' />;
  }

  return (
    <>
      <form onSubmit={handleRegister}>
        <IonItem>
          <IonLabel position='floating'>Email</IonLabel>
          <IonInput type='email' value={email} onIonChange={(e) => setEmail(e.detail.value!)} required />
        </IonItem>
        <IonItem>
          <IonLabel position='floating'>Password</IonLabel>
          <IonInput type='password' value={password} onIonChange={(e) => setPassword(e.detail.value!)} required />
        </IonItem>
        {error && (
          <IonText color='danger'>
            <p>{error}</p>
          </IonText>
        )}
        <IonButton expand='block' type='submit'>
          Crear cuenta
        </IonButton>
      </form>
    </>
  );
};

export default RegisterEmailAndPassword;
