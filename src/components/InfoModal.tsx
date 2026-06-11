/**
 * ============================================
 * COMPONENTE: InfoModal (Dialog/Modal)
 * ============================================
 * 
 * Este componente muestra un modal emergente con un mensaje de información.
 * 
 * Características:
 * - Se abre y cierra mediante props (visible)
 * - Usa Modal de React Native para visibilidad en la pantalla
 * - Compatible con Android e iOS
 * - Se puede cerrar con un botón
 */

import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoModalProps {
  /** Define si el modal está visible o no */
  visible: boolean;

  /** Función que se ejecuta cuando se cierra el modal */
  onClose: () => void;
}

/**
 * InfoModal: Componente de modal para mostrar mensajes
 *
 * Uso:
 * const [modalVisible, setModalVisible] = useState(false);
 * <InfoModal visible={modalVisible} onClose={() => setModalVisible(false)} />
 *
 * El Modal renderiza una capa semitransparente (backdrop) y muestra
 * contenido encima. Se controla completamente mediante JavaScript.
 */
export function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal
      // visible: controla si el modal se muestra
      visible={visible}
      // transparent: hace el fondo semitransparente
      transparent={true}
      // animationType: "fade" es más suave que "slide" o "none"
      animationType="fade"
      // onRequestClose: en Android, se ejecuta al presionar el botón Atrás
      onRequestClose={onClose}
    >
      {/* Contenedor con fondo semitransparente */}
      <View style={styles.backdrop}>
        {/* Tarjeta del modal centrada */}
        <View style={styles.modalContent}>
          {/* Icono del modal */}
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={56} color="#6fb3ff" />
          </View>

          {/* Título del modal */}
          <Text style={styles.title}>Aviso Informativo</Text>

          {/* Descripción/Mensaje */}
          <Text style={styles.message}>
            Este modal demuestra cómo crear diálogos emergentes en React Native. Se abre
            presionando botones y se cierra con el botón de abajo.
          </Text>

          {/* Botón de cerrar */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Entendido</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /**
   * backdrop: Capa semitransparente detrás del modal
   * Ocupa toda la pantalla y tiene un color oscuro con transparencia
   */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Negro con 60% de opacidad
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * modalContent: Tarjeta principal del modal
   * - Ancho máximo: 85% de la pantalla (responsive)
   * - Color de fondo oscuro para mantener el tema
   * - Bordes redondeados para un diseño moderno
   */
  modalContent: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: '#0f1f2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.2)',
    // Sombra (solo funciona en iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    // Elevación (Android)
    elevation: 8,
  },

  /**
   * iconContainer: Contenedor para el icono del modal
   * Añade un círculo de fondo para destacar el icono
   */
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(110, 179, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  /**
   * title: Título del modal
   * - Texto blanco y grande
   * - Fontweight 900 para destacar
   */
  title: {
    color: '#f6fbff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },

  /**
   * message: Mensaje descriptivo
   * - Texto gris claro
   * - Centrado y con espaciado entre líneas
   */
  message: {
    color: '#9db9d3',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 20,
  },

  /**
   * closeButton: Botón para cerrar el modal
   * - Color azul principal
   * - Ancho completo dentro del modal
   * - Padding vertical generoso para fácil toque
   */
  closeButton: {
    width: '100%',
    backgroundColor: '#2e76ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  /**
   * closeButtonText: Texto del botón
   * - Blanco y con peso 800 para legibilidad
   */
  closeButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
