import { useEffect } from "react";

type Star = {
  id: number;
  x: number;
  y: number;
  tipo: "amarilla" | "morada";
};

type Props = {
  ballPosition: { x: number; y: number };
  stars: Star[];
  onStarCollected: (id: number, puntos: number) => void;
  ballRadius: number;
  starSize: number;
};

const GameLogic = ({
  ballPosition,
  stars,
  onStarCollected,
  ballRadius,
  starSize,
}: Props) => {
  useEffect(() => {
    const interval = setInterval(() => {
      stars.forEach((star) => {
        const dx = star.x + starSize / 2 - ballPosition.x;
        const dy = star.y + starSize / 2 - ballPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + starSize / 2) {
          const puntos = star.tipo === "amarilla" ? 1 : 5;
          onStarCollected(star.id, puntos);
        }
      });
    }, 100); // Verificar colisiones cada 100ms

    return () => clearInterval(interval);
  }, [stars, ballPosition]);

  return null; // No renderiza nada
};

export default GameLogic;
