import { useEffect, useRef, useState } from "react";

const STAR_SIZE = 24;
const STAR_DURATION = 8000;
const MAX_YELLOW_STARS = 3;

type Star = {
  id: number;
  x: number;
  y: number;
  type: "yellow" | "purple";
};

const Estrellas = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const starsRef = useRef<Star[]>([]); // 🔧 Referencia persistente

  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  useEffect(() => {
    const yellowInterval = setInterval(() => {
      const yellowCount = starsRef.current.filter((s) => s.type === "yellow").length;
      if (yellowCount >= MAX_YELLOW_STARS) return;

      const id = Date.now();
      const x = Math.random() * (window.innerWidth - STAR_SIZE);
      const y = Math.random() * (window.innerHeight - STAR_SIZE);

      const newStar: Star = { id, x, y, type: "yellow" };

      setStars((prev) => {
        const updated = [...prev, newStar];
        starsRef.current = updated;
        return updated;
      });

      setTimeout(() => {
        setStars((prev) => {
          const filtered = prev.filter((star) => star.id !== id);
          starsRef.current = filtered;
          return filtered;
        });
      }, STAR_DURATION);
    }, 2000); // cada 2 segundos

    const spawnPurple = () => {
      const delay = Math.random() * 5000 + 5000;
      setTimeout(() => {
        const id = Date.now();
        const x = Math.random() * (window.innerWidth - STAR_SIZE);
        const y = Math.random() * (window.innerHeight - STAR_SIZE);

        const newStar: Star = { id, x, y, type: "purple" };

        setStars((prev) => {
          const updated = [...prev, newStar];
          starsRef.current = updated;
          return updated;
        });

        setTimeout(() => {
          setStars((prev) => {
            const filtered = prev.filter((star) => star.id !== id);
            starsRef.current = filtered;
            return filtered;
          });
        }, STAR_DURATION);

        spawnPurple(); // recursivo
      }, delay);
    };

    spawnPurple();

    return () => clearInterval(yellowInterval);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: star.y,
            left: star.x,
            fontSize: STAR_SIZE,
            zIndex: 10,
            transition: "opacity 0.3s ease-in-out",
            color: star.type === "yellow" ? "gold" : "violet",
            textShadow:
              star.type === "yellow"
                ? "0 0 10px gold"
                : "0 0 10px violet",
          }}
        >
          ⭐
        </div>
      ))}
    </>
  );
};

export default Estrellas;
