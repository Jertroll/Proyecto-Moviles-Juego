import { useEffect, useState } from "react";
import { IonPage, IonContent } from '@ionic/react';
import { Motion } from "@capacitor/motion";
import Estrellas from "./Estrellas";
const BALL_SIZE = 30;

const Acelerometro = () => {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - BALL_SIZE / 2,
    y: window.innerHeight / 2 - BALL_SIZE / 2,
  });

  useEffect(() => {
    let listener: { remove: () => void } | null = null;

    const startListening = async () => {
      listener = await Motion.addListener("accel", (event) => {
        const { x = 0, z = 0 } = event.acceleration;

        const maxWidth = window.innerWidth - BALL_SIZE;
        const maxHeight = window.innerHeight - BALL_SIZE;

        setPosition((prev) => ({
          x: Math.min(Math.max(prev.x + x * 7, 0), maxWidth),
          y: Math.min(Math.max(prev.y - z * 7, 0), maxHeight),
        }));
      });
    };

    startListening();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  return (
    <IonPage>
      <Estrellas />
      <IonContent fullscreen>
        <div
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            width: BALL_SIZE,
            height: BALL_SIZE,
            borderRadius: "50%",
            backgroundColor: "deepskyblue",
            boxShadow: "0 0 15px 5px rgba(0, 191, 255, 0.6)",
            transition: "top 0.05s linear, left 0.05s linear",
            zIndex: 20
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Acelerometro;
