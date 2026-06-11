/**
 * ============================================
 * COMPONENTE: InventoryScrollLoading
 * ============================================
 * 
 * Lista de inventario con:
 * - ScrollView para renderización dentro de SectionCard
 * - ActivityIndicator para mostrar carga
 * - Scroll vertical
 * - Compatible iOS/Android
 * 
 * NOTA: Usa ScrollView (no FlatList) porque está anidada
 * en un ScrollView padre. FlatList solo se debe usar en
 * pantallas completas o con orientación diferente.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** Interfaz para los items del inventario */
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price?: number;
  location?: string;
}

interface InventoryScrollLoadingProps {
  /** Array de items a mostrar en la lista */
  items: InventoryItem[];
}

/**
 * InventoryScrollLoading: Lista con scroll y loading
 *
 * ¿Por qué ScrollView y no FlatList?
 * - Esta lista está dentro de un SectionCard con ScrollView padre
 * - FlatList anidado en ScrollView causa problemas de rendimiento
 * - La lista es pequeña (<20 items típicamente)
 * - ScrollView es perfecta para esta situación
 *
 * ¿Cuándo usar FlatList en su lugar?
 * - Listas en pantalla completa (sin ScrollView padre)
 * - Listas muy largas (100+ elementos)
 * - Cuando necesitas máximo rendimiento
 */
export function InventoryScrollLoading({ items }: InventoryScrollLoadingProps) {
  // ===== ESTADO LOCAL =====
  /**
   * isLoading: Simula una carga de datos
   * - Al cargar el componente, mostramos indicador
   * - Después de 1.5 segundos, ocultamos indicador
   * 
   * En una app real, esto vendría de una petición a un servidor
   */
  const [isLoading, setIsLoading] = useState(true);

  // ===== EFECTOS =====
  /**
   * useEffect: Simula la carga de datos
   *
   * En este caso:
   * - Esperamos 1.5 segundos (simular red)
   * - Luego ocultamos el indicador
   *
   * En una app real:
   * - Harías fetch a un servidor
   * - En el .then(), setIsLoading(false)
   */
  useEffect(() => {
    // Simular latencia de red
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Limpiar el timer si el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  // ===== RENDERIZACIÓN CONDICIONAL =====
  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* ActivityIndicator: Animación giratoria */}
        <ActivityIndicator size="large" color="#6fb3ff" />
        <Text style={styles.loadingText}>Cargando inventario...</Text>
      </View>
    );
  }

  // Si no hay items, mostrar mensaje vacío
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-outline" size={48} color="#9db9d3" />
        <Text style={styles.emptyText}>No hay productos</Text>
        <Text style={styles.emptySubtext}>
          Selecciona otra categoría para ver items
        </Text>
      </View>
    );
  }

  // ===== RENDERIZACIÓN NORMAL: SCROLLVIEW =====
  /**
   * Nota: No usamos FlatList aquí porque está dentro
   * de un ScrollView padre. Esto causaría:
   * - VirtualizedLists should never be nested...
   * 
   * ScrollView aquí es la opción correcta para lista pequeña
   */
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.headerText}>
        Mostrando {items.length} producto{items.length !== 1 ? 's' : ''}
      </Text>

      {/* ScrollView: Lista con scroll */}
      <ScrollView
        nestedScrollEnabled={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* Pie de página */}
      <View style={styles.footer}>
        <Ionicons name="checkmark-circle" size={16} color="#2e76ff" />
        <Text style={styles.footerText}>Carga completada</Text>
      </View>
    </View>
  );
}

/**
 * ItemCard: Componente para renderizar cada item
 *
 * Se renderiza una vez por cada item en la lista
 * Esto separa la lógica del item de la lista principal
 */
interface ItemCardProps {
  item: InventoryItem;
}

function ItemCard({ item }: ItemCardProps) {
  const priceLabel =
    typeof item.price === 'number'
      ? new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0,
        }).format(item.price)
      : null;

  return (
    <View style={styles.itemCard}>
      {/* Fila superior: Nombre + Stock */}
      <View style={styles.itemHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>

        {/* Badge de stock */}
        <View
          style={[
            styles.stockBadge,
            item.stock > 10
              ? styles.stockHigh
              : item.stock > 0
                ? styles.stockMedium
                : styles.stockLow,
          ]}
        >
          <Text style={styles.stockText}>{item.stock}</Text>
        </View>
      </View>

      {/* Bloque extra para que el scroll tenga contenido más rico */}
      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Ubicación</Text>
          <Text style={styles.metaValue}>{item.location ?? 'Sin ubicación'}</Text>
        </View>

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Disponibilidad</Text>
          <Text style={styles.metaValue}>
            {item.stock} unidad{item.stock !== 1 ? 'es' : ''}
          </Text>
        </View>
      </View>

      {/* Fila inferior: Información adicional */}
      <View style={styles.itemFooter}>
        <Text style={styles.itemInfo}>
          Stock actual: <Text style={{ fontWeight: '700' }}>{item.stock}</Text>
        </Text>
        {priceLabel && <Text style={styles.itemPrice}>{priceLabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ===== CONTENEDOR PRINCIPAL =====
  /**
   * container: Wrapper principal del componente
   * - Máximo de altura para que no ocupe toda la pantalla
   * - Se usa dentro de un ScrollView padre
   */
  container: {
    height: 360,
    backgroundColor: '#08111e',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },

  // ===== ENCABEZADO =====
  /**
   * headerText: Texto que muestra la cantidad de items
   * Cambiar dinámicamente según los items
   */
  headerText: {
    color: '#9db9d3',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110, 179, 255, 0.1)',
  },

  // ===== SCROLLVIEW =====
  /**
   * scrollView: El contenedor ScrollView
   * Esto es importante para que el scroll sea correcto
   */
  scrollView: {
    flexGrow: 0,
    maxHeight: 290,
  },

  scrollContent: {
    paddingBottom: 6,
  },

  // ===== ESTADO DE CARGA =====
  /**
   * loadingContainer: Mostrado mientras se cargan los datos
   * Centrado y con ActivityIndicator
   */
  loadingContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  /**
   * loadingText: Texto bajo el ActivityIndicator
   */
  loadingText: {
    color: '#9db9d3',
    fontSize: 14,
    fontWeight: '600',
  },

  // ===== ESTADO VACÍO =====
  /**
   * emptyContainer: Mostrado cuando no hay items
   * Icono + mensaje + submensaje
   */
  emptyContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },

  /**
   * emptyText: Título cuando la lista está vacía
   */
  emptyText: {
    color: '#f6fbff',
    fontSize: 16,
    fontWeight: '700',
  },

  /**
   * emptySubtext: Descripción cuando la lista está vacía
   */
  emptySubtext: {
    color: '#9db9d3',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },

  // ===== CARD DEL ITEM =====
  /**
   * itemCard: Tarjeta para cada item de la lista
   * - Borde sutil
   * - Padding para respiración
   * - Separador entre items
   */
  itemCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(110, 179, 255, 0.08)',
  },

  /**
   * itemHeader: Fila superior del item
   * Nombre + Stock lado a lado
   */
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },

  /**
   * itemName: Nombre del producto
   * Texto principal grande
   */
  itemName: {
    color: '#f6fbff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  /**
   * itemCategory: Categoría del producto
   * Texto pequeño en gris
   */
  itemCategory: {
    color: '#9db9d3',
    fontSize: 12,
    fontWeight: '500',
  },

  metaGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },

  metaItem: {
    flex: 1,
    backgroundColor: 'rgba(13, 32, 52, 0.9)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.08)',
  },

  metaLabel: {
    color: '#9db9d3',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },

  metaValue: {
    color: '#f6fbff',
    fontSize: 12,
    fontWeight: '700',
  },

  /**
   * stockBadge: Badge que muestra el stock
   * Cambiar color según la cantidad
   */
  stockBadge: {
    minWidth: 48,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  /**
   * Stock alto (> 10): Verde
   */
  stockHigh: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },

  /**
   * Stock medio (1-10): Amarillo
   */
  stockMedium: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },

  /**
   * Stock bajo (0): Rojo
   */
  stockLow: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },

  /**
   * stockText: Número del stock
   * Texto grande y visible
   */
  stockText: {
    color: '#f6fbff',
    fontSize: 18,
    fontWeight: '800',
  },

  /**
   * itemFooter: Fila inferior del item
   * Información adicional (precio, etc)
   */
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /**
   * itemInfo: Información del item
   * "Disponible: X unidades"
   */
  itemInfo: {
    color: '#9db9d3',
    fontSize: 12,
    fontWeight: '500',
  },

  /**
   * itemPrice: Precio del item
   * Mostrarlo a la derecha
   */
  itemPrice: {
    color: '#2e76ff',
    fontSize: 14,
    fontWeight: '700',
  },

  // ===== PIE DE PÁGINA =====
  /**
   * footer: Pie de página cuando la carga termina
   */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(110, 179, 255, 0.1)',
  },

  /**
   * footerText: Texto del pie de página
   */
  footerText: {
    color: '#9db9d3',
    fontSize: 12,
    fontWeight: '600',
  },
});
