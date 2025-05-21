import { db } from "../config/firebaseConfig";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

// Crear un nuevo reto
export async function crearReto(emisorUid: string, receptorUid: string, puntajeEmisor: number) {
  try {
    await addDoc(collection(db, "retos"), {
      emisorUid,
      receptorUid,
      puntajeEmisor,
      estado: "pendiente", // otros estados: "aceptado", "rechazado", "finalizado"
      fecha: new Date(),
    });
    console.log("Reto enviado con éxito");
  } catch (error) {
    console.error("Error al crear el reto:", error);
  }
}

// Obtener retos recibidos pendientes
export async function obtenerRetosPendientes(uid: string) {
  try {
    const q = query(
      collection(db, "retos"),
      where("receptorUid", "==", uid),
      where("estado", "==", "pendiente")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error al obtener retos:", error);
    return [];
  }
}

// Aceptar reto (jugar y guardar resultado)
export async function aceptarReto(retoId: string, puntajeReceptor: number) {
  try {
    const retoRef = doc(db, "retos", retoId);
    await updateDoc(retoRef, {
      puntajeReceptor,
      estado: "finalizado",
    });
    console.log("Reto aceptado y finalizado");
  } catch (error) {
    console.error("Error al aceptar reto:", error);
  }
}

// Obtener historial de retos (jugados por el usuario)
export async function obtenerHistorial(uid: string) {
  try {
    const q = query(
      collection(db, "retos"),
      where("estado", "==", "finalizado")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((reto) => reto.emisorUid === uid || reto.receptorUid === uid);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
}
