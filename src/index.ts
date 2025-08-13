#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { GenesisEngine } from './core/genesis-engine.js';
import { DiagnosticsModule } from './modules/diagnostics/diagnostics.js';
import { AssignmentsModule } from './modules/assignments/assignments.js';
import { EmployeesModule } from './modules/employees/employees.js';
import { InventoryModule } from './modules/inventory/inventory.js';
import { CustomersModule } from './modules/customers/customers.js';
import { AnalyticsModule } from './modules/analytics/analytics.js';
import { VRNode } from './vr-node/vr-blueprint.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

class MufflerManOS {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private genesisEngine: GenesisEngine;
  private diagnosticsModule: DiagnosticsModule;
  private assignmentsModule: AssignmentsModule;
  private employeesModule: EmployeesModule;
  private inventoryModule: InventoryModule;
  private customersModule: CustomersModule;
  private analyticsModule: AnalyticsModule;
  private vrNode: VRNode;
  private config: any;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    this.initializeMiddleware();
    this.loadConfiguration();
    this.initializeModules();
    this.setupRoutes();
    this.setupWebSockets();
  }

  private async loadConfiguration() {
    try {
      const configPath = path.join(__dirname, '..', 'config', 'genesis.node.json');
      this.config = await fs.readJson(configPath);
      console.log('📋 Loaded configuration:', this.config.nodeName);
    } catch (error) {
      console.error('❌ Failed to load configuration:', error);
      process.exit(1);
    }
  }

  private initializeMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
  }

  private initializeModules() {
    // Initialize Genesis Engine
    this.genesisEngine = new GenesisEngine(this.config);
    
    // Initialize modules
    this.diagnosticsModule = new DiagnosticsModule();
    this.assignmentsModule = new AssignmentsModule();
    this.employeesModule = new EmployeesModule();
    this.inventoryModule = new InventoryModule();
    this.customersModule = new CustomersModule();
    this.analyticsModule = new AnalyticsModule();
    
    // Initialize VR Node with default shop layout
    const defaultLayout = {
      id: 'shop-9305',
      name: 'MufflerMan Shop - 9305',
      dimensions: { width: 100, length: 150, height: 20 },
      bays: [
        { id: 'bay-1', number: 1, position: { x: 10, y: 10, z: 0 }, status: 'available' },
        { id: 'bay-2', number: 2, position: { x: 30, y: 10, z: 0 }, status: 'available' },
        { id: 'bay-3', number: 3, position: { x: 50, y: 10, z: 0 }, status: 'available' }
      ],
      equipment: [
        { id: 'lift-1', name: '2-Post Lift', type: 'lift', position: { x: 10, y: 15, z: 0 }, status: 'operational' },
        { id: 'scanner-1', name: 'OBD-II Scanner', type: 'scanner', position: { x: 5, y: 5, z: 0 }, status: 'operational' }
      ],
      zones: [
        { id: 'zone-1', name: 'Reception', type: 'reception', position: { x: 0, y: 0, z: 0 }, dimensions: { width: 20, length: 15, height: 10 }, capacity: 10, currentOccupancy: 2 },
        { id: 'zone-2', name: 'Waiting Area', type: 'waiting', position: { x: 25, y: 0, z: 0 }, dimensions: { width: 25, length: 20, height: 10 }, capacity: 15, currentOccupancy: 5 }
      ],
      metadata: {
        address: '9305 S Orange Blossom Trail, Orlando, FL 32839',
        phone: '(407) 555-0123',
        hours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '10:00', close: '16:00' }
        },
        timezone: 'America/New_York',
        vrVersion: '1.0.0',
        lastSync: new Date()
      }
    };
    
    this.vrNode = new VRNode(defaultLayout);
    
    console.log('🔧 All modules initialized');
  }

  private setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        node: this.config.nodeName,
        location: this.config.location,
        timestamp: new Date().toISOString()
      });
    });

    // Runtime metrics for observability
    this.app.get('/metrics', (_req, res) => {
      const { rss, heapTotal, heapUsed, external } = process.memoryUsage();
      res.json({
        uptime: process.uptime(), // seconds since process start
        memory: { rss, heapTotal, heapUsed, external }, // basic memory footprint
        load: os.loadavg() // 1, 5 and 15 minute load averages
      });
    });

    // Genesis Engine routes
    this.app.get('/api/genesis/status', async (req, res) => {
      try {
        const nodeInfo = this.genesisEngine.getNodeInfo();
        res.json(nodeInfo);
      } catch (error) {
        res.status(500).json({ error: 'Failed to get node status' });
      }
    });

    this.app.post('/api/genesis/sync', async (req, res) => {
      try {
        await this.genesisEngine.sync();
        res.json({ message: 'Sync completed successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Sync failed' });
      }
    });

    // Diagnostics routes
    this.app.post('/api/diagnostics/scan', async (req, res) => {
      try {
        const { vin } = req.body;
        if (!vin) {
          return res.status(400).json({ error: 'VIN is required' });
        }
        
        const scan = await this.diagnosticsModule.scanVehicle(vin);
        res.json(scan);
      } catch (error) {
        res.status(500).json({ error: 'Vehicle scan failed' });
      }
    });

    this.app.get('/api/diagnostics/fault-code/:code', async (req, res) => {
      try {
        const { code } = req.params;
        const faultCode = await this.diagnosticsModule.lookupFaultCode(code);
        
        if (!faultCode) {
          return res.status(404).json({ error: 'Fault code not found' });
        }
        
        res.json(faultCode);
      } catch (error) {
        res.status(500).json({ error: 'Fault code lookup failed' });
      }
    });

    // Assignments routes
    this.app.get('/api/assignments/queue', async (req, res) => {
      try {
        const queue = await this.assignmentsModule.getJobQueue();
        res.json(queue);
      } catch (error) {
        res.status(500).json({ error: 'Failed to get job queue' });
      }
    });

    this.app.post('/api/assignments/assign', async (req, res) => {
      try {
        const { jobId, technicianId } = req.body;
        // Implementation would need job lookup logic
        res.json({ message: 'Job assigned successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Job assignment failed' });
      }
    });

    // VR Node routes
    this.app.get('/api/vr/layout', (req, res) => {
      try {
        const layout = this.vrNode.getLayout();
        res.json(layout);
      } catch (error) {
        res.status(500).json({ error: 'Failed to get VR layout' });
      }
    });

    this.app.put('/api/vr/bay/:bayId/status', (req, res) => {
      try {
        const { bayId } = req.params;
        const { status } = req.body;
        
        this.vrNode.updateBayStatus(bayId, status);
        res.json({ message: 'Bay status updated' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update bay status' });
      }
    });

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        name: 'MufflerManOS',
        version: this.config.version,
        location: this.config.location,
        description: 'VR-synced control system for PGE mechanics node',
        endpoints: {
          health: '/health',
          metrics: '/metrics',
          genesis: '/api/genesis',
          diagnostics: '/api/diagnostics',
          assignments: '/api/assignments',
          inventory: '/api/inventory',
          customers: '/api/customers',
          analytics: '/api/analytics',
          vr: '/api/vr'
        }
      });
    });
  }

  private setupWebSockets() {
    this.io.on('connection', (socket) => {
      console.log('🔌 Client connected:', socket.id);

      // Join room for real-time updates
      socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`👥 Client ${socket.id} joined room: ${room}`);
      });

      // Handle VR position updates
      socket.on('vr-position-update', (data) => {
        this.io.to('vr-updates').emit('vr-position-updated', data);
      });

      // Handle job status updates
      socket.on('job-status-update', (data) => {
        this.io.to('job-updates').emit('job-status-updated', data);
      });

      // Handle inventory updates
      socket.on('inventory-update', (data) => {
        this.io.to('inventory-updates').emit('inventory-updated', data);
      });

      socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
      });
    });

    // Broadcast real-time updates
    setInterval(async () => {
      try {
        const realTimeMetrics = await this.analyticsModule.getRealTimeMetrics();
        this.io.emit('real-time-metrics', realTimeMetrics);
      } catch (error) {
        console.error('Error broadcasting real-time metrics:', error);
      }
    }, 5000); // Update every 5 seconds
  }

  public start() {
    const port = this.config.network?.port || 3000;
    const host = this.config.network?.host || 'localhost';

    this.server.listen(port, host, () => {
      console.log('🚗 MufflerManOS started successfully!');
      console.log(`📍 Location: ${this.config.location}`);
      console.log(`🌐 Server: http://${host}:${port}`);
      console.log(`🔌 WebSocket: ws://${host}:${port}`);
      console.log(`🔧 Node: ${this.config.nodeName}`);
      console.log(`🥽 VR Enabled: ${this.config.vrEnabled}`);
      console.log('🐾 Ready for PGE sync and VR overlay...');
    });
  }
}

// Start the application
const mufflerManOS = new MufflerManOS();
mufflerManOS.start(); 