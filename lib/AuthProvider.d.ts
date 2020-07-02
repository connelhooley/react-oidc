import { UserManagerSettings } from "oidc-client";
import { PropsWithChildren } from "react";
import { AuthService, User } from "./AuthService";
interface AuthContextValue {
    service: AuthService;
    user?: User | false;
    defaultAuthorizedRouteRedirect: string;
    defaultNotAuthorizedRouteRedirect: string;
}
export interface AuthProviderProps {
    oidcSettings: UserManagerSettings;
    signInCallbackFallbackRoute?: string;
    defaultAuthorizedRouteRedirect?: string;
    defaultNotAuthorizedRouteRedirect?: string;
    signInCallbackRoute?: string;
    silentSignInCallbackRoute?: string;
    loadingComponentFactory?: () => JSX.Element;
}
export declare function AuthProvider(props: PropsWithChildren<AuthProviderProps>): JSX.Element;
export declare function useAuth(): AuthContextValue;
export declare function useUser(): User | false | undefined;
export declare function useAccessToken(): string | undefined;
export {};
