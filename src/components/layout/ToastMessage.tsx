import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

type ToastMessageProps = {
  message: string;
  onHide?: () => void;
  status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
};

export default function ToastMessage({
  message,
  onHide,
  status = "INFO",
}: ToastMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      if (onHide) onHide();
    }, 3500);

    return () => clearTimeout(timeout);
  }, [onHide]);

  if (!visible) return null;

  const statusStyles = {
    SUCCESS: {
      bg: "bg-green-600",
      icon: <CheckCircle className="w-5 h-5 text-white mr-2" />,
    },
    ERROR: {
      bg: "bg-red-600",
      icon: <XCircle className="w-5 h-5 text-white mr-2" />,
    },
    WARNING: {
      bg: "bg-yellow-500 text-black",
      icon: <AlertTriangle className="w-5 h-5 text-black mr-2" />,
    },
    INFO: {
      bg: "bg-blue-600",
      icon: <Info className="w-5 h-5 text-white mr-2" />,
    },
  };

  const { bg, icon } = statusStyles[status];

  return (
    <div
      className={`
        fixed bottom-6 right-6
        flex items-center max-w-sm w-full
        px-4 py-3 rounded-xl shadow-2xl
        ${bg} text-white z-[9999]
        animate-slideUpFade
      `}
      role="alert"
    >
      {icon}
      <span className="font-medium text-center">{message}</span>
    </div>
  );
}
