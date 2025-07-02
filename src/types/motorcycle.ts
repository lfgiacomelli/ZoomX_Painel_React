
export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance';
  employeeId?: string;
  employeeName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMotorcycleData {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance';
  employeeId?: string;
}

export interface UpdateMotorcycleData extends Partial<CreateMotorcycleData> {}
