export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  location: string;
};

export const inventorySeed: InventoryItem[] = [
  { id: '1', name: 'Laptop Pro 14', category: 'Tecnología', stock: 12, price: 3250000, location: 'Bodega A' },
  { id: '2', name: 'Mouse Inalámbrico', category: 'Accesorios', stock: 40, price: 65000, location: 'Estante 2' },
  { id: '3', name: 'Teclado Mecánico', category: 'Accesorios', stock: 18, price: 180000, location: 'Estante 2' },
  { id: '4', name: 'Archivador Metálico', category: 'Oficina', stock: 7, price: 230000, location: 'Bodega B' },
  { id: '5', name: 'Resma Carta', category: 'Papelería', stock: 120, price: 16500, location: 'Estante 5' },
  { id: '6', name: 'Monitor 24"', category: 'Tecnología', stock: 9, price: 720000, location: 'Bodega A' },
  { id: '7', name: 'Silla Ergonómica', category: 'Oficina', stock: 11, price: 540000, location: 'Área ventas' },
  { id: '8', name: 'Tóner Negro', category: 'Papelería', stock: 21, price: 89000, location: 'Bodega C' },
  { id: '9', name: 'Cargador USB-C', category: 'Accesorios', stock: 27, price: 72000, location: 'Estante 1' },
  { id: '10', name: 'Tablet 10"', category: 'Tecnología', stock: 5, price: 1190000, location: 'Bodega A' },
  { id: '11', name: 'Porta documentos', category: 'Oficina', stock: 33, price: 28000, location: 'Estante 3' },
  { id: '12', name: 'Marcadores x12', category: 'Papelería', stock: 60, price: 24000, location: 'Estante 4' },
  { id: '13', name: 'Audífonos Bluetooth', category: 'Accesorios', stock: 14, price: 145000, location: 'Bodega A' },
  { id: '14', name: 'Caja archivo', category: 'Oficina', stock: 25, price: 19500, location: 'Estante 5' },
  { id: '15', name: 'Papel adhesivo', category: 'Papelería', stock: 45, price: 35000, location: 'Bodega C' },
];

export const categoryOptions = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Tecnología', label: 'Tecnología' },
  { value: 'Accesorios', label: 'Accesorios' },
  { value: 'Oficina', label: 'Oficina' },
  { value: 'Papelería', label: 'Papelería' },
];

export const calculatorHints = [
  'Suma',
  'Resta',
  'Multiplicación',
  'División',
] as const;
