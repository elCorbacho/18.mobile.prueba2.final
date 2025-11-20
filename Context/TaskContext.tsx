import { createContext } from "react";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  imagen?: string;
  completed: boolean;
  userEmail: string;
  createdAt: string;
}

export interface TaskContextType {
  lista: Tarea[];
  agregarTarea: (tarea: Omit<Tarea, "id" | "createdAt" | "userEmail">, userEmail: string) => void;
  eliminarTarea: (id: string) => void;
  editarTarea: (id: string, tarea: Partial<Tarea>) => void;
}

export const TaskContext = createContext<TaskContextType>({
  lista: [],
  agregarTarea: () => {},
  eliminarTarea: () => {},
  editarTarea: () => {},
});