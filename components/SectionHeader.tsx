import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface SectionHeaderProps {
  title: string;
  count: number;
}

export const SectionHeader = ({ title, count }: SectionHeaderProps) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>({count})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },

  sectionCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
