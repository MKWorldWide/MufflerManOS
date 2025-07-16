/**
 * Customers Module
 * Comprehensive customer and vehicle management system
 */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: Address;
  dateOfBirth?: Date;
  emergencyContact?: EmergencyContact;
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  totalSpent: number;
  firstVisit: Date;
  lastVisit?: Date;
  isActive: boolean;
  notes?: string;
  preferences: CustomerPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface CustomerPreferences {
  preferredContactMethod: 'email' | 'phone' | 'sms';
  marketingOptIn: boolean;
  serviceReminders: boolean;
  appointmentReminders: boolean;
  preferredTechnician?: string;
  specialInstructions?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  state: string;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'automatic' | 'manual' | 'cvt';
  engineSize?: string;
  trim?: string;
  isPrimary: boolean;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  isActive: boolean;
  notes?: string;
  specifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRecord {
  id: string;
  customerId: string;
  vehicleId: string;
  jobId: string;
  serviceDate: Date;
  mileage: number;
  serviceType: string;
  description: string;
  technicianId: string;
  partsUsed: ServicePart[];
  laborHours: number;
  laborRate: number;
  partsTotal: number;
  laborTotal: number;
  tax: number;
  totalAmount: number;
  warranty?: WarrantyInfo;
  recommendations: string[];
  customerNotes?: string;
  technicianNotes?: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  createdAt: Date;
}

export interface ServicePart {
  itemId: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  warranty?: string;
}

export interface WarrantyInfo {
  type: 'parts' | 'labor' | 'both';
  duration: number; // months
  expiryDate: Date;
  terms: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  serviceType: string;
  description: string;
  scheduledDate: Date;
  estimatedDuration: number; // minutes
  technicianId?: string;
  bayId?: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerNotes?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomersModule {
  private customers: Map<string, Customer> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private serviceRecords: Map<string, ServiceRecord> = new Map();
  private appointments: Map<string, Appointment> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample customers
    const sampleCustomers: Customer[] = [
      {
        id: 'cust-001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(407) 555-0101',
        address: {
          street: '123 Main Street',
          city: 'Orlando',
          state: 'FL',
          zipCode: '32801',
          country: 'USA'
        },
        membershipLevel: 'gold',
        loyaltyPoints: 1250,
        totalSpent: 2847.50,
        firstVisit: new Date('2023-01-15'),
        lastVisit: new Date('2024-12-10'),
        isActive: true,
        preferences: {
          preferredContactMethod: 'email',
          marketingOptIn: true,
          serviceReminders: true,
          appointmentReminders: true,
          preferredTechnician: 'tech-001'
        },
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'cust-002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(407) 555-0102',
        address: {
          street: '456 Oak Avenue',
          city: 'Orlando',
          state: 'FL',
          zipCode: '32802',
          country: 'USA'
        },
        membershipLevel: 'silver',
        loyaltyPoints: 750,
        totalSpent: 1245.75,
        firstVisit: new Date('2023-06-20'),
        lastVisit: new Date('2024-11-28'),
        isActive: true,
        preferences: {
          preferredContactMethod: 'phone',
          marketingOptIn: false,
          serviceReminders: true,
          appointmentReminders: true
        },
        createdAt: new Date('2023-06-20'),
        updatedAt: new Date()
      }
    ];

    // Sample vehicles
    const sampleVehicles: Vehicle[] = [
      {
        id: 'veh-001',
        customerId: 'cust-001',
        vin: '1HGBH41JXMN109186',
        make: 'Honda',
        model: 'Civic',
        year: 2020,
        color: 'Blue',
        licensePlate: 'ABC123',
        state: 'FL',
        mileage: 45000,
        fuelType: 'gasoline',
        transmission: 'automatic',
        engineSize: '2.0L',
        trim: 'EX',
        isPrimary: true,
        purchaseDate: new Date('2020-03-15'),
        lastServiceDate: new Date('2024-12-10'),
        nextServiceDate: new Date('2025-03-10'),
        isActive: true,
        createdAt: new Date('2020-03-15'),
        updatedAt: new Date()
      },
      {
        id: 'veh-002',
        customerId: 'cust-002',
        vin: '5NPE34AF4FH012345',
        make: 'Hyundai',
        model: 'Sonata',
        year: 2019,
        color: 'Silver',
        licensePlate: 'XYZ789',
        state: 'FL',
        mileage: 62000,
        fuelType: 'gasoline',
        transmission: 'automatic',
        engineSize: '2.5L',
        trim: 'Limited',
        isPrimary: true,
        purchaseDate: new Date('2019-08-10'),
        lastServiceDate: new Date('2024-11-28'),
        nextServiceDate: new Date('2025-02-28'),
        isActive: true,
        createdAt: new Date('2019-08-10'),
        updatedAt: new Date()
      }
    ];

    // Sample service records
    const sampleServiceRecords: ServiceRecord[] = [
      {
        id: 'sr-001',
        customerId: 'cust-001',
        vehicleId: 'veh-001',
        jobId: 'job-001',
        serviceDate: new Date('2024-12-10'),
        mileage: 45000,
        serviceType: 'Oil Change & Inspection',
        description: 'Synthetic oil change, filter replacement, and comprehensive inspection',
        technicianId: 'tech-001',
        partsUsed: [
          {
            itemId: 'item-001',
            name: 'Synthetic Oil 5W-30',
            partNumber: 'M1-110A',
            quantity: 4,
            unitPrice: 8.99,
            totalPrice: 35.96
          },
          {
            itemId: 'item-002',
            name: 'Oil Filter',
            partNumber: 'PH2870A',
            quantity: 1,
            unitPrice: 12.99,
            totalPrice: 12.99
          }
        ],
        laborHours: 1.5,
        laborRate: 85.00,
        partsTotal: 48.95,
        laborTotal: 127.50,
        tax: 12.34,
        totalAmount: 188.79,
        recommendations: [
          'Brake pads showing wear - recommend replacement in 5,000 miles',
          'Tire rotation needed at next service'
        ],
        status: 'completed',
        createdAt: new Date('2024-12-10')
      }
    ];

    sampleCustomers.forEach(customer => this.customers.set(customer.id, customer));
    sampleVehicles.forEach(vehicle => this.vehicles.set(vehicle.id, vehicle));
    sampleServiceRecords.forEach(record => this.serviceRecords.set(record.id, record));
  }

  // Customer Management
  async getCustomer(id: string): Promise<Customer | null> {
    return this.customers.get(id) || null;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getActiveCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(customer => customer.isActive);
  }

  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.customers.set(newCustomer.id, newCustomer);
    console.log(`➕ Added customer: ${newCustomer.firstName} ${newCustomer.lastName}`);
    return newCustomer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    const customer = this.customers.get(id);
    if (customer) {
      const updatedCustomer = { ...customer, ...updates, updatedAt: new Date() };
      this.customers.set(id, updatedCustomer);
      console.log(`📝 Updated customer: ${customer.firstName} ${customer.lastName}`);
    }
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.customers.values()).filter(customer =>
      customer.firstName.toLowerCase().includes(searchTerm) ||
      customer.lastName.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm)
    );
  }

  // Vehicle Management
  async getVehicle(id: string): Promise<Vehicle | null> {
    return this.vehicles.get(id) || null;
  }

  async getCustomerVehicles(customerId: string): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(vehicle => vehicle.customerId === customerId);
  }

  async addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.vehicles.set(newVehicle.id, newVehicle);
    console.log(`🚗 Added vehicle: ${newVehicle.year} ${newVehicle.make} ${newVehicle.model}`);
    return newVehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<void> {
    const vehicle = this.vehicles.get(id);
    if (vehicle) {
      const updatedVehicle = { ...vehicle, ...updates, updatedAt: new Date() };
      this.vehicles.set(id, updatedVehicle);
      console.log(`📝 Updated vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    }
  }

  async getVehicleByVIN(vin: string): Promise<Vehicle | null> {
    return Array.from(this.vehicles.values()).find(vehicle => vehicle.vin === vin) || null;
  }

  // Service Records
  async getServiceRecord(id: string): Promise<ServiceRecord | null> {
    return this.serviceRecords.get(id) || null;
  }

  async getVehicleServiceHistory(vehicleId: string): Promise<ServiceRecord[]> {
    return Array.from(this.serviceRecords.values())
      .filter(record => record.vehicleId === vehicleId)
      .sort((a, b) => b.serviceDate.getTime() - a.serviceDate.getTime());
  }

  async getCustomerServiceHistory(customerId: string): Promise<ServiceRecord[]> {
    return Array.from(this.serviceRecords.values())
      .filter(record => record.customerId === customerId)
      .sort((a, b) => b.serviceDate.getTime() - a.serviceDate.getTime());
  }

  async addServiceRecord(record: Omit<ServiceRecord, 'id' | 'createdAt'>): Promise<ServiceRecord> {
    const newRecord: ServiceRecord = {
      ...record,
      id: `sr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    this.serviceRecords.set(newRecord.id, newRecord);
    
    // Update vehicle mileage and last service date
    const vehicle = this.vehicles.get(record.vehicleId);
    if (vehicle) {
      vehicle.mileage = record.mileage;
      vehicle.lastServiceDate = record.serviceDate;
      vehicle.updatedAt = new Date();
      this.vehicles.set(vehicle.id, vehicle);
    }

    // Update customer total spent and last visit
    const customer = this.customers.get(record.customerId);
    if (customer) {
      customer.totalSpent += record.totalAmount;
      customer.lastVisit = record.serviceDate;
      customer.updatedAt = new Date();
      this.customers.set(customer.id, customer);
    }

    console.log(`🔧 Added service record: ${record.serviceType} for ${record.totalAmount}`);
    return newRecord;
  }

  // Appointments
  async getAppointment(id: string): Promise<Appointment | null> {
    return this.appointments.get(id) || null;
  }

  async getCustomerAppointments(customerId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.customerId === customerId)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  async getUpcomingAppointments(): Promise<Appointment[]> {
    const now = new Date();
    return Array.from(this.appointments.values())
      .filter(appointment => 
        appointment.scheduledDate > now && 
        ['scheduled', 'confirmed'].includes(appointment.status)
      )
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  async addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.appointments.set(newAppointment.id, newAppointment);
    console.log(`📅 Added appointment: ${newAppointment.serviceType} for ${newAppointment.scheduledDate}`);
    return newAppointment;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      appointment.status = status;
      appointment.updatedAt = new Date();
      this.appointments.set(id, appointment);
      console.log(`📅 Updated appointment ${id} status to: ${status}`);
    }
  }

  // Analytics and Reporting
  async getCustomerAnalytics(customerId: string): Promise<{
    totalSpent: number;
    totalServices: number;
    averageServiceCost: number;
    lastVisit: Date | null;
    loyaltyPoints: number;
    membershipLevel: string;
    vehicles: Vehicle[];
    recentServices: ServiceRecord[];
  }> {
    const customer = this.customers.get(customerId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }

    const services = await this.getCustomerServiceHistory(customerId);
    const vehicles = await this.getCustomerVehicles(customerId);
    const averageServiceCost = services.length > 0 
      ? services.reduce((sum, service) => sum + service.totalAmount, 0) / services.length 
      : 0;

    return {
      totalSpent: customer.totalSpent,
      totalServices: services.length,
      averageServiceCost,
      lastVisit: customer.lastVisit || null,
      loyaltyPoints: customer.loyaltyPoints,
      membershipLevel: customer.membershipLevel,
      vehicles,
      recentServices: services.slice(0, 5)
    };
  }

  async getTopCustomers(limit: number = 10): Promise<Array<{
    customer: Customer;
    totalSpent: number;
    totalServices: number;
  }>> {
    const customers = Array.from(this.customers.values());
    
    return customers
      .map(customer => ({
        customer,
        totalSpent: customer.totalSpent,
        totalServices: Array.from(this.serviceRecords.values())
          .filter(record => record.customerId === customer.id).length
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  async getServiceRevenueByMonth(year: number): Promise<Array<{
    month: number;
    revenue: number;
    services: number;
  }>> {
    const services = Array.from(this.serviceRecords.values())
      .filter(record => record.serviceDate.getFullYear() === year);

    const monthlyData = new Map<number, { revenue: number; services: number }>();

    services.forEach(service => {
      const month = service.serviceDate.getMonth();
      const current = monthlyData.get(month) || { revenue: 0, services: 0 };
      current.revenue += service.totalAmount;
      current.services += 1;
      monthlyData.set(month, current);
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        services: data.services
      }))
      .sort((a, b) => a.month - b.month);
  }
} 