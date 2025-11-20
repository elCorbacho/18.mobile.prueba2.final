import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    FlatList,
    Platform,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../Context/AuthContext";
import { TaskContext, TaskContextType } from "../Context/TaskContext";
import { colors } from "../theme/colors";
import { Header } from "../components/Header";
import { SectionHeader } from "../components/SectionHeader";
import { TaskCard } from "../components/TaskCard";
import { DeleteModal } from "../components/DeleteModal";

export default function HomeScreen() {
  const router = useRouter();

  const { lista, eliminarTarea, editarTarea } = useContext<TaskContextType>(TaskContext);
  const { logout, userEmail } = useContext(AuthContext);

  // Filtrar solo las tareas del usuario logueado
  const misTareas = lista.filter(tarea => tarea.userEmail === userEmail);
  
  // Separar tareas completadas y no completadas
  const tareasNoCompletadas = misTareas.filter(tarea => !tarea.completed);
  const tareasCompletadas = misTareas.filter(tarea => tarea.completed);

  const [modalVisible, setModalVisible] = useState(false);
  const [tareaAEliminar, setTareaAEliminar] = useState<string | null>(null);

  const confirmarEliminar = (id: string) => {
    setTareaAEliminar(id);
    setModalVisible(true);
  };

  const borrar = () => {
    if (tareaAEliminar) eliminarTarea(tareaAEliminar);
    setModalVisible(false);
    setTareaAEliminar(null);
  };

  // Cambiar estado de la tarea
  const cambiarEstadoTarea = (id: string, currentCompleted: boolean) => {
    editarTarea(id, { completed: !currentCompleted });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con email y logout */}
      <Header userEmail={userEmail || ""} onLogout={logout} />

      {/* Botón flotante de agregar tarea */}
      <TouchableOpacity
        style={styles.botonAdd}
        onPress={() =>
          router.push({
            pathname: "/add-task",
          })
        }
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Lista de tareas con agrupadores */}
      <FlatList
        data={[
          { type: "header", title: "No Completadas", count: tareasNoCompletadas.length },
          ...tareasNoCompletadas.map(t => ({ ...t, type: "tarea" })),
          { type: "header", title: "Completadas", count: tareasCompletadas.length },
          ...tareasCompletadas.map(t => ({ ...t, type: "tarea" })),
        ] as any[]}
        keyExtractor={(item: any, index: number) => 
          item.type === "header" ? `header-${index}` : item.id
        }
        renderItem={({ item, index }: { item: any; index: number }) => {
          if (item.type === "header") {
            return (
              <SectionHeader title={item.title} count={item.count} />
            );
          }
          return (
            <TaskCard
              item={item}
              index={index}
              onChangeStatus={() => cambiarEstadoTarea(item.id, item.completed)}
              onDelete={() => confirmarEliminar(item.id)}
              onEdit={() =>
                router.push({
                  pathname: "/Edit-task",
                  params: { id: item.id },
                })
              }
            />
          );
        }}
      />

      {/* Modal de confirmación */}
      <DeleteModal
        visible={modalVisible}
        onConfirm={borrar}
        onCancel={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

/* estilos */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    backgroundColor: colors.background,
  },

  botonAdd: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "android" ? 80 : 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 999,
  },
});