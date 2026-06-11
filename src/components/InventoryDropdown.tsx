/**
 * ============================================
 * COMPONENTE: InventoryDropdown
 * ============================================
 * 
 * Selector desplegable (Dropdown/Picker) compatible con:
 * - iOS
 * - Android
 * 
 * Características:
 * - No depende de librerías externas
 * - Responsive design
 * - Muestra el valor seleccionado
 * - Usa Modal para la UI del dropdown
 */

import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownOption {
  /** Valor interno (lo que se guarda) */
  value: string;

  /** Etiqueta visible para el usuario */
  label: string;
}

interface InventoryDropdownProps {
  /** Texto descriptivo encima del dropdown */
  label: string;

  /** Array de opciones disponibles */
  options: DropdownOption[];

  /** Valor actualmente seleccionado */
  value: string;

  /** Función que se ejecuta cuando cambia la selección */
  onChange: (value: string) => void;
}

/**
 * InventoryDropdown: Selector desplegable personalizado
 *
 * ¿Por qué no usar Picker de React Native?
 * - Picker tiene limitaciones visuales en iOS
 * - Con Modal + Pressable tenemos control total del diseño
 * - Funciona igual en ambas plataformas
 *
 * Flujo:
 * 1. Usuario toca el botón
 * 2. Se abre un Modal con la lista de opciones
 * 3. Usuario toca una opción
 * 4. Se ejecuta onChange()
 * 5. Modal se cierra
 */
export function InventoryDropdown({
  label,
  options,
  value,
  onChange,
}: InventoryDropdownProps) {
  // ===== ESTADO LOCAL =====
  /**
   * isOpen: Controla si el dropdown está abierto (mostrando opciones)
   * - true: Modal visible con opciones
   * - false: Solo muestra el botón del dropdown
   */
  const [isOpen, setIsOpen] = useState(false);

  // ===== CÁLCULOS =====
  /**
   * selectedLabel: Obtiene la etiqueta de la opción seleccionada
   * 
   * Ejemplo:
   * - options = [{value: 'all', label: 'Todas'}]
   * - value = 'all'
   * - selectedLabel = 'Todas' ← Lo que se muestra
   */
  const selectedLabel =
    options.find((option) => option.value === value)?.label || 'Seleccionar';

  // ===== FUNCIONES =====
  /**
   * handleSelect: Ejecuta cuando el usuario toca una opción
   *
   * @param selectedValue - El valor de la opción tocada
   */
  const handleSelect = (selectedValue: string) => {
    // Actualizar el valor seleccionado
    onChange(selectedValue);

    // Cerrar el modal
    setIsOpen(false);
  };

  return (
    <View>
      {/* ===== ETIQUETA ===== */
      /**
       * Texto descriptivo que explica qué es este dropdown
       */
      }
      <Text style={styles.label}>{label}</Text>

      {/* ===== BOTÓN DEL DROPDOWN ===== */
      /**
       * El usuario toca esto para abrir/cerrar el dropdown
       * Muestra:
       * - El valor seleccionado
       * - Un icono de flecha para indicar que es interactivo
       */
      }
      <Pressable
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
        accessible={true}
        accessibilityLabel={`Dropdown: ${selectedLabel}`}
      >
        {/* Texto del valor seleccionado */}
        <Text style={styles.dropdownButtonText}>{selectedLabel}</Text>

        {/* Icono de flecha hacia abajo */}
        <Ionicons name="chevron-down" size={22} color="#6fb3ff" />
      </Pressable>

      {/* ===== MODAL CON OPCIONES ===== */
      /**
       * El Modal muestra la lista de opciones
       * Solo visible cuando isOpen === true
       */
      }
      <Modal
        // visible: Controla si el modal se muestra
        visible={isOpen}
        // transparent: Fondo semitransparente
        transparent={true}
        // animationType: Animación al abrir
        animationType="fade"
        // onRequestClose: Se ejecuta al presionar Atrás (Android)
        onRequestClose={() => setIsOpen(false)}
      >
        {/* ===== FONDO SEMITRANSPARENTE ===== */
        /**
         * Toca el fondo para cerrar el modal
         * Mejora la UX: usuario puede salir tocando fuera
         */
        }
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsOpen(false)}
          accessible={false}
        >
          {/* ===== CONTENEDOR DEL DROPDOWN ===== */
          /**
           * Contiene el título y la lista de opciones
           * Posicionado en la parte superior derecha
           */
          }
          <View style={styles.modalContent}>
            {/* Título del dropdown */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              {/* Botón para cerrar */}
              <Pressable
                onPress={() => setIsOpen(false)}
                accessible={true}
                accessibilityLabel="Cerrar dropdown"
              >
                <Ionicons name="close" size={24} color="#6fb3ff" />
              </Pressable>
            </View>

            {/* ===== LISTA DE OPCIONES ===== */
            /**
             * ScrollView permite scroll si hay muchas opciones
             * Cada opción es un botón presionable
             */
            }
            <ScrollView
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            >
              {/* Iterar sobre las opciones disponibles */}
              {options.map((option) => {
                // Verificar si esta opción está seleccionada
                const isSelected = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.optionButton,
                      // Si está seleccionada, cambiar el estilo
                      isSelected && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelect(option.value)}
                    accessible={true}
                    accessibilityLabel={`Opción: ${option.label}`}
                  >
                    {/* Icono de check si está seleccionada */}
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#2e76ff" />
                    )}

                    {/* Texto de la opción */}
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * label: Etiqueta descriptiva
   * Texto pequeño que explica el dropdown
   */
  label: {
    color: '#9db9d3',
    marginBottom: 10,
    fontWeight: '600',
    fontSize: 13,
  },

  /**
   * dropdownButton: Botón que el usuario toca para abrir el dropdown
   * - Parece un input deshabilitado
   * - Mostración horizontal: texto a la izquierda, icono a la derecha
   * - Tiene borde para parecer interactivo
   */
  dropdownButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#0d2034',
    borderWidth: 1.5,
    borderColor: 'rgba(110, 179, 255, 0.2)',
  },

  /**
   * dropdownButtonText: Texto dentro del botón
   * Muestra el valor seleccionado
   */
  dropdownButtonText: {
    color: '#f6fbff',
    fontSize: 15,
    fontWeight: '600',
  },

  /**
   * modalBackdrop: Fondo semitransparente detrás del modal
   * Ocupa toda la pantalla y es presionable para cerrar
   */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  /**
   * modalContent: Contenedor principal del dropdown abierto
   * - Ancho máximo: 320px (no ocupar toda la pantalla)
   * - Fondo oscuro como el tema
   * - Bordes redondeados
   */
  modalContent: {
    backgroundColor: '#0f1f2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.2)',
    overflow: 'hidden',
    maxWidth: 320,
  },

  /**
   * modalHeader: Encabezado del modal
   * Contiene el título y el botón de cerrar
   */
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110, 179, 255, 0.1)',
  },

  /**
   * modalTitle: Título en el modal
   * Muestra la etiqueta del dropdown
   */
  modalTitle: {
    color: '#f6fbff',
    fontSize: 16,
    fontWeight: '800',
  },

  /**
   * optionsList: Contenedor ScrollView para las opciones
   * Permite scroll si hay muchas opciones
   */
  optionsList: {
    maxHeight: 300, // Máximo de altura antes de scrollear
  },

  /**
   * optionButton: Botón para cada opción
   * - Padding vertical para fácil toque
   * - Flexión horizontal para icono + texto
   */
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110, 179, 255, 0.08)',
  },

  /**
   * optionButtonSelected: Estilo cuando la opción está seleccionada
   * - Fondo más oscuro para destacar
   * - Borde de separación más visible
   */
  optionButtonSelected: {
    backgroundColor: 'rgba(46, 118, 255, 0.1)',
  },

  /**
   * optionText: Texto de cada opción
   * - Color gris claro
   * - Se expande para ocupar el espacio disponible
   */
  optionText: {
    color: '#9db9d3',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },

  /**
   * optionTextSelected: Texto cuando la opción está seleccionada
   * - Color azul para contrastar
   * - Fontweight más pesado
   */
  optionTextSelected: {
    color: '#6fb3ff',
    fontWeight: '700',
  },
});
