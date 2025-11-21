import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import AnimatedButton from "../components/AnimatedButton";
import Input from "../components/Input";
import { TaskContext, TaskContextType } from "../Context/TaskContext";
import { colors } from "../theme/colors";

import type { ViewStyle } from "react-native";

/* boton con estilo dinamico  */
const getBackBtnStyle = (top: number): ViewStyle => ({
  position: "absolute",
  top: top + 10,
  left: 15,
  zIndex: 20,
  padding: 6,
  backgroundColor: "rgba(255,255,255,0.9)",
  borderRadius: 30,
});

export default function EditTaskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lista, editarTarea } = useContext<TaskContextType>(TaskContext);

  const tarea = lista.find((t) => t.id === id);

  const [titulo, setTitulo] = useState(tarea?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(tarea?.descripcion ?? "");
  const [imagen, setImagen] = useState<string | null>(tarea?.imagen ?? null);
  const [ubicacion, setUbicacion] = useState(tarea?.ubicacion ?? null);

  /* permisos para la aplicacion */

  const pedirPermisoGaleria = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Debes permitir acceso a la galería.");
        return false;
      }
      return true;
    } catch {
      Alert.alert("Error", "No se pudo pedir permiso de galería.");
      return false;
    }
  };

  const pedirPermisoCamara = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Debes permitir acceso a la cámara.");
        return false;
      }
      return true;
    } catch {
      Alert.alert("Error", "No se pudo pedir permiso de cámara.");
      return false;
    }
  };

  /* imagen de la galeria y tomar la foto */

  const elegirImagen = async () => {
    try {
      const ok = await pedirPermisoGaleria();
      if (!ok) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: Platform.OS === "ios",
        quality: 0.8,
      });

      if (!result.canceled) setImagen(result.assets[0].uri);
    } catch {
      Alert.alert("Error", "No se pudo cargar la imagen.");
    }
  };

  const tomarFoto = async () => {
    try {
      const ok = await pedirPermisoCamara();
      if (!ok) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: Platform.OS === "ios",
        quality: 0.8,
      });

      if (!result.canceled) setImagen(result.assets[0].uri);
    } catch {
      Alert.alert("Error", "No se pudo abrir la cámara.");
    }
  };

  /* ubicacion como mapa*/

  const obtenerUbicacion = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Debes permitir acceso a ubicación.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUbicacion({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    } catch {
      Alert.alert("Error", "No se pudo obtener la ubicación.");
    }
  };

  /* guardar tarea */

  const guardar = () => {
    try {
      if (!titulo.trim()) {
        Alert.alert("Error", "El título no puede estar vacío.");
        return;
      }

      editarTarea(id!, {
        titulo,
        descripcion,
        imagen: imagen ?? undefined,
        ubicacion: ubicacion ?? undefined,
      });

      router.replace("/");
    } catch {
      Alert.alert("Error", "No se pudo editar la tarea.");
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* volver */}
      <TouchableOpacity
        onPress={() => router.replace("/")}
        style={getBackBtnStyle(insets.top)}
      >
        <Ionicons name="arrow-back" size={28} color={colors.text} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.titulo}>Editar Tarea</Text>

          <View style={styles.card}>
            <Input placeholder="Título" value={titulo} onChangeText={setTitulo} />

            <Input
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              style={{ height: 120 }}
            />

            <AnimatedButton
              label="Elegir de la galería"
              onPress={elegirImagen}
              color="#8f82eeff"
              icon="images-outline"
            />

            <AnimatedButton
              label="Tomar foto"
              onPress={tomarFoto}
              color="#eeb17bff"
              icon="camera-outline"
            />

            {imagen && (
              <Image source={{ uri: imagen }} style={styles.imgPreview} />
            )}

            <AnimatedButton
              label="Obtener ubicación"
              onPress={obtenerUbicacion}
              color="#268fdfff"
              icon="location-outline"
            />

            {ubicacion && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.mapaMini}
                  initialRegion={{
                    latitude: ubicacion.lat,
                    longitude: ubicacion.lng,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                  }}
                  pointerEvents="none"
                >
                  <Marker
                    coordinate={{
                      latitude: ubicacion.lat,
                      longitude: ubicacion.lng,
                    }}
                  />
                </MapView>
              </View>
            )}

            <AnimatedButton
              label="Guardar cambios"
              onPress={guardar}
              color="#3aac69ff"
              icon="checkmark-done-outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* estilos */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 60,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  imgPreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 10,
  },

  mapContainer: {
    width: "100%",
    marginTop: 15,
  },

  mapaMini: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
});