import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Tarea } from "../Context/TaskContext";
import { colors } from "../theme/colors";

interface TaskCardProps {
  item: Tarea;
  index: number;
  onChangeStatus: (id: string, currentCompleted: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const TaskCard = ({ item, index, onChangeStatus, onDelete, onEdit }: TaskCardProps) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50)}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <Text style={styles.itemTitulo}>{item.titulo}</Text>

        {item.descripcion ? (
          <Text style={styles.itemDescripcion}>{item.descripcion}</Text>
        ) : null}

        {item.imagen && (
          <Image
            source={{ uri: item.imagen }}
            style={styles.thumb}
          />
        )}
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity 
          onPress={() => onChangeStatus(item.id, item.completed)}
          style={[styles.statusButton, item.completed ? styles.statusButtonCompleted : styles.statusButtonPending]}
        >
          <Ionicons 
            name={item.completed ? "checkmark" : "close"} 
            size={16} 
            color="white" 
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onEdit(item.id)}
        >
          <Ionicons name="create-outline" size={24} color="orange" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Ionicons name="trash" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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

  statusButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  statusButtonPending: {
    backgroundColor: "#FFA500",
  },

  statusButtonCompleted: {
    backgroundColor: "#4CAF50",
  },
});
