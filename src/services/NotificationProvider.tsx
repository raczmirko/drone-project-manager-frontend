import * as React from 'react';
import { useState } from "react";
import type { ReactNode } from "react";
import AlertSnackBar from "../components/AlertSnackBar";
import { NotificationContext } from "./NotificationContext";

type AlertType = 'success' | 'info' | 'warning' | 'error' | '';

interface NotificationState {
    isOpen: boolean;
    alertType: AlertType;
    alertText: string;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({
        isOpen: false,
        alertType: "",
        alertText: "",
    });

    const showNotification = (type: Exclude<AlertType, ''>, message: string) => {
        setNotification({ isOpen: true, alertType: type, alertText: message });
    };

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, isOpen: false }));
    };

    const handleSetIsOpen = (isOpen: boolean) => {
        if (!isOpen) {
            closeNotification();
        }
    };

    return (
        <NotificationContext.Provider value={{ showNotification, closeNotification }}>
            {children}
            {notification.alertType !== "" && (
                <AlertSnackBar
                    alertType={notification.alertType as Exclude<AlertType, ''>}
                    alertText={notification.alertText}
                    isOpen={notification.isOpen}
                    setIsOpen={handleSetIsOpen}
                />
            )}
        </NotificationContext.Provider>
    );
};
