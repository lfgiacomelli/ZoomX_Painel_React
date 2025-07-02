
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'active' | 'inactive';
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {}
