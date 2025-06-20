import { useEffect, useRef } from "react";

const Tamaño_Estrella = 24;
const Tamaño_Estrella_Morada = 32;
const Duracion_Estrella = 8000;
const Maximo_Estrellas_Amarillas = 3;

type Estrella = {
  id: number;
  x: number;
  y: number;
  tipo: "amarilla" | "morada";
};

type Props = {
  stars: Estrella[];
  setStars: React.Dispatch<React.SetStateAction<Estrella[]>>;
  gameOver: boolean;
};

let idGlobal = 0;

const Estrellas = ({ stars, setStars, gameOver }: Props) => {
  const estrellasRef = useRef<Estrella[]>([]);
  const totalAmarillasRef = useRef(0);
  const ultimoMorado = useRef(0);

  // Mantener ref sincronizada con el estado stars
  useEffect(() => {
    estrellasRef.current = stars;
  }, [stars]);

  useEffect(() => {
    if (gameOver) return; // Si el juego terminó, no generar más estrellas

    const intervaloAmarillas = setInterval(() => {
      const cantidadActualAmarillas = estrellasRef.current.filter((e) => e.tipo === "amarilla").length;
      if (cantidadActualAmarillas >= Maximo_Estrellas_Amarillas) return;

      const id = idGlobal++;
      const x = Math.random() * (window.innerWidth - Tamaño_Estrella);
      const y = Math.random() * (window.innerHeight - Tamaño_Estrella);

      const nuevaEstrella: Estrella = { id, x, y, tipo: "amarilla" };

      setStars((prev) => {
        const actualizadas = [...prev, nuevaEstrella];
        estrellasRef.current = actualizadas;
        return actualizadas;
      });

      totalAmarillasRef.current += 1;

      if (
        totalAmarillasRef.current % 15 === 0 &&
        totalAmarillasRef.current !== ultimoMorado.current
      ) {
        ultimoMorado.current = totalAmarillasRef.current;
        crearEstrellaMorada();
      }

      setTimeout(() => {
        setStars((prev) => {
          const filtradas = prev.filter((estrella) => estrella.id !== id);
          estrellasRef.current = filtradas;
          return filtradas;
        });
      }, Duracion_Estrella);
    }, 2000);

    return () => clearInterval(intervaloAmarillas);
  }, [gameOver, setStars]);

  const crearEstrellaMorada = () => {
    const id = idGlobal++;
    const x = Math.random() * (window.innerWidth - Tamaño_Estrella_Morada);
    const y = Math.random() * (window.innerHeight - Tamaño_Estrella_Morada);

    const nuevaEstrella: Estrella = { id, x, y, tipo: "morada" };

    setStars((prev) => {
      const actualizadas = [...prev, nuevaEstrella];
      estrellasRef.current = actualizadas;
      return actualizadas;
    });

    setTimeout(() => {
      setStars((prev) => {
        const filtradas = prev.filter((estrella) => estrella.id !== id);
        estrellasRef.current = filtradas;
        return filtradas;
      });
    }, Duracion_Estrella);
  };

  return (
    <>
      {stars.map((estrella) => (
        <div
          key={estrella.id}
          style={{
            position: "absolute",
            top: estrella.y,
            left: estrella.x,
            fontSize: estrella.tipo === "morada" ? Tamaño_Estrella_Morada : Tamaño_Estrella,
            zIndex: 10,
            transition: "opacity 0.3s ease-in-out",
            color: estrella.tipo === "amarilla" ? "gold" : "violet",
            textShadow:
              estrella.tipo === "amarilla"
                ? "0 0 10px gold"
                : "0 0 10px violet",
            userSelect: "none",
          }}
        >
          ⭐
        </div>
      ))}
    </>
  );
};

export default Estrellas;
