import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    FlatList,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../Context/AuthContext";
import { TaskContext, TaskContextType } from "../Context/TaskContext";
import { colors } from "../theme/colors";
import { Header } from "../components/Header";
import { CollapsibleSection } from "../components/CollapsibleSection";
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
  const [expandedNoCompletadas, setExpandedNoCompletadas] = useState(true);
  const [expandedCompletadas, setExpandedCompletadas] = useState(true);

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
    <SafeAreaView style={styles.container} edges={["top"]}>
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

      {/* Secciones colapsables de tareas */}
      <FlatList
        data={[
          {
            type: "section",
            id: "no-completadas",
            title: "No Completadas",
            count: tareasNoCompletadas.length,
            expanded: expandedNoCompletadas,
            setExpanded: setExpandedNoCompletadas,
            tareas: tareasNoCompletadas,
          },
          {
            type: "section",
            id: "completadas",
            title: "Completadas",
            count: tareasCompletadas.length,
            expanded: expandedCompletadas,
            setExpanded: setExpandedCompletadas,
            tareas: tareasCompletadas,
          },
        ] as any[]}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (
          <CollapsibleSection
            title={item.title}
            count={item.count}
            isExpanded={item.expanded}
            onToggle={() => item.setExpanded(!item.expanded)}
          >
            {item.tareas.map((tarea: any, index: number) => (
              <TaskCard
                key={tarea.id}
                item={tarea}
                index={index}
                onChangeStatus={() => cambiarEstadoTarea(tarea.id, tarea.completed)}
                onDelete={() => confirmarEliminar(tarea.id)}
                onEdit={() =>
                  router.push({
                    pathname: "/Edit-task",
                    params: { id: tarea.id },
                  })
                }
              />
            ))}
          </CollapsibleSection>
        )}
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