import { useEffect, useState } from "react";
import { IonPage, IonContent } from '@ionic/react';
import { Motion } from "@capacitor/motion";
import Estrellas from "./Estrellas";
import GameLogic from "../Juego/Logica";

const BALL_SIZE = 30;

const Acelerometro = () => {
  // Posición bola
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - BALL_SIZE / 2,
    y: window.innerHeight / 2 - BALL_SIZE / 2,
  });

  // Estado para estrellas (las gestionas en Estrellas)
  const [stars, setStars] = useState<{ id: number; x: number; y: number; tipo: "amarilla" | "morada"; }[]>([]);

  // Puntaje
  const [score, setScore] = useState(0);
  // Tiempo restante
  const [timeLeft, setTimeLeft] = useState(40);
  // Estado juego terminado
  const [gameOver, setGameOver] = useState(false);

  // Escuchar acelerómetro para mover la bola
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
      if (listener) listener.remove();
    };
  }, []);

  // Temporizador de 40 segundos
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Función para actualizar puntaje y eliminar estrella cuando se recolecta
  const handleStarCollected = (id: number, puntos: number) => {
    setScore((prev) => prev + puntos);
    // Eliminar estrella recolectada
    setStars((prev) => prev.filter((star) => star.id !== id));
  };

  return (
    <IonPage>
      {/* Mostrar HUD de tiempo y puntaje */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 30, color: "white", fontSize: 24 }}>
        ⏱ {timeLeft}s | ⭐ {score}
      </div>

      <Estrellas stars={stars} setStars={setStars} gameOver={gameOver} />

      <IonContent fullscreen>
        {/* Mostrar pantalla final si terminó el juego */}
        {gameOver ? (
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100
          }}>
            <h1>🎉 ¡Tiempo terminado!</h1>
            <h2>Tu puntaje: {score}</h2>
          </div>
        ) : (
          <>
            {/* Bola controlada por acelerómetro */}
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

            {/* Lógica invisible para verificar colisiones */}
           <GameLogic
              ballPosition={position}
              stars={stars}
              onStarCollected={handleStarCollected}
              ballRadius={BALL_SIZE / 2}
              starSizeAmarilla={24}
              starSizeMorada={30}
            />

          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Acelerometro;
