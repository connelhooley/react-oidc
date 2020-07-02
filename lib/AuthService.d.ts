import { UserManagerSettings } from "oidc-client";
export interface User {
    id: string;
    accessToken: string;
    name: string;
    email: string;
    role: string;
}
export declare class AuthService {
    private userManager;
    private signInCallbackFallbackRoute;
    onUserUpdated?: (user?: User | false) => void;
    constructor(oidcSettings: UserManagerSettings, signInCallbackFallbackRoute: string);
    initiate(): Promise<void>;
    startSignIn(returnUrl: string): Promise<void>;
    completeSignIn(): Promise<string>;
    startSignOut(): Promise<void>;
    completeRefresh(): Promise<void>;
    private mapUser;
}
