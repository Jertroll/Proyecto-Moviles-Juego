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
  starSizeAmarilla: number;
  starSizeMorada: number;
};

const GameLogic = ({
  ballPosition,
  stars,
  onStarCollected,
  ballRadius,
  starSizeAmarilla,
  starSizeMorada,
}: Props) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const ballCenterX = ballPosition.x + ballRadius;
      const ballCenterY = ballPosition.y + ballRadius;

      stars.forEach((star) => {
        const starSize = star.tipo === "amarilla" ? starSizeAmarilla : starSizeMorada;
        const starRadius = starSize / 2;
        const starCenterX = star.x + starRadius;
        const starCenterY = star.y + starRadius;

        const dx = starCenterX - ballCenterX;
        const dy = starCenterY - ballCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius + starRadius) {
          const puntos = star.tipo === "amarilla" ? 1 : 5;
          onStarCollected(star.id, puntos);
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [stars, ballPosition, ballRadius, starSizeAmarilla, starSizeMorada, onStarCollected]);

  return null;
};

export default GameLogic;
