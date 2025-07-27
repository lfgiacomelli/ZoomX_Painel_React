
import { ApiService } from './api';
import { Employee, CreateEmployeeData, UpdateEmployeeData } from '../types/employee';

export class EmployeeService {
  static async getEmployees(params: {
    page: number;
    limit: number;
    name?: string;
    position?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.name && { name: params.name }),
      ...(params.position && { position: params.position }),
      ...(params.status && { status: params.status }),
    });

    return ApiService.get<{
      data: Employee[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/employees?${queryParams}`);
  }

  static async getEmployeeById(id: string) {
    return ApiService.get<Employee>(`/employees/${id}`);
  }
  static async createEmployee(data: CreateEmployeeData) {
    return ApiService.post<Employee>('/employees', data);
  }

  static async updateEmployee(id: string, data: UpdateEmployeeData) {
    return ApiService.put<Employee>(`/employees/${id}`, data);
  }

  static async deleteEmployee(id: string) {
    return ApiService.delete(`/employees/${id}`);
  }
}
