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
    const checkCollisions = () => {
      // Calcula el centro de la bola más precisamente
      const ballCenterX = ballPosition.x + ballRadius;
      const ballCenterY = ballPosition.y + ballRadius;

      stars.forEach((star) => {
        const starSize = star.tipo === "amarilla" ? starSizeAmarilla : starSizeMorada;
        const starRadius = starSize / 2;
        
        // Calcula el centro de la estrella
        const starCenterX = star.x + starRadius;
        const starCenterY = star.y + starRadius;

        // Distancia entre centros con ajuste de sensibilidad
        const dx = starCenterX - ballCenterX;
        const dy = starCenterY - ballCenterY;
        const distanceSquared = dx * dx + dy * dy;
        
        // Radio combinado con margen de 5px para mejor detección
        const combinedRadius = (ballRadius + starRadius) * 1.5;
        const minDistanceSquared = combinedRadius * combinedRadius;

        if (distanceSquared < minDistanceSquared) {
          console.log('✅ Colisión detectada!', {
            ball: { x: ballCenterX, y: ballCenterY, r: ballRadius },
            star: { x: starCenterX, y: starCenterY, r: starRadius },
            distance: Math.sqrt(distanceSquared),
            required: combinedRadius
          });
          const puntos = star.tipo === "amarilla" ? 1 : 5;
          onStarCollected(star.id, puntos);
        }
      });
    };

    const collisionInterval = setInterval(checkCollisions, 16); // ≈60fps
    return () => clearInterval(collisionInterval);
  }, [stars, ballPosition, ballRadius, starSizeAmarilla, starSizeMorada, onStarCollected]);

  return null;
};

export default GameLogic;