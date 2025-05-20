import { useEffect, useState } from "react";
import { IonPage, IonContent } from "@ionic/react";
import Acelerometro from "./Acelerometro";
import Estrellas from "./Estrellas";
import GameLogic from "./Logica";

const Juego = () => {
  const BALL_SIZE = 30;
  const STAR_SIZE_AMARILLA = 24;
  const STAR_SIZE_MORADA = 30;

  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - BALL_SIZE / 2,
    y: window.innerHeight / 2 - BALL_SIZE / 2,
  });

  const [stars, setStars] = useState<
    { id: number; x: number; y: number; tipo: "amarilla" | "morada" }[]
  >([]);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameOver, setGameOver] = useState(false);

  // ✅ Función con los parámetros correctos esperados por GameLogic
  const handleStarCollected = (id: number, puntos: number) => {
     console.log(`✅ handleStarCollected: id=${id}, puntos=${puntos}`);
    setStars((prevStars) => prevStars.filter((s) => s.id !== id));
    setScore((prev) => prev + puntos);
  };

  // Temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* HUD */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 30,
            color: "white",
            fontSize: 24,
          }}
        >
          ⏱ {timeLeft}s | ⭐ {score}
        </div>

        {/* Pantalla final */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <h1>🎉 ¡Tiempo terminado!</h1>
            <h2>Tu puntaje: {score}</h2>
          </div>
        )}

        {/* Estrellas y movimiento */}
        <Estrellas stars={stars} setStars={setStars} gameOver={gameOver} />
        <Acelerometro
          position={position}
          setPosition={setPosition}
          ballSize={BALL_SIZE}
        />
        <GameLogic
          ballPosition={position}
          stars={stars}
          onStarCollected={handleStarCollected}
          ballRadius={BALL_SIZE / 2}
          starSizeAmarilla={STAR_SIZE_AMARILLA}
          starSizeMorada={STAR_SIZE_MORADA}
        />
      </IonContent>
    </IonPage>
  );
};

export default Juego;
