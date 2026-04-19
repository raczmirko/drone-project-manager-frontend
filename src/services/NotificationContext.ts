import { createContext } from "react";

type AlertType = 'success' | 'info' | 'warning' | 'error' | '';

export interface NotificationContextType {
    showNotification: (type: Exclude<AlertType, ''>, message: string) => void;
    closeNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
