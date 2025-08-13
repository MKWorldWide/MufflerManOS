# MufflerManOS: Node 9305

VR-synced control system for the first PGE mechanics node at **9305 S Orange Blossom Trail**.

## 🚗 Overview

MufflerManOS is a comprehensive diagnostics, employee management, and job optimization system designed specifically for automotive repair shops. This system integrates with the Primal Genesis Engine (PGE) to provide real-time VR-synced operations.

## 🏗️ Architecture

- **Core Engine**: Genesis Engine sync logic and shared utilities
- **Diagnostics Module**: OBD-II fault code lookup and vehicle scanning
- **Assignments Module**: Intelligent job assignment system
- **Employees Module**: GDI-based profile handling for technicians
- **VR Node**: Blueprint data for VR rendering of the shop layout

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize the project structure
npm run init

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## 📊 Monitoring

The server exposes a lightweight metrics endpoint for runtime insights:

```
GET /metrics
```

It reports process uptime, memory usage, and load averages for basic health dashboards or external monitoring agents.

## 📁 Project Structure

```
src/
├── core/           # Genesis Engine sync logic
├── modules/
│   ├── diagnostics/    # Vehicle scanning & OBD-II
│   ├── assignments/    # Job assignment system
│   └── employees/      # Technician profiles
├── vr-node/        # VR blueprint data
└── index.ts        # Main application entry

config/
└── genesis.node.json   # Node configuration

scripts/
└── init-mufflermanos.ts # Project initialization
```

## 🔧 Configuration

The system is configured via `config/genesis.node.json`:

```json
{
  "nodeName": "MufflerManOS_9305",
  "location": "9305 S Orange Blossom Trail",
  "vrEnabled": true,
  "diagnosticsModule": true,
  "technicianProfiles": true,
  "pgeSync": true
}
```

## 🌐 VR Integration

This node is designed to work with VR overlays for real-time shop visualization and technician guidance.

## 📝 Development

- **TypeScript**: Full type safety and modern ES modules
- **Express**: RESTful API endpoints
- **Real-time**: WebSocket support for live updates
- **Modular**: Clean separation of concerns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ by MKWorldWide for the future of automotive diagnostics** 