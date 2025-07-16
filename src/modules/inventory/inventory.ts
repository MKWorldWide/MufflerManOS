/**
 * Inventory Module
 * Comprehensive parts and tools management system
 */

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'part' | 'tool' | 'consumable' | 'equipment';
  subcategory: string;
  manufacturer: string;
  partNumber?: string;
  description: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  unitPrice: number;
  location: string;
  binLocation?: string;
  supplier: string;
  supplierPartNumber?: string;
  lastRestocked: Date;
  nextRestockDate?: Date;
  isActive: boolean;
  tags: string[];
  specifications?: Record<string, any>;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'return' | 'damage';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  technicianId?: string;
  jobId?: string;
  notes?: string;
  timestamp: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  paymentTerms: string;
  leadTime: number; // days
  minimumOrder: number;
  isActive: boolean;
  rating: number;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: 'draft' | 'sent' | 'confirmed' | 'shipped' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  orderDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdBy: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
}

export class InventoryModule {
  private items: Map<string, InventoryItem> = new Map();
  private transactions: Map<string, InventoryTransaction> = new Map();
  private suppliers: Map<string, Supplier> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample inventory items
    const sampleItems: InventoryItem[] = [
      {
        id: 'item-001',
        sku: 'OIL-5W30-1QT',
        name: 'Synthetic Oil 5W-30',
        category: 'consumable',
        subcategory: 'lubricants',
        manufacturer: 'Mobil',
        partNumber: 'M1-110A',
        description: 'High-performance synthetic motor oil',
        quantity: 48,
        minQuantity: 10,
        maxQuantity: 100,
        unit: 'quart',
        unitPrice: 8.99,
        location: 'Warehouse A',
        binLocation: 'A1-B2-C3',
        supplier: 'AutoZone Supply',
        lastRestocked: new Date('2024-12-01'),
        nextRestockDate: new Date('2024-12-20'),
        isActive: true,
        tags: ['oil', 'synthetic', '5w30'],
        specifications: {
          viscosity: '5W-30',
          apiRating: 'SN Plus',
          capacity: '1 quart'
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'item-002',
        sku: 'FILT-OIL-001',
        name: 'Oil Filter',
        category: 'part',
        subcategory: 'filters',
        manufacturer: 'Fram',
        partNumber: 'PH2870A',
        description: 'High-capacity oil filter for most vehicles',
        quantity: 25,
        minQuantity: 5,
        maxQuantity: 50,
        unit: 'each',
        unitPrice: 12.99,
        location: 'Warehouse A',
        binLocation: 'A2-B1-C4',
        supplier: 'NAPA Auto Parts',
        lastRestocked: new Date('2024-12-05'),
        isActive: true,
        tags: ['filter', 'oil', 'maintenance'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'item-003',
        sku: 'TOOL-SCANNER-001',
        name: 'OBD-II Scanner',
        category: 'tool',
        subcategory: 'diagnostic',
        manufacturer: 'Innova',
        partNumber: '3100j',
        description: 'Professional OBD-II diagnostic scanner',
        quantity: 3,
        minQuantity: 1,
        maxQuantity: 5,
        unit: 'each',
        unitPrice: 299.99,
        location: 'Tool Room',
        binLocation: 'T1-A1',
        supplier: 'Tool Supply Co',
        lastRestocked: new Date('2024-11-15'),
        isActive: true,
        tags: ['scanner', 'obd2', 'diagnostic'],
        specifications: {
          compatibility: 'OBD-II',
          display: 'Color LCD',
          connectivity: 'USB/WiFi'
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ];

    // Sample suppliers
    const sampleSuppliers: Supplier[] = [
      {
        id: 'supplier-001',
        name: 'AutoZone Supply',
        contactPerson: 'John Smith',
        email: 'john.smith@autozone.com',
        phone: '(555) 123-4567',
        address: '123 Auto Parts Blvd, Orlando, FL 32801',
        website: 'https://www.autozone.com',
        paymentTerms: 'Net 30',
        leadTime: 3,
        minimumOrder: 100,
        isActive: true,
        rating: 4.5
      },
      {
        id: 'supplier-002',
        name: 'NAPA Auto Parts',
        contactPerson: 'Sarah Johnson',
        email: 'sarah.johnson@napa.com',
        phone: '(555) 987-6543',
        address: '456 Parts Street, Orlando, FL 32802',
        website: 'https://www.napaonline.com',
        paymentTerms: 'Net 15',
        leadTime: 2,
        minimumOrder: 50,
        isActive: true,
        rating: 4.8
      }
    ];

    sampleItems.forEach(item => this.items.set(item.id, item));
    sampleSuppliers.forEach(supplier => this.suppliers.set(supplier.id, supplier));
  }

  // Item Management
  async getItem(id: string): Promise<InventoryItem | null> {
    return this.items.get(id) || null;
  }

  async getAllItems(): Promise<InventoryItem[]> {
    return Array.from(this.items.values());
  }

  async getItemsByCategory(category: InventoryItem['category']): Promise<InventoryItem[]> {
    return Array.from(this.items.values()).filter(item => item.category === category);
  }

  async getLowStockItems(): Promise<InventoryItem[]> {
    return Array.from(this.items.values()).filter(item => item.quantity <= item.minQuantity);
  }

  async addItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.items.set(newItem.id, newItem);
    console.log(`➕ Added inventory item: ${newItem.name}`);
    return newItem;
  }

  async updateItem(id: string, updates: Partial<InventoryItem>): Promise<void> {
    const item = this.items.get(id);
    if (item) {
      const updatedItem = { ...item, ...updates, updatedAt: new Date() };
      this.items.set(id, updatedItem);
      console.log(`📝 Updated inventory item: ${item.name}`);
    }
  }

  // Transaction Management
  async addTransaction(transaction: Omit<InventoryTransaction, 'id' | 'timestamp'>): Promise<InventoryTransaction> {
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // Update item quantity
    const item = this.items.get(transaction.itemId);
    if (item) {
      item.quantity = transaction.newQuantity;
      item.updatedAt = new Date();
      this.items.set(transaction.itemId, item);
    }

    this.transactions.set(newTransaction.id, newTransaction);
    console.log(`📊 Added transaction: ${newTransaction.type} ${newTransaction.quantity} ${item?.name}`);
    return newTransaction;
  }

  async getItemTransactions(itemId: string): Promise<InventoryTransaction[]> {
    return Array.from(this.transactions.values())
      .filter(txn => txn.itemId === itemId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Stock Operations
  async checkOutItem(itemId: string, quantity: number, technicianId: string, jobId?: string, notes?: string): Promise<void> {
    const item = this.items.get(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    if (item.quantity < quantity) {
      throw new Error(`Insufficient stock for ${item.name}. Available: ${item.quantity}, Requested: ${quantity}`);
    }

    const previousQuantity = item.quantity;
    const newQuantity = item.quantity - quantity;

    await this.addTransaction({
      itemId,
      type: 'out',
      quantity,
      previousQuantity,
      newQuantity,
      reason: 'Technician checkout',
      technicianId,
      jobId,
      notes
    });
  }

  async returnItem(itemId: string, quantity: number, technicianId: string, notes?: string): Promise<void> {
    const item = this.items.get(itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    const previousQuantity = item.quantity;
    const newQuantity = item.quantity + quantity;

    await this.addTransaction({
      itemId,
      type: 'return',
      quantity,
      previousQuantity,
      newQuantity,
      reason: 'Technician return',
      technicianId,
      notes
    });
  }

  // Supplier Management
  async getSupplier(id: string): Promise<Supplier | null> {
    return this.suppliers.get(id) || null;
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async addSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    const newSupplier: Supplier = {
      ...supplier,
      id: `supplier-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.suppliers.set(newSupplier.id, newSupplier);
    console.log(`➕ Added supplier: ${newSupplier.name}`);
    return newSupplier;
  }

  // Purchase Order Management
  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'orderDate'>): Promise<PurchaseOrder> {
    const newOrder: PurchaseOrder = {
      ...order,
      id: `po-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderDate: new Date()
    };

    this.purchaseOrders.set(newOrder.id, newOrder);
    console.log(`📋 Created purchase order: ${newOrder.id}`);
    return newOrder;
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | null> {
    return this.purchaseOrders.get(id) || null;
  }

  async updatePurchaseOrderStatus(id: string, status: PurchaseOrder['status']): Promise<void> {
    const order = this.purchaseOrders.get(id);
    if (order) {
      order.status = status;
      if (status === 'received') {
        order.actualDelivery = new Date();
      }
      this.purchaseOrders.set(id, order);
      console.log(`📋 Updated PO ${id} status to: ${status}`);
    }
  }

  // Analytics and Reporting
  async getInventoryValue(): Promise<{
    totalValue: number;
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
  }> {
    const items = Array.from(this.items.values());
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.minQuantity).length;
    const outOfStockItems = items.filter(item => item.quantity === 0).length;

    return {
      totalValue,
      totalItems: items.length,
      lowStockItems,
      outOfStockItems
    };
  }

  async getTopSellingItems(limit: number = 10): Promise<Array<{
    item: InventoryItem;
    totalQuantity: number;
    totalValue: number;
  }>> {
    const transactions = Array.from(this.transactions.values());
    const itemStats = new Map<string, { quantity: number; value: number }>();

    transactions.forEach(txn => {
      if (txn.type === 'out') {
        const item = this.items.get(txn.itemId);
        if (item) {
          const current = itemStats.get(txn.itemId) || { quantity: 0, value: 0 };
          current.quantity += txn.quantity;
          current.value += txn.quantity * item.unitPrice;
          itemStats.set(txn.itemId, current);
        }
      }
    });

    return Array.from(itemStats.entries())
      .map(([itemId, stats]) => ({
        item: this.items.get(itemId)!,
        totalQuantity: stats.quantity,
        totalValue: stats.value
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }

  async getRestockRecommendations(): Promise<Array<{
    item: InventoryItem;
    recommendedQuantity: number;
    estimatedCost: number;
  }>> {
    const lowStockItems = await this.getLowStockItems();
    
    return lowStockItems.map(item => {
      const recommendedQuantity = item.maxQuantity - item.quantity;
      const estimatedCost = recommendedQuantity * item.unitPrice;
      
      return {
        item,
        recommendedQuantity,
        estimatedCost
      };
    });
  }
} 