
export interface ServiceRequest {
  id: string;
  type: 'taxi' | 'delivery';
  userId: string;
  userName: string;
  origin: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  price: number;
  createdAt: string;
  updatedAt: string;
  details?: string;
}

export interface UpdateRequestData {
  status: 'approved' | 'rejected';
  notes?: string;
}
