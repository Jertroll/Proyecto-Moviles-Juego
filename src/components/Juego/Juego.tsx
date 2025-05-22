import { useEffect, useState } from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import Acelerometro from "./Acelerometro";
import Estrellas from "./Estrellas";
import GameLogic from "./Logica";

const Juego = () => {
  const history = useHistory();
  const BALL_SIZE = 40;
  const STAR_SIZE_AMARILLA = 30;
  const STAR_SIZE_MORADA = 40;
  const INITIAL_TIME = 60;

  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - BALL_SIZE / 2,
    y: window.innerHeight / 2 - BALL_SIZE / 2,
  });

  const [stars, setStars] = useState<
    { id: number; x: number; y: number; tipo: "amarilla" | "morada" }[]
  >([]);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setPosition({
      x: window.innerWidth / 2 - BALL_SIZE / 2,
      y: window.innerHeight / 2 - BALL_SIZE / 2,
    });
    setStars([]);
    setScore(0);
    setTimeLeft(INITIAL_TIME);
    setGameOver(false);
  };

  const handleStarCollected = (id: number, puntos: number) => {
    setStars((prevStars) => prevStars.filter((s) => s.id !== id));
    setScore((prev) => prev + puntos);
  };

  const handleGoHome = () => {
    history.push("/");
  };

  useEffect(() => {
    resetGame();

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

    return () => {
      clearInterval(timer);
      resetGame();
    };
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
              gap: "20px",
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
              🎉 ¡Tiempo terminado!
            </h1>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "30px" }}>
              Tu puntaje: {score}
            </h2>

            <IonButton
              onClick={handleGoHome}
              style={{
                "--background": "#3880ff",
                "--background-hover": "#4d8cff",
                "--color": "white",
                fontSize: "1.2rem",
                padding: "20px 30px",
                borderRadius: "10px",
              }}
            >
              Salir
            </IonButton>

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
