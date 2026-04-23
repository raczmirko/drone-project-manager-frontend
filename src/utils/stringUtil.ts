import i18n from "../i18n/config";

export function getLoginErrorByStatus(status: number): string {
    switch (status) {
        case 401:
            return i18n.t("signIn.errors.invalidCredentials");
        case 403:
            return i18n.t("signIn.errors.forbidden");
        case 404:
            return i18n.t("signIn.errors.notFound");
        default:
            return i18n.t("signIn.errors.unexpected");
    }
}
