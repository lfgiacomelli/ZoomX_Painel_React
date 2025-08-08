import { useAuth } from "@/contexts/useAuth";

export function verificarCargo() {
    const { funcionario } = useAuth();
    
    const cargo = funcionario?.cargo.toLocaleLowerCase();

    return cargo;
}