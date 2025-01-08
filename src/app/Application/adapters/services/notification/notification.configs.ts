import { NotificationConfig } from "@Domain/models/notification-config.type";

export const WarningConfig = (title: string, text: string): NotificationConfig => {
    return GetConfig(title, text, "warning", "warning_outline");
}

export const SuccessConfig = (title: string, text: string): NotificationConfig => {
    return GetConfig(title, text, "success", "check_circle_outline");
}

export const ErrorConfig = (title: string, text: string): NotificationConfig => {
    return GetConfig(title, text, "error", "cancel_outline");
}

export const InfoConfig = (title: string, text: string): NotificationConfig => {
    return GetConfig(title, text, "info", "error_outline");
}

const GetConfig = (title: string, text: string, type: 'success' | 'error' | 'warning' | 'info', icon: string): NotificationConfig => {
    return {
        title, text, type, duration: 5000, icon
    }
}
