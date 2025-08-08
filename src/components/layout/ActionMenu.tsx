import { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EllipsisVertical, Upload, Image, Loader2, Route } from "lucide-react";
import example from '@/assets/example_cnh.png';
import ToastMessage from "./ToastMessage";

import { useNavigate } from "react-router-dom";
import { handleAuthError } from "@/utils/handleAuthError";


type ActionMenuProps = {
  funCodigo: number;
  funDocumento?: string | null;
  onFotoAtualizada?: () => void;
  disabled?: boolean;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const TARGET_WIDTH = 338;
const TARGET_HEIGHT = 254;

export function ActionMenu({ funCodigo, funDocumento, onFotoAtualizada, disabled }: ActionMenuProps) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  }>({
    visible: false,
    message: "",
    status: "INFO",
  });

  const showToast = (message: string, status: typeof toast.status = "INFO") => {
    setToast({ visible: true, message, status });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast("O arquivo deve ter no máximo 5MB", "ERROR");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      showToast("Por favor, selecione um arquivo de imagem", "ERROR");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const processedImage = await processImage(file);
      setSelectedFile(processedImage);
      setPreviewURL(URL.createObjectURL(processedImage));
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      showToast("Erro ao processar a imagem", "ERROR");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const processImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      reader.onerror = reject;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) throw new Error("Não foi possível obter o contexto 2D");

          canvas.width = TARGET_WIDTH;
          canvas.height = TARGET_HEIGHT;

          const scale = Math.max(
            TARGET_WIDTH / img.width,
            TARGET_HEIGHT / img.height
          );

          const newWidth = img.width * scale;
          const newHeight = img.height * scale;

          const offsetX = (TARGET_WIDTH - newWidth) / 2;
          const offsetY = (TARGET_HEIGHT - newHeight) / 2;

          ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Falha ao criar blob da imagem"));

              const processedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(processedFile);
            },
            "image/jpeg",
            0.9
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fun_codigo", String(funCodigo));

    try {
      const response = await fetch(
        "https://backend-turma-a-2025.onrender.com/api/admin/foto-funcionario/upload-foto-cnh",
        {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (handleAuthError(response, setToast, navigate)) return;
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Falha no upload");
      }

      showToast("Foto enviada com sucesso!", "SUCCESS");
      setIsDialogOpen(false);
      setSelectedFile(null);
      setPreviewURL(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (onFotoAtualizada) onFotoAtualizada();
    } catch (err) {
      console.error("Upload error:", err);
      showToast(
        err instanceof Error
          ? err.message
          : "Erro ao enviar foto. Tente novamente.",
        "ERROR"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {toast.visible && (
        <ToastMessage
          message={toast.message}
          status={toast.status}
          onHide={() => setToast({ ...toast, visible: false })}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-gray-100"
            disabled={disabled} // 🔹 Bloqueia botão do menu
          >
            <EllipsisVertical className="w-4 h-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            disabled={!!funDocumento || disabled} // 🔹 Bloqueia item se já tem documento ou se está desativado
            onClick={() => {
              if (!funDocumento && !disabled) setIsDialogOpen(true);
            }}
          >
            {!funDocumento ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                <span>Enviar CNH</span>
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4 text-green-500" />
                <span>CNH já cadastrada</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={disabled} // 🔹 Bloqueia link de viagens
            onClick={() => {
              if (!disabled) navigate(`/viagensFuncionario/${funCodigo}`);
            }}
          >
            <Route className="mr-2 h-4 w-4" />
            <span>Viagens</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Image className="h-5 w-5" />
              Enviar Foto da CNH do Funcionário #{funCodigo}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-start">
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="block mb-2">
                  Selecione a imagem (frente da CNH + rosto visível)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tamanho máximo: 5MB • Formato: JPG, PNG
                </p>
              </div>

              {previewURL ? (
                <div className="border rounded-md p-2 relative group">
                  <img
                    src={previewURL}
                    alt="Pré-visualização"
                    className="w-full h-64 object-contain mx-auto"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                  >
                    Remover
                  </Button>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {selectedFile?.name} •{" "}
                    {(selectedFile?.size / 1024).toFixed(1)}KB
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Nenhuma imagem selecionada
                  </p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full mt-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Foto"
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <Label className="block">Exemplo de imagem esperada</Label>
              <div className="border rounded-md p-2">
                <img
                  src={example}
                  alt="Exemplo de CNH"
                  className="w-full h-64 object-contain mx-auto"
                />
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Requisitos da imagem:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Frente da CNH legível</li>
                  <li>Rosto do funcionário visível</li>
                  <li>Formato JPG ou PNG</li>
                  <li>Tamanho máximo: 5MB</li>
                  <li>Será redimensionada para 338x254 pixels</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
