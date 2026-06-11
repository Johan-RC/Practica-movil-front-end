# Taller navegación móvil — Inventario

## Qué implementa esta app
- 3 botones con `onPress`
- Modal informativo
- Dropdown compatible con Android e iOS
- Calculadora básica con suma, resta, multiplicación y división
- Scroll Loading con `FlatList` y `ActivityIndicator`
- Navegación con:
  - Stack Navigator
  - Bottom Tabs
  - Drawer Layout
- Pantallas mínimas:
  - Home
  - Perfil
  - Configuración
  - Detalle

## Cómo correrlo
1. Instala dependencias
   ```bash
   npm install
   ```
2. Ejecuta Expo
   ```bash
   npx expo start
   ```

## Cómo explicarlo en clase
- `onPress`: dispara acciones cuando el usuario toca un botón.
- `Modal`: muestra una ventana encima de la pantalla actual.
- `Dropdown`: deja elegir una opción de una lista.
- `Calculator`: toma dos números y devuelve el resultado según la operación.
- `FlatList`: renderiza una lista optimizada y permite scroll.
- `ActivityIndicator`: muestra carga cuando se están agregando más elementos.
- `Stack`: mueve entre pantallas en forma de historial.
- `Bottom Tabs`: muestra el menú inferior de navegación.
- `Drawer Layout`: abre un menú lateral con accesos rápidos.

## Dónde mirar el código
- `App.tsx` -> navegación y pantallas
- `src/components/InfoModal.tsx` -> modal
- `src/components/InventoryDropdown.tsx` -> dropdown
- `src/components/InventoryCalculator.tsx` -> calculadora
- `src/components/InventoryScrollLoading.tsx` -> scroll loading
- `src/data/inventory.ts` -> datos del inventario
