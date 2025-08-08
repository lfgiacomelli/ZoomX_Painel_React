import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export default function MessageNotManager() {
  return (
    <Alert variant="destructive" className="w-full mt-4">
      <ShieldAlert className="h-5 w-5" />
      <div>
        <AlertTitle>Acesso limitado</AlertTitle>
        <AlertDescription>
            Você não possui permissão para realizar todas as ações no painel, pois seu cargo não atende aos requisitos de acesso.
        </AlertDescription>
      </div>
    </Alert>
  );
}
