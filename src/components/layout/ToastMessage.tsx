import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

type ToastMessageProps = {
  message: string;
  onHide?: () => void;
  status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
};

const statusStyles = {
  SUCCESS: {
    bg: "bg-white",
    border: "border-l-4 border-emerald-500",
    icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    textColor: "text-gray-800",
  },
  ERROR: {
    bg: "bg-white",
    border: "border-l-4 border-rose-500",
    icon: <XCircle className="w-5 h-5 text-rose-500" />,
    textColor: "text-gray-800",
  },
  WARNING: {
    bg: "bg-white",
    border: "border-l-4 border-amber-500",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    textColor: "text-gray-800",
  },
  INFO: {
    bg: "bg-white",
    border: "border-l-4 border-slate-500",
    icon: <Info className="w-5 h-5 text-slate-500" />,
    textColor: "text-gray-800",
  },
};

export default function ToastMessage({
  message,
  onHide,
  status = "INFO",
}: ToastMessageProps) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setVisible(false);
        if (onHide) onHide();
      }, 300);
    }, 2700);

    return () => clearTimeout(timeout);
  }, [onHide]);

  if (!visible) return null;

  const { bg, border, icon, textColor } = statusStyles[status];

  return (
    <div
      className={`
        fixed bottom-6 right-6
        flex items-start
        px-4 py-3 rounded-sm shadow-lg
        ${bg} ${border} ${textColor}
        z-[9999]
        transform transition-all duration-300
        ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex-shrink-0 pt-0.5 mr-3">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium leading-tight">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setVisible(false);
            if (onHide) onHide();
          }, 300);
        }}
        className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label="Dismiss"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}