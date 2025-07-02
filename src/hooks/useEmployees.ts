
import { useState, useEffect } from 'react';
import { EmployeeService } from '../services/employeeService';
import { Employee } from '../types/employee';
import { useToast } from './use-toast';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    name: '',
    position: '',
    status: '',
  });
  
  const { toast } = useToast();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await EmployeeService.getEmployees({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      
      setEmployees(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages,
      }));
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os funcionários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  return {
    employees,
    loading,
    pagination,
    filters,
    fetchEmployees,
    handlePageChange,
    handleFilterChange,
  };
};
