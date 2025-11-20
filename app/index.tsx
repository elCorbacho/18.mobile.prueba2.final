import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import Animated, { FadeInUp } from "react-native-reanimated";

import { AuthContext } from "../Context/AuthContext";
import { TaskContext, TaskContextType } from "../Context/TaskContext";
import { colors } from "../theme/colors";

export default function HomeScreen() {
  const router = useRouter();

  const { lista, eliminarTarea } = useContext<TaskContextType>(TaskContext);
  const { logout, userEmail } = useContext(AuthContext);

  // Filtrar solo las tareas del usuario logueado
  const misTareas = lista.filter(tarea => tarea.userEmail === userEmail);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Titulo */}
      <Text style={styles.titulo}>Mis Tareas</Text>

      {/* Email y Cerrar sesion en la misma fila */}
      <View style={styles.headerRow}>
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>

      {/* Boton flotante de agregar tarea */}
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

      {/* Lista de tareas SOLO DEL USUARIO LOGUEADO */}
      <FlatList
        data={misTareas}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 50)}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Text style={styles.itemTitulo}>{item.titulo}</Text>

              {item.descripcion ? (
                <Text style={styles.itemDescripcion}>{item.descripcion}</Text>
              ) : null}

              {/* imagen */}
              {item.imagen && (
                <Image
                  source={{ uri: item.imagen }}
                  style={styles.thumb}
                />
              )}

            </View>

            {/* iconos de borrar tarea y editar tarea */}
            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/Edit-task",
                    params: { id: item.id },
                  })
                }
              >
                <Ionicons name="create-outline" size={24} color="orange" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => confirmarEliminar(item.id)}>
                <Ionicons name="trash" size={24} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />

      {/* Modal de confirmacion */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalFondo}>
          <View style={styles.modalBox}>
            <Ionicons name="warning-outline" size={40} color={colors.danger} />

            <Text style={styles.modalTitulo}>¿Eliminar tarea?</Text>
            <Text style={styles.modalTexto}>Esta acción no se puede deshacer.</Text>

            <View style={styles.modalBotones}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.botonCancelar}
              >
                <Text style={styles.cancelarText}>Cancelar</Text>
              </Pressable>

              <Pressable onPress={borrar} style={styles.botonEliminar}>
                <Text style={styles.eliminarText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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

  titulo: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: colors.text,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  emailContainer: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  emailText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  logoutText: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 14,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },

  cardContent: {
    flex: 1,
    paddingRight: 10,
  },

  itemTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },

  itemDescripcion: {
    fontSize: 15,
    color: "#444",
    marginBottom: 10,
  },

  thumb: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },

  iconRow: {
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
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

  modalFondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalBox: {
    width: 300,
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginVertical: 10,
  },

  modalTexto: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
    fontSize: 16,
  },

  modalBotones: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
  },

  botonCancelar: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },

  botonEliminar: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: colors.danger,
    borderRadius: 10,
  },

  cancelarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  eliminarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});