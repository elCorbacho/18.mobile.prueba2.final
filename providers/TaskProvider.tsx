import { ReactNode, useState } from "react";
import uuid from "react-native-uuid";
import { Tarea, TaskContext } from "../Context/TaskContext";

export function TaskProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<Tarea[]>([]);

  const agregarTarea = (tarea: {
    titulo: string;
    descripcion?: string;
    imagen?: string;
    completed: boolean;
  }, userEmail: string) => {
    const nueva: Tarea = {
      id: uuid.v4().toString(),
      ...tarea,
      userEmail: userEmail,
      createdAt: new Date().toISOString(),
    };

    setLista((prev) => [...prev, nueva]);
  };

  const eliminarTarea = (id: string) => {
    setLista((prev) => prev.filter((t) => t.id !== id));
  };

  const editarTarea = (
    id: string,
    cambios: {
      titulo?: string;
      descripcion?: string;
      imagen?: string;
    }
  ) => {
    setLista((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...cambios } : t))
    );
  };

  return (
    <TaskContext.Provider
      value={{ lista, agregarTarea, eliminarTarea, editarTarea }}
    >
      {children}
    </TaskContext.Provider>
  );
}