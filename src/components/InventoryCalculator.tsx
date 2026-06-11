/**
 * ============================================
 * COMPONENTE: InventoryCalculator
 * ============================================
 * 
 * Calculadora básica con operaciones matemáticas:
 * - Suma
 * - Resta
 * - Multiplicación
 * - División (con validación)
 * 
 * Características:
 * - TextInput para entrada de números
 * - Validación de datos
 * - Manejo de errores (ej: división por 0)
 * - Resultado dinámico
 * - Responsive design
 */

import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** Tipo de operación matemática disponible */
type Operation = 'suma' | 'resta' | 'multiplica' | 'divide';

/**
 * parseNumber: Función auxiliar para convertir texto a número
 *
 * Qué hace:
 * - Reemplaza comas por puntos (compatibilidad con diferentes locales)
 * - Elimina espacios en blanco
 * - Convierte a número
 * - Retorna NaN si no es un número válido
 *
 * @param raw - String a convertir
 * @returns Número parseado o NaN
 */
function parseNumber(raw: string) {
  // Normalizar entrada: reemplazar comas por puntos
  const cleaned = raw.replace(',', '.').trim();
  
  // Convertir a número
  const parsed = Number(cleaned);
  
  // Validar que sea un número finito válido
  return Number.isFinite(parsed) ? parsed : NaN;
}

/**
 * InventoryCalculator: Componente de calculadora
 *
 * Estado:
 * - firstValue: Primer número (string para editabilidad)
 * - secondValue: Segundo número (string)
 * - result: Resultado de la operación (string para mostrar errores)
 *
 * Funcionalidad:
 * - Los valores se parsean a números en tiempo real con useMemo
 * - Al seleccionar operación, se calcula el resultado
 * - Validación: No permite dividir por 0
 */
export function InventoryCalculator() {
  // ===== ESTADO LOCAL =====
  /**
   * firstValue: Primer número como texto
   * Se mantiene como string porque el usuario está escribiendo
   */
  const [firstValue, setFirstValue] = useState('10');

  /**
   * secondValue: Segundo número como texto
   * Mismo motivo que firstValue
   */
  const [secondValue, setSecondValue] = useState('5');

  /**
   * result: Resultado de la operación
   * Es string porque puede contener mensajes de error
   */
  const [result, setResult] = useState<string>('1.00');

  // ===== CÁLCULOS MEMOIZADOS =====
  /**
   * numericFirst: firstValue convertido a número
   *
   * useMemo optimiza la conversión:
   * - Solo se recalcula cuando firstValue cambia
   * - Evita conversiones innecesarias en cada render
   */
  const numericFirst = useMemo(() => parseNumber(firstValue), [firstValue]);

  /**
   * numericSecond: secondValue convertido a número
   * Mismo principio que numericFirst
   */
  const numericSecond = useMemo(() => parseNumber(secondValue), [secondValue]);

  // ===== FUNCIONES =====
  /**
   * calculate: Realiza la operación matemática seleccionada
   *
   * Qué hace:
   * 1. Valida que ambos números sean válidos
   * 2. Ejecuta la operación seleccionada
   * 3. Maneja errores (ej: división por 0)
   * 4. Actualiza el resultado
   *
   * @param operation - Tipo de operación a realizar
   */
  const calculate = (operation: Operation) => {
    // Validar que ambos valores sean números válidos
    if (Number.isNaN(numericFirst) || Number.isNaN(numericSecond)) {
      setResult('❌ Ingresa números válidos');
      return;
    }

    // Ejecutar la operación seleccionada
    switch (operation) {
      case 'suma':
        // Suma simple
        setResult(String(numericFirst + numericSecond));
        break;

      case 'resta':
        // Resta simple
        setResult(String(numericFirst - numericSecond));
        break;

      case 'multiplica':
        // Multiplicación simple
        setResult(String(numericFirst * numericSecond));
        break;

      case 'divide':
        // División con validación de cero
        if (numericSecond === 0) {
          setResult('❌ No se puede dividir por 0');
          return;
        }
        // Limitar a 2 decimales
        setResult((numericFirst / numericSecond).toFixed(2));
        break;
    }
  };

  return (
    <View>
      {/* ===== CAMPO DE ENTRADA DE NÚMEROS ===== */}
      <Text style={styles.label}>Calculadora básica</Text>

      {/* Contenedor de inputs */}
      <View style={styles.row}>
        {/* Input 1: Primer número */}
        <TextInput
          value={firstValue}
          onChangeText={setFirstValue}
          // keyboardType: Muestra teclado numérico
          keyboardType="decimal-pad"
          placeholder="Número 1"
          placeholderTextColor="#7d9db6"
          style={styles.input}
          accessible={true}
          accessibilityLabel="Primer número"
        />

        {/* Input 2: Segundo número */}
        <TextInput
          value={secondValue}
          onChangeText={setSecondValue}
          keyboardType="decimal-pad"
          placeholder="Número 2"
          placeholderTextColor="#7d9db6"
          style={styles.input}
          accessible={true}
          accessibilityLabel="Segundo número"
        />
      </View>

      {/* ===== BOTONES DE OPERACIONES ===== */
      /**
       * Grid 2x2 con los 4 botones de operaciones
       * Cada botón ejecuta calculate() con su operación
       */
      }
      <View style={styles.buttonGrid}>
        {/* Botón SUMA */}
        <Pressable
          style={styles.actionButton}
          onPress={() => calculate('suma')}
          accessible={true}
          accessibilityLabel="Sumar"
        >
          <Text style={styles.actionText}>+</Text>
        </Pressable>

        {/* Botón RESTA */}
        <Pressable
          style={styles.actionButton}
          onPress={() => calculate('resta')}
          accessible={true}
          accessibilityLabel="Restar"
        >
          <Text style={styles.actionText}>−</Text>
        </Pressable>

        {/* Botón MULTIPLICACIÓN */}
        <Pressable
          style={styles.actionButton}
          onPress={() => calculate('multiplica')}
          accessible={true}
          accessibilityLabel="Multiplicar"
        >
          <Text style={styles.actionText}>×</Text>
        </Pressable>

        {/* Botón DIVISIÓN */}
        <Pressable
          style={styles.actionButton}
          onPress={() => calculate('divide')}
          accessible={true}
          accessibilityLabel="Dividir"
        >
          <Text style={styles.actionText}>÷</Text>
        </Pressable>
      </View>

      {/* ===== CAJA DE RESULTADO ===== */
      /**
       * Muestra el resultado de la operación o un mensaje de error
       */
      }
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Resultado</Text>
        <Text style={styles.resultValue}>{result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * label: Etiqueta de la calculadora
   * Texto pequeño que describe la sección
   */
  label: {
    color: '#9db9d3',
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 13,
  },

  /**
   * row: Contenedor flexbox para los inputs
   * Los dos inputs están lado a lado
   */
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  /**
   * input: Campo de entrada de texto
   * - Acepta números (decimal-pad)
   * - Color azul oscuro con borde
   * - Texto blanco para contraste
   */
  input: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f6fbff',
    backgroundColor: '#0d2034',
    borderWidth: 1.5,
    borderColor: 'rgba(110, 179, 255, 0.2)',
    fontSize: 15,
    fontWeight: '600',
  },

  /**
   * buttonGrid: Grid 2x2 para los botones de operación
   * - flexWrap: Los botones se envuelven a la siguiente línea
   * - gap: Espaciado entre botones
   */
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },

  /**
   * actionButton: Botón de operación matemática
   * - 48% de ancho (para grid 2x2)
   * - Color azul principal
   * - Altura fija para que sean cuadrados
   */
  actionButton: {
    width: '48%',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e76ff',
    // Efecto de presión (Android)
    // activeOpacity: 0.8 (iOS)
  },

  /**
   * actionText: Símbolo matemático en el botón
   * - Tamaño grande
   * - Peso 800 (muy negrita)
   * - Color blanco
   */
  actionText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },

  /**
   * resultBox: Caja que muestra el resultado
   * - Fondo oscuro con borde azul
   * - Padding para respiración visual
   */
  resultBox: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#0d2034',
    borderWidth: 1.5,
    borderColor: 'rgba(110, 179, 255, 0.2)',
  },

  /**
   * resultLabel: Etiqueta del resultado
   * - Texto pequeño en gris
   */
  resultLabel: {
    color: '#9db9d3',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 12,
  },

  /**
   * resultValue: Número del resultado
   * - Tamaño grande
   * - Peso 800
   * - Azul claro para destacar
   */
  resultValue: {
    color: '#6fb3ff',
    fontSize: 28,
    fontWeight: '800',
  },
});
