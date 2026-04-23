import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext.ts";
import type { NotificationContextType } from "../contexts/NotificationContext.ts";

export const useNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
