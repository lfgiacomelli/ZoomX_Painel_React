import { useAuth } from "@/contexts/useAuth";

export function useCargo() {
    const { funcionario } = useAuth();

    return funcionario?.cargo.toLocaleLowerCase() ?? null;
}