import { useEffect } from "react";
import { Motion } from "@capacitor/motion";

type Props = {
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  ballSize: number;
};

const Acelerometro = ({ position, setPosition, ballSize }: Props) => {
  useEffect(() => {
    let listener: { remove: () => void } | null = null;

    const startListening = async () => {
      listener = await Motion.addListener("accel", (event) => {
        const { x = 0, z = 0 } = event.acceleration;

        const maxWidth = window.innerWidth - ballSize;
        const maxHeight = window.innerHeight - ballSize;

        setPosition((prev) => ({
          x: Math.min(Math.max(prev.x + x * 5, 0), maxWidth),
          y: Math.min(Math.max(prev.y - z * 5, 0), maxHeight),
        }));
      });
    };

    startListening();

    return () => {
      if (listener) listener.remove();
    };
  }, [ballSize, setPosition]);

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: ballSize,
        height: ballSize,
        borderRadius: "50%",
        backgroundColor: "deepskyblue",
        boxShadow: "0 0 15px 5px rgba(0, 191, 255, 0.6)",
        transition: "top 0.05s linear, left 0.05s linear",
        zIndex: 20,
      }}
    />
    
  );
};

export default Acelerometro;
