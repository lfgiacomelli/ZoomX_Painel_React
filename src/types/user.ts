
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'banned' | 'inactive';
  createdAt: string;
  updatedAt: string;
  totalRides: number;
  totalDeliveries: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'banned' | 'inactive';
}

export interface UpdateUserData extends Partial<CreateUserData> {}
