import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Box, LinearProgress } from "@mui/material";
import ToastMessage from "./ToastMessage";

type EmployeeWithoutMotorcycle = {
    fun_codigo: number;
    fun_nome: string;
};

export default function EmployeesWithoutMotorcycles() {

    const [loading, setLoading] = useState(true);
    const [employeesWithoutMotorcycles, setEmployeesWithoutMotorcycles] = useState<EmployeeWithoutMotorcycle[]>([]);
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
    }>({
        visible: false,
        message: "",
        status: "INFO",
    });

    const BASE_URL = 'https://backend-turma-a-2025.onrender.com';

    useEffect(() => {
        fetchEmployeesWithoutMotorcycles();
    }, []);

    async function fetchEmployeesWithoutMotorcycles() {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/admin/funcionarios/listar-sem-moto`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao buscar funcionários sem moto');
            }

            const data = await response.json();
            setEmployeesWithoutMotorcycles(data.funcionarios);
        } catch (error) {
            setToast({
                visible: true,
                message: error.message || 'Erro ao buscar funcionários sem moto',
                status: 'ERROR',
            });
        } finally {
            setLoading(false);
        }
    }

    if (employeesWithoutMotorcycles.length === 0) {
        return null; 
    }

    return (
        <div>
            {toast.visible && <ToastMessage message={toast.message} status={toast.status} />}
            
            <Card className="zoomx-card w-full mt-10">
                <CardHeader>
                    <CardTitle className="font-righteous">Mototaxistas sem Motocicleta</CardTitle>
                    <CardDescription>Confira a lista de mototaxistas sem motocicletas cadastradas. Eles não ficarão disponíveis para novas solicitações até regularizarem a situação.</CardDescription>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress color="warning" />
                        </Box>
                    ) : (
                        <div>
                            {employeesWithoutMotorcycles.length > 0 ? (
                                <ul className="space-y-2">
                                    {employeesWithoutMotorcycles.map(employee => (
                                        <li
                                            key={employee.fun_codigo}
                                            className="flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white hover:bg-gray-50 border border-gray-200"
                                        >
                                            <div className="flex flex-col">
                                                <p className="text-sm text-gray-700">
                                                    <strong>ID:</strong> {employee.fun_codigo}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    <strong>Nome:</strong> {employee.fun_nome}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                {/* Ícone ou badge opcional */}
                                                <span className="ml-2 p-1 bg-gray-200 rounded-full">⚠️</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Nenhum mototaxista encontrado sem motocicleta cadastrada.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
