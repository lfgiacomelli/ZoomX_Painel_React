export type ToastProps = {
    visible: boolean;
    message: string;
    status?: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
    icon?: React.ReactNode;
}