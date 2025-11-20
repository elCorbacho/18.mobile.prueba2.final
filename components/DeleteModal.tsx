import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface DeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({ visible, onConfirm, onCancel }: DeleteModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalFondo}>
        <View style={styles.modalBox}>
          <Ionicons name="warning-outline" size={40} color={colors.danger} />

          <Text style={styles.modalTitulo}>¿Eliminar tarea?</Text>
          <Text style={styles.modalTexto}>Esta acción no se puede deshacer.</Text>

          <View style={styles.modalBotones}>
            <Pressable
              onPress={onCancel}
              style={styles.botonCancelar}
            >
              <Text style={styles.cancelarText}>Cancelar</Text>
            </Pressable>

            <Pressable onPress={onConfirm} style={styles.botonEliminar}>
              <Text style={styles.eliminarText}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
