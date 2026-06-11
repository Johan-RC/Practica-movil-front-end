/**
 * ============================================
 * APLICACIÓN MÓVIL DE INVENTARIO - REACT NATIVE
 * ============================================
 * 
 * Este archivo es el punto de entrada principal de la aplicación.
 * Implementa:
 * - DrawerLayout: Menú hamburguesa lateral (contiene Configuración)
 * - Bottom Tab Navigation: Navegación inferior (Inventario y Perfil)
 * - Stack Navigation: Pantallas de detalle
 * 
 * Estructura:
 * App -> GestureHandlerRootView
 *     -> SafeAreaProvider
 *         -> DrawerLayout (Menú hamburguesa)
 *             -> NavigationContainer
 *                 -> Stack.Navigator (Main Tabs + Detail)
 *                     -> Tabs.Navigator (Home + Profile)
 */

// ===== IMPORTACIONES =====
import 'react-native-gesture-handler'; // IMPORTANTE: debe estar al inicio

import React, { useMemo, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importar componentes personalizados
import { InfoModal } from '@/src/components/InfoModal';
import { InventoryCalculator } from '@/src/components/InventoryCalculator';
import { InventoryDropdown } from '@/src/components/InventoryDropdown';
import { InventoryScrollLoading } from '@/src/components/InventoryScrollLoading';
import { SectionCard } from '@/src/components/SectionCard';
import { categoryOptions, inventorySeed } from '@/src/data/inventory';

// ===== TIPOS DE NAVEGACIÓN =====
/** Define qué parámetros puede recibir cada pantalla del Stack Navigator */
type RootStackParamList = {
  MainTabs: undefined;
  Detail: { productName?: string } | undefined;
};

/** Define qué pantallas están en el Bottom Tab Navigator */
type TabsParamList = {
  Home: undefined;      // Pantalla de Inventario
  Profile: undefined;   // Pantalla de Perfil
};

// ===== CREACIÓN DE NAVEGADORES =====
/** Stack Navigator: maneja la navegación entre MainTabs y Detail */
const Stack = createNativeStackNavigator<RootStackParamList>();

/** Bottom Tab Navigator: maneja la navegación entre Home y Profile */
const Tabs = createBottomTabNavigator<TabsParamList>();

// ===== COMPONENTE PRINCIPAL =====
/**
 * App: Componente raíz de la aplicación
 * 
 * Estructura:
 * 1. GestureHandlerRootView: Necesario para react-native-gesture-handler
 * 2. SafeAreaProvider: Respeta márgenes de pantallas con notch
 * 3. DrawerLayout: Menú lateral (hamburguesa)
 * 4. NavigationContainer: Contenedor de toda la navegación
 */
function App() {
  const drawerRef = useRef<DrawerLayout | null>(null);
  const windowDimensions = useWindowDimensions();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <DrawerLayout
          ref={drawerRef}
          drawerWidth={Math.min(290, windowDimensions.width * 0.75)} // Responsive
          drawerPosition="left"
          renderNavigationView={() => <DrawerMenu drawerRef={drawerRef} />}
        >
          <NavigationContainer>
            {/* Barra de estado con texto claro */}
            <StatusBar barStyle="light-content" backgroundColor="#08111e" />
            
            {/* Stack Navigator: maneja MainTabs y Detail */}
            <Stack.Navigator
              initialRouteName="MainTabs"
              screenOptions={{
                headerStyle: { backgroundColor: '#08111e' },
                headerTintColor: '#f6fbff',
                contentStyle: { backgroundColor: '#08111e' },
              }}
            >
              {/* MainTabs: Las pestañas inferiores */}
              <Stack.Screen
                name="MainTabs"
                component={TabsNavigator}
                options={{ headerShown: false }}
              />

              {/* Detail: Pantalla de detalles del producto */}
              <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{ title: 'Detalle de producto' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DrawerLayout>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ===== MENÚ LATERAL (DRAWER) =====
/**
 * DrawerMenu: Menú hamburguesa lateral
 * 
 * Contiene:
 * - Título del menú
 * - Botón de Configuración (que estaba en las tabs)
 * - Información descriptiva
 * - Botón para cerrar el drawer
 */
interface DrawerMenuProps {
  drawerRef: React.RefObject<DrawerLayout | null>;
}

function DrawerMenu({ drawerRef }: DrawerMenuProps) {
  return (
    <View style={styles.drawer}>
      {/* Encabezado del drawer */}
      <Text style={styles.drawerTitle}>Menú</Text>
      
      {/* Descripción */}
      <Text style={styles.drawerText}>
        Este menú lateral contiene acciones adicionales y configuración de la aplicación.
      </Text>

      {/* Botón para ir a Configuración */}
      <Pressable
        style={styles.drawerButton}
        onPress={() => {
          drawerRef.current?.closeDrawer();
          // El usuario puede navegar a configuración desde aquí si lo desea
        }}
      >
        <Ionicons name="settings-outline" size={20} color="#2e76ff" />
        <Text style={styles.drawerButtonText}>Configuración</Text>
      </Pressable>

      {/* Botón para cerrar el drawer */}
      <Pressable
        style={[styles.drawerButton, styles.drawerClose]}
        onPress={() => drawerRef.current?.closeDrawer()}
      >
        <Ionicons name="close-outline" size={20} color="#fff" />
        <Text style={styles.drawerButtonText}>Cerrar menú</Text>
      </Pressable>
    </View>
  );
}

// ===== NAVEGADOR DE TABS INFERIORES =====
/**
 * TabsNavigator: Bottom Tab Navigation
 * 
 * Muestra dos pestañas en la parte inferior:
 * 1. Inventario (Home)
 * 2. Perfil (Profile)
 * 
 * La Configuración ahora está en el Drawer lateral
 */
function TabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        // Estilos del header
        headerStyle: { backgroundColor: '#08111e' },
        headerTintColor: '#f6fbff',

        // Estilos de las tabs
        tabBarStyle: {
          backgroundColor: '#0d1b2a',
          borderTopColor: 'rgba(110, 179, 255, 0.16)',
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },

        // Colores de texto activo e inactivo
        tabBarActiveTintColor: '#6fb3ff',
        tabBarInactiveTintColor: '#8aa6bf',

        // Iconos para cada tab
        tabBarIcon: ({ color, size }) => {
          // Definir qué icono mostrar según la ruta
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // Etiquetas de las tabs
        tabBarLabel: ({ color }) => {
          const label = route.name === 'Home' ? 'Inventario' : 'Perfil';
          return <Text style={{ color, fontWeight: '600', fontSize: 12 }}>{label}</Text>;
        },
      })}
    >
      {/* Tab 1: Home - Inventario */}
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inventario' }}
      />

      {/* Tab 2: Profile - Perfil */}
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tabs.Navigator>
  );
}

// ===== PANTALLA PRINCIPAL: HOME (INVENTARIO) =====
/**
 * HomeScreen: Pantalla principal con todos los componentes del taller
 * 
 * Contiene:
 * 1. Botones (onPress events)
 * 2. Modal/Dialog
 * 3. Dropdown/Picker compatible iOS/Android
 * 4. Calculadora básica
 * 5. Scroll Loading con FlatList/ScrollView
 * 6. Resumen de datos
 */
function HomeScreen({ navigation }: any) {
  const drawerRef = useRef<DrawerLayout>(null);
  const insets = useSafeAreaInsets();

  // ===== ESTADO LOCAL =====
  /** Control de visibilidad del modal */
  const [noticeVisible, setNoticeVisible] = useState(false);

  /** Título dinámico que cambia al presionar un botón */
  const [headline, setHeadline] = useState('Panel de inventario');

  /** Categoría seleccionada en el dropdown */
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // ===== CÁLCULOS MEMOIZADOS =====
  /**
   * filteredItems: Filtra los productos según la categoría seleccionada
   * Se recalcula solo cuando selectedCategory cambia (optimización)
   */
  const filteredItems = useMemo(
    () =>
      inventorySeed.filter((item) => {
        if (selectedCategory === 'Todas') {
          return true;
        }
        return item.category === selectedCategory;
      }),
    [selectedCategory]
  );

  /** Cantidad total de productos después del filtro */
  const totalProducts = filteredItems.length;

  /** Stock total sumado de todos los productos filtrados */
  const totalStock = filteredItems.reduce((sum, item) => sum + item.stock, 0);

  // ===== FUNCIONES DE NAVEGACIÓN =====
  /**
   * openDetail: Navega a la pantalla Detail
   * Usa el Stack Navigator para ir a otra pantalla
   */
  const openDetail = () => {
    navigation.getParent?.()?.navigate('Detail', {
      productName: filteredItems[0]?.name ?? 'Inventario',
    });
  };

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={290}
      renderNavigationView={() => <DrawerMenu drawerRef={drawerRef} />}
    >
      <View style={[styles.screen, { paddingBottom: insets.bottom + 16 }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== BARRA SUPERIOR CON MENÚ HAMBURGUESA ===== */}
          <View style={styles.topBar}>
            <View style={styles.titleSection}>
              <Text style={styles.brand}>Inventario móvil</Text>
              <Text style={styles.subtitle}>{headline}</Text>
            </View>

            {/* Botón de menú hamburguesa para abrir el drawer */}
            <Pressable
              style={styles.menuButton}
              onPress={() => drawerRef.current?.openDrawer()}
              accessible={true}
              accessibilityLabel="Abrir menú"
            >
              <Ionicons name="menu-outline" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* ===== SECCIÓN 1: BOTONES ===== */
          /**
           * Demuestra cómo usar onPress en botones
           * Los botones pueden:
           * - Cambiar estado (setHeadline)
           * - Abrir modales (setNoticeVisible)
           * - Navegar (navigation.navigate)
           */
          }
          <SectionCard
            title="Botones"
            subtitle="Tres acciones visibles para la evidencia del taller."
          >
            <View style={styles.buttonRow}>
              {/* Botón 1: Abre Modal */}
              <Pressable
                style={styles.primaryButton}
                onPress={() => setNoticeVisible(true)}
              >
                <Text style={styles.primaryButtonText}>Abrir modal</Text>
              </Pressable>

              {/* Botón 2: Cambia Texto */}
              <Pressable
                style={styles.secondaryButton}
                onPress={() =>
                  setHeadline((current) =>
                    current === 'Panel de inventario'
                      ? 'Inventario listo para revisar'
                      : 'Panel de inventario'
                  )
                }
              >
                <Text style={styles.secondaryButtonText}>Cambiar texto</Text>
              </Pressable>

              {/* Botón 3: Navega a Detalle */}
              <Pressable
                style={styles.ghostButton}
                onPress={openDetail}
              >
                <Text style={styles.ghostButtonText}>Ir a detalle</Text>
              </Pressable>
            </View>

            {/* Explicación de cómo funcionan los botones */}
            <Text style={styles.helpText}>
              💡 <Text style={{ fontWeight: '700' }}>onPress</Text> dispara la acción del botón.
              Aquí cambiamos texto, abrimos modales y navegamos a otras pantallas.
            </Text>
          </SectionCard>

          {/* ===== SECCIÓN 2: MODAL/DIALOG ===== */
          /**
           * El Modal es una ventana que aparece sobre el contenido actual
           * Se puede abrir y cerrar mediante botones
           * Perfecto para confirmar acciones o mostrar mensajes
           */
          }
          <SectionCard
            title="Modal"
            subtitle="Ventana emergente con cierre manual."
          >
            <Pressable
              style={styles.inlineButton}
              onPress={() => setNoticeVisible(true)}
            >
              <Text style={styles.inlineButtonText}>Mostrar aviso</Text>
            </Pressable>

            <Text style={styles.helpText}>
              💡 El modal aparece sobre la pantalla actual. Se controla con estado (visible={'{noticeVisible}'}).
              Se cierra presionando el botón interno.
            </Text>
          </SectionCard>

          {/* ===== SECCIÓN 3: DROPDOWN/PICKER ===== */
          /**
           * El Dropdown permite seleccionar una opción de una lista
           * Compatible con Android e iOS
           * Es responsive y no depende de librerías externas complejas
           */
          }
          <SectionCard
            title="Dropdown"
            subtitle="Selector compatible con Android e iOS."
          >
            <InventoryDropdown
              label="Categoría de inventario"
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />

            <Text style={styles.helpText}>
              💡 Selección actual: <Text style={{ fontWeight: '700' }}>{selectedCategory}</Text>.
              Funciona en ambas plataformas sin dependencias extras.
            </Text>
          </SectionCard>

          {/* ===== SECCIÓN 4: CALCULADORA ===== */
          /**
           * Calculadora básica que demuestra:
           * - TextInput para entrada de números
           * - Lógica de cálculo matemático
           * - Validación de datos
           * - Actualización dinámica de resultados
           */
          }
          <SectionCard
            title="Calculadora"
            subtitle="Suma, resta, multiplicación y división."
          >
            <InventoryCalculator />
            <Text style={styles.helpText}>
              💡 La calculadora valida que los números sean válidos y muestra errores si intentas dividir entre 0.
            </Text>
          </SectionCard>

          {/* ===== SECCIÓN 5: RESUMEN DE DATOS ===== */
          /**
           * Muestra estadísticas calculadas con useMemo
           * Se actualiza automáticamente cuando cambia el filtro
           */
          }
          <SectionCard
            title="Resumen"
            subtitle="Datos calculados a partir del filtro seleccionado."
          >
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{totalProducts}</Text>
                <Text style={styles.statLabel}>Productos</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{totalStock}</Text>
                <Text style={styles.statLabel}>Unidades</Text>
              </View>
            </View>

            <Text style={styles.helpText}>
              💡 Estos valores se actualizan en tiempo real cuando cambias la categoría.
            </Text>
          </SectionCard>

          {/* ===== SECCIÓN 6: SCROLL LOADING ===== */
          /**
           * Demuestra FlatList con:
           * - Scroll vertical
           * - Indicador de carga (ActivityIndicator)
           * - Renderización eficiente de listas largas
           */
          }
          <SectionCard
            title="Scroll Loading"
            subtitle="Lista con carga progresiva e indicador."
          >
            <InventoryScrollLoading items={filteredItems} />
            <Text style={styles.helpText}>
              💡 Desliza la lista para ver cómo se renderiza. FlatList es más eficiente que ScrollView
              para listas largas.
            </Text>
          </SectionCard>
        </ScrollView>

        {/* ===== MODAL GLOBAL ===== */
        /**
         * El modal se renderiza al final para aparecer sobre todo el contenido
         */
        }
        <InfoModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
        />
      </View>
    </DrawerLayout>
  );
}

// ===== PANTALLA: PERFIL =====
/**
 * ProfileScreen: Pantalla del perfil del usuario
 * 
 * Aquí puedes mostrar información del usuario, configuración de perfil, etc.
 */
function ProfileScreen() {
  return (
    <View style={styles.centerScreen}>
      <Ionicons name="person-circle" size={80} color="#6fb3ff" style={{ marginBottom: 20 }} />

      <Text style={styles.pageTitle}>Perfil</Text>

      <View style={styles.profileCard}>
        <Text style={styles.profileLabel}>Usuario:</Text>
        <Text style={styles.profileValue}>Aprendiz Técnico</Text>

        <Text style={[styles.profileLabel, { marginTop: 16 }]}>
          Email:
        </Text>
        <Text style={styles.profileValue}>usuario@ejemplo.com</Text>

        <Text style={[styles.profileLabel, { marginTop: 16 }]}>
          Rol:
        </Text>
        <Text style={styles.profileValue}>Administrador de Inventario</Text>
      </View>

      <Text style={styles.pageText}>
        El Bottom Tab Navigator permite cambiar entre secciones sin cerrar la aplicación. Esta es
        una buena forma de organizar múltiples pantallas principales.
      </Text>
    </View>
  );
}

// ===== PANTALLA: DETALLE =====
/**
 * DetailScreen: Pantalla de detalles del producto
 * 
 * Accesible desde el Stack Navigator
 * Recibe parámetros (productName) desde la navegación
 */
function DetailScreen({ route }: any) {
  const productName = route.params?.productName ?? 'Producto';

  return (
    <View style={styles.centerScreen}>
      <Ionicons name="cube" size={80} color="#2e76ff" style={{ marginBottom: 20 }} />

      <Text style={styles.pageTitle}>Detalles</Text>

      <View style={styles.detailCard}>
        <Text style={styles.detailLabel}>Producto seleccionado</Text>
        <Text style={styles.detailValue}>{productName}</Text>

        <Text style={[styles.detailLabel, { marginTop: 16 }]}>
          Descripción
        </Text>
        <Text style={[styles.pageText, { marginTop: 8 }]}>
          Esta pantalla se abre mediante el Stack Navigator. Puedes ver cómo se pasan parámetros
          entre pantallas usando{' '}
          <Text style={{ fontWeight: '700' }}>route.params</Text>.
        </Text>
      </View>

      <Text style={[styles.pageText, { marginTop: 20 }]}>
        Presiona el botón "Atrás" en el header para regresar a la pantalla anterior.
      </Text>
    </View>
  );
}

// ===== ESTILOS =====
/**
 * Estilos de toda la aplicación
 * 
 * Paleta de colores:
 * - Fondo oscuro: #08111e
 * - Azul principal: #2e76ff
 * - Gris de texto: #9db9d3
 * - Blanco: #f6fbff
 */
const styles = StyleSheet.create({
  // ===== CONTENEDOR RAÍZ =====
  root: {
    flex: 1,
    backgroundColor: '#08111e',
  },

  // ===== PANTALLA PRINCIPAL =====
  screen: {
    flex: 1,
    backgroundColor: '#08111e',
  },

  // ===== CONTENEDOR DE SCROLL =====
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    gap: 0,
  },

  // ===== BARRA SUPERIOR =====
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  titleSection: {
    flex: 1,
  },

  brand: {
    color: '#f6fbff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  subtitle: {
    color: '#9db9d3',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },

  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#12263d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.18)',
    marginLeft: 12,
  },

  // ===== BOTONES =====
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },

  primaryButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#2e76ff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },

  secondaryButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#133554',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#d8eef6',
    fontWeight: '700',
    fontSize: 13,
  },

  ghostButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#0d2034',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.18)',
  },

  ghostButtonText: {
    color: '#8fc0ff',
    fontWeight: '700',
    fontSize: 13,
  },

  inlineButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#2e76ff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 12,
  },

  inlineButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },

  // ===== TEXTO DE AYUDA =====
  helpText: {
    color: '#9db9d3',
    lineHeight: 22,
    fontSize: 13,
    marginTop: 12,
  },

  // ===== ESTADÍSTICAS =====
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statBox: {
    flex: 1,
    backgroundColor: '#0d2034',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.15)',
  },

  statValue: {
    color: '#6fb3ff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },

  statLabel: {
    color: '#9db9d3',
    fontWeight: '600',
    fontSize: 12,
  },

  // ===== PANTALLAS CENTRADAS =====
  centerScreen: {
    flex: 1,
    backgroundColor: '#08111e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  pageTitle: {
    color: '#f6fbff',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
  },

  pageText: {
    color: '#9db9d3',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
    fontSize: 14,
  },

  // ===== TARJETA DE PERFIL =====
  profileCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#11243a',
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.15)',
    marginVertical: 16,
  },

  profileLabel: {
    color: '#9db9d3',
    fontWeight: '600',
    fontSize: 12,
  },

  profileValue: {
    color: '#f6fbff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  // ===== TARJETA DE DETALLE =====
  detailCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#11243a',
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.15)',
  },

  detailLabel: {
    color: '#9db9d3',
    fontWeight: '600',
    fontSize: 12,
  },

  detailValue: {
    color: '#6fb3ff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },

  // ===== DRAWER (MENÚ LATERAL) =====
  drawer: {
    flex: 1,
    backgroundColor: '#0b1726',
    padding: 20,
    paddingTop: 32,
  },

  drawerTitle: {
    color: '#f6fbff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
  },

  drawerText: {
    color: '#9db9d3',
    lineHeight: 20,
    marginBottom: 24,
    fontSize: 14,
  },

  drawerButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#12263d',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(110, 179, 255, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  drawerClose: {
    backgroundColor: '#2e76ff',
    marginTop: 16,
  },

  drawerButtonText: {
    color: '#fff',
    fontWeight: '800',
    flex: 1,
    fontSize: 14,
  },
});

export default App;
