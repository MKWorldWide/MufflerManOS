/**
 * VR Node Blueprint
 * Shop layout and VR rendering data
 */

export interface ShopLayout {
  id: string;
  name: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  bays: Bay[];
  equipment: Equipment[];
}

export interface Bay {
  id: string;
  number: number;
  position: { x: number; y: number; z: number };
  currentVehicle?: string;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Equipment {
  id: string;
  name: string;
  type: 'lift' | 'scanner' | 'toolbox' | 'computer';
  position: { x: number; y: number; z: number };
  status: 'operational' | 'maintenance' | 'offline';
}

export class VRNode {
  private layout: ShopLayout;

  constructor(layout: ShopLayout) {
    this.layout = layout;
  }

  getLayout(): ShopLayout {
    return this.layout;
  }

  updateBayStatus(bayId: string, status: Bay['status']): void {
    const bay = this.layout.bays.find(b => b.id === bayId);
    if (bay) {
      bay.status = status;
    }
  }
}
