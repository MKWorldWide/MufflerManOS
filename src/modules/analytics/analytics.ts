/**
 * Analytics Module
 * Comprehensive business intelligence and reporting system
 */

export interface AnalyticsData {
  revenue: RevenueAnalytics;
  operations: OperationsAnalytics;
  customers: CustomerAnalytics;
  inventory: InventoryAnalytics;
  performance: PerformanceAnalytics;
  trends: TrendAnalytics;
  generatedAt: Date;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: Array<{ month: string; revenue: number; growth: number }>;
  revenueByService: Array<{ service: string; revenue: number; percentage: number }>;
  revenueByTechnician: Array<{ technician: string; revenue: number; jobs: number }>;
  averageTicketValue: number;
  profitMargin: number;
  topRevenueDays: Array<{ date: string; revenue: number }>;
}

export interface OperationsAnalytics {
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  averageJobDuration: number;
  jobsByPriority: Array<{ priority: string; count: number; percentage: number }>;
  jobsByStatus: Array<{ status: string; count: number; percentage: number }>;
  bayUtilization: Array<{ bay: string; utilization: number; jobs: number }>;
  equipmentUtilization: Array<{ equipment: string; utilization: number; hours: number }>;
  efficiencyMetrics: {
    jobsPerDay: number;
    averageCompletionTime: number;
    onTimeCompletion: number;
    customerSatisfaction: number;
  };
}

export interface CustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  customerRetention: number;
  averageCustomerValue: number;
  customerLifetimeValue: number;
  topCustomers: Array<{ customer: string; value: number; visits: number }>;
  customerSegments: Array<{ segment: string; count: number; percentage: number }>;
  customerSatisfaction: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Array<{ rating: number; count: number }>;
  };
}

export interface InventoryAnalytics {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  turnoverRate: number;
  topSellingItems: Array<{ item: string; quantity: number; revenue: number }>;
  slowMovingItems: Array<{ item: string; daysInStock: number; quantity: number }>;
  categoryPerformance: Array<{ category: string; revenue: number; items: number }>;
  supplierPerformance: Array<{ supplier: string; items: number; value: number; rating: number }>;
}

export interface PerformanceAnalytics {
  technicianPerformance: Array<{
    technician: string;
    jobsCompleted: number;
    averageRating: number;
    efficiency: number;
    revenue: number;
  }>;
  bayPerformance: Array<{
    bay: string;
    jobsCompleted: number;
    utilization: number;
    revenue: number;
    averageJobTime: number;
  }>;
  equipmentPerformance: Array<{
    equipment: string;
    usageHours: number;
    maintenanceCost: number;
    efficiency: number;
  }>;
  qualityMetrics: {
    reworkRate: number;
    warrantyClaims: number;
    customerComplaints: number;
    firstTimeFixRate: number;
  };
}

export interface TrendAnalytics {
  revenueTrend: Array<{ period: string; revenue: number; growth: number }>;
  customerTrend: Array<{ period: string; customers: number; growth: number }>;
  jobTrend: Array<{ period: string; jobs: number; growth: number }>;
  seasonalPatterns: Array<{ month: string; averageRevenue: number; peak: boolean }>;
  serviceTrends: Array<{ service: string; trend: 'increasing' | 'decreasing' | 'stable'; growth: number }>;
}

export interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  data: AnalyticsData;
  generatedBy: string;
  generatedAt: Date;
  parameters?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge' | 'list';
  title: string;
  dataSource: string;
  configuration: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  widgets: DashboardWidget[];
}

export class AnalyticsModule {
  private reports: Map<string, Report> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private dataCache: Map<string, { data: any; timestamp: Date }> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeSampleDashboards();
  }

  private initializeSampleDashboards() {
    const sampleDashboard: Dashboard = {
      id: 'dashboard-001',
      name: 'Operations Overview',
      description: 'Real-time overview of shop operations and key metrics',
      widgets: [
        {
          id: 'widget-001',
          type: 'metric',
          title: 'Today\'s Revenue',
          dataSource: 'revenue.today',
          configuration: { format: 'currency', color: 'green' },
          position: { x: 0, y: 0, width: 2, height: 1 }
        },
        {
          id: 'widget-002',
          type: 'metric',
          title: 'Active Jobs',
          dataSource: 'operations.activeJobs',
          configuration: { format: 'number', color: 'blue' },
          position: { x: 2, y: 0, width: 2, height: 1 }
        },
        {
          id: 'widget-003',
          type: 'chart',
          title: 'Revenue Trend',
          dataSource: 'revenue.monthly',
          configuration: { chartType: 'line', timeRange: '30d' },
          position: { x: 0, y: 1, width: 4, height: 2 }
        }
      ],
      layout: { columns: 4, rows: 3, widgets: [] },
      isPublic: true,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dashboards.set(sampleDashboard.id, sampleDashboard);
  }

  // Data Generation and Caching
  async generateAnalyticsData(timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<AnalyticsData> {
    const cacheKey = `analytics_${timeRange}`;
    const cached = this.dataCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp.getTime() < this.cacheExpiry) {
      return cached.data;
    }

    const data: AnalyticsData = {
      revenue: await this.generateRevenueAnalytics(timeRange),
      operations: await this.generateOperationsAnalytics(timeRange),
      customers: await this.generateCustomerAnalytics(timeRange),
      inventory: await this.generateInventoryAnalytics(timeRange),
      performance: await this.generatePerformanceAnalytics(timeRange),
      trends: await this.generateTrendAnalytics(timeRange),
      generatedAt: new Date()
    };

    this.dataCache.set(cacheKey, { data, timestamp: new Date() });
    return data;
  }

  private async generateRevenueAnalytics(timeRange: string): Promise<RevenueAnalytics> {
    // Simulate revenue data generation
    const totalRevenue = 45000 + Math.random() * 15000;
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      revenue: 3000 + Math.random() * 2000,
      growth: (Math.random() - 0.5) * 20
    }));

    return {
      totalRevenue,
      monthlyRevenue,
      revenueByService: [
        { service: 'Oil Change', revenue: 12000, percentage: 25 },
        { service: 'Brake Service', revenue: 15000, percentage: 30 },
        { service: 'Diagnostics', revenue: 8000, percentage: 15 },
        { service: 'Tire Service', revenue: 10000, percentage: 20 },
        { service: 'Other', revenue: 5000, percentage: 10 }
      ],
      revenueByTechnician: [
        { technician: 'Mike Johnson', revenue: 18000, jobs: 45 },
        { technician: 'Sarah Chen', revenue: 15000, jobs: 38 },
        { technician: 'Carlos Rodriguez', revenue: 12000, jobs: 32 }
      ],
      averageTicketValue: 125.50,
      profitMargin: 0.35,
      topRevenueDays: [
        { date: '2024-12-15', revenue: 2500 },
        { date: '2024-12-10', revenue: 2300 },
        { date: '2024-12-05', revenue: 2100 }
      ]
    };
  }

  private async generateOperationsAnalytics(timeRange: string): Promise<OperationsAnalytics> {
    return {
      totalJobs: 156,
      completedJobs: 142,
      pendingJobs: 14,
      averageJobDuration: 2.5,
      jobsByPriority: [
        { priority: 'urgent', count: 8, percentage: 5 },
        { priority: 'high', count: 25, percentage: 16 },
        { priority: 'medium', count: 89, percentage: 57 },
        { priority: 'low', count: 34, percentage: 22 }
      ],
      jobsByStatus: [
        { status: 'completed', count: 142, percentage: 91 },
        { status: 'in-progress', count: 8, percentage: 5 },
        { status: 'pending', count: 6, percentage: 4 }
      ],
      bayUtilization: [
        { bay: 'Bay 1', utilization: 85, jobs: 45 },
        { bay: 'Bay 2', utilization: 78, jobs: 38 },
        { bay: 'Bay 3', utilization: 92, jobs: 52 }
      ],
      equipmentUtilization: [
        { equipment: 'Lift 1', utilization: 90, hours: 180 },
        { equipment: 'Scanner', utilization: 65, hours: 130 },
        { equipment: 'Compressor', utilization: 45, hours: 90 }
      ],
      efficiencyMetrics: {
        jobsPerDay: 8.5,
        averageCompletionTime: 2.5,
        onTimeCompletion: 94,
        customerSatisfaction: 4.7
      }
    };
  }

  private async generateCustomerAnalytics(timeRange: string): Promise<CustomerAnalytics> {
    return {
      totalCustomers: 245,
      activeCustomers: 189,
      newCustomers: 23,
      customerRetention: 87,
      averageCustomerValue: 185.50,
      customerLifetimeValue: 1250.00,
      topCustomers: [
        { customer: 'John Smith', value: 2847.50, visits: 8 },
        { customer: 'Sarah Johnson', value: 1245.75, visits: 5 },
        { customer: 'Mike Wilson', value: 987.25, visits: 4 }
      ],
      customerSegments: [
        { segment: 'Gold', count: 45, percentage: 18 },
        { segment: 'Silver', count: 78, percentage: 32 },
        { segment: 'Bronze', count: 122, percentage: 50 }
      ],
      customerSatisfaction: {
        averageRating: 4.7,
        totalReviews: 156,
        ratingDistribution: [
          { rating: 5, count: 89 },
          { rating: 4, count: 45 },
          { rating: 3, count: 15 },
          { rating: 2, count: 5 },
          { rating: 1, count: 2 }
        ]
      }
    };
  }

  private async generateInventoryAnalytics(timeRange: string): Promise<InventoryAnalytics> {
    return {
      totalItems: 156,
      totalValue: 45000,
      lowStockItems: 12,
      outOfStockItems: 3,
      turnoverRate: 4.2,
      topSellingItems: [
        { item: 'Synthetic Oil 5W-30', quantity: 48, revenue: 431.52 },
        { item: 'Oil Filter', quantity: 25, revenue: 324.75 },
        { item: 'Brake Pads', quantity: 18, revenue: 450.00 }
      ],
      slowMovingItems: [
        { item: 'Specialty Tool A', daysInStock: 45, quantity: 2 },
        { item: 'Rare Part B', daysInStock: 38, quantity: 1 }
      ],
      categoryPerformance: [
        { category: 'Consumables', revenue: 15000, items: 45 },
        { category: 'Parts', revenue: 20000, items: 67 },
        { category: 'Tools', revenue: 10000, items: 44 }
      ],
      supplierPerformance: [
        { supplier: 'AutoZone Supply', items: 45, value: 18000, rating: 4.5 },
        { supplier: 'NAPA Auto Parts', items: 38, value: 15000, rating: 4.8 }
      ]
    };
  }

  private async generatePerformanceAnalytics(timeRange: string): Promise<PerformanceAnalytics> {
    return {
      technicianPerformance: [
        {
          technician: 'Mike Johnson',
          jobsCompleted: 45,
          averageRating: 4.8,
          efficiency: 92,
          revenue: 18000
        },
        {
          technician: 'Sarah Chen',
          jobsCompleted: 38,
          averageRating: 4.6,
          efficiency: 88,
          revenue: 15000
        },
        {
          technician: 'Carlos Rodriguez',
          jobsCompleted: 32,
          averageRating: 4.9,
          efficiency: 95,
          revenue: 12000
        }
      ],
      bayPerformance: [
        {
          bay: 'Bay 1',
          jobsCompleted: 45,
          utilization: 85,
          revenue: 18000,
          averageJobTime: 2.3
        },
        {
          bay: 'Bay 2',
          jobsCompleted: 38,
          utilization: 78,
          revenue: 15000,
          averageJobTime: 2.7
        },
        {
          bay: 'Bay 3',
          jobsCompleted: 52,
          utilization: 92,
          revenue: 12000,
          averageJobTime: 2.1
        }
      ],
      equipmentPerformance: [
        {
          equipment: 'Lift 1',
          usageHours: 180,
          maintenanceCost: 500,
          efficiency: 90
        },
        {
          equipment: 'Scanner',
          usageHours: 130,
          maintenanceCost: 200,
          efficiency: 85
        }
      ],
      qualityMetrics: {
        reworkRate: 2.5,
        warrantyClaims: 1.8,
        customerComplaints: 0.5,
        firstTimeFixRate: 97.5
      }
    };
  }

  private async generateTrendAnalytics(timeRange: string): Promise<TrendAnalytics> {
    return {
      revenueTrend: Array.from({ length: 12 }, (_, i) => ({
        period: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        revenue: 3000 + Math.random() * 2000,
        growth: (Math.random() - 0.5) * 20
      })),
      customerTrend: Array.from({ length: 12 }, (_, i) => ({
        period: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        customers: 20 + Math.random() * 10,
        growth: (Math.random() - 0.5) * 15
      })),
      jobTrend: Array.from({ length: 12 }, (_, i) => ({
        period: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
        jobs: 150 + Math.random() * 50,
        growth: (Math.random() - 0.5) * 12
      })),
      seasonalPatterns: [
        { month: 'Jan', averageRevenue: 3500, peak: false },
        { month: 'Feb', averageRevenue: 3200, peak: false },
        { month: 'Mar', averageRevenue: 3800, peak: false },
        { month: 'Apr', averageRevenue: 4200, peak: true },
        { month: 'May', averageRevenue: 4500, peak: true },
        { month: 'Jun', averageRevenue: 4800, peak: true },
        { month: 'Jul', averageRevenue: 4600, peak: true },
        { month: 'Aug', averageRevenue: 4400, peak: true },
        { month: 'Sep', averageRevenue: 4000, peak: false },
        { month: 'Oct', averageRevenue: 3800, peak: false },
        { month: 'Nov', averageRevenue: 3600, peak: false },
        { month: 'Dec', averageRevenue: 3400, peak: false }
      ],
      serviceTrends: [
        { service: 'Oil Change', trend: 'stable', growth: 2.5 },
        { service: 'Brake Service', trend: 'increasing', growth: 8.2 },
        { service: 'Diagnostics', trend: 'increasing', growth: 12.1 },
        { service: 'Tire Service', trend: 'decreasing', growth: -3.4 }
      ]
    };
  }

  // Report Management
  async generateReport(name: string, type: Report['type'], timeRange: string, generatedBy: string): Promise<Report> {
    const data = await this.generateAnalyticsData(timeRange as any);
    
    const report: Report = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      data,
      generatedBy,
      generatedAt: new Date()
    };

    this.reports.set(report.id, report);
    console.log(`📊 Generated report: ${name}`);
    return report;
  }

  async getReport(id: string): Promise<Report | null> {
    return this.reports.get(id) || null;
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  // Dashboard Management
  async getDashboard(id: string): Promise<Dashboard | null> {
    return this.dashboards.get(id) || null;
  }

  async getAllDashboards(): Promise<Dashboard[]> {
    return Array.from(this.dashboards.values());
  }

  async createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dashboards.set(newDashboard.id, newDashboard);
    console.log(`📈 Created dashboard: ${newDashboard.name}`);
    return newDashboard;
  }

  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<void> {
    const dashboard = this.dashboards.get(id);
    if (dashboard) {
      const updatedDashboard = { ...dashboard, ...updates, updatedAt: new Date() };
      this.dashboards.set(id, updatedDashboard);
      console.log(`📝 Updated dashboard: ${dashboard.name}`);
    }
  }

  // Real-time Analytics
  async getRealTimeMetrics(): Promise<{
    currentJobs: number;
    availableBays: number;
    todayRevenue: number;
    todayJobs: number;
    activeTechnicians: number;
    queueLength: number;
  }> {
    return {
      currentJobs: 8,
      availableBays: 1,
      todayRevenue: 1250.75,
      todayJobs: 12,
      activeTechnicians: 3,
      queueLength: 4
    };
  }

  // Export and Sharing
  async exportReport(reportId: string, format: 'pdf' | 'csv' | 'json'): Promise<string> {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filename = `${report.name}_${report.generatedAt.toISOString().split('T')[0]}.${format}`;
    console.log(`📤 Exported report: ${filename}`);
    
    return filename;
  }

  // Alerts and Notifications
  async checkAlerts(): Promise<Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: Date;
  }>> {
    const alerts = [];

    // Check for low stock items
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'warning',
        message: '5 items are running low on stock',
        severity: 'medium',
        timestamp: new Date()
      });
    }

    // Check for equipment issues
    if (Math.random() > 0.8) {
      alerts.push({
        type: 'error',
        message: 'Lift 2 requires maintenance',
        severity: 'high',
        timestamp: new Date()
      });
    }

    return alerts;
  }
} 