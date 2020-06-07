import { UserManager, User as OidcUser, UserManagerSettings } from "oidc-client";

export interface User {
    id: string;
    token: string;
    name: string;
    email: string;
    role: string;
}

export class AuthService {
    private userManager: UserManager;
    private signInCallbackFallbackRoute: string;
    
    public onUserUpdated?: (user?: User|false) => void;

    public constructor(oidcSettings: UserManagerSettings, signInCallbackFallbackRoute: string) {
        this.userManager = new UserManager(oidcSettings);
        this.signInCallbackFallbackRoute = signInCallbackFallbackRoute;
        this.userManager.events.addUserLoaded(oidcUser => {
            const user = this.mapUser(oidcUser);
            this.onUserUpdated?.call(this, user);
        });
        this.userManager.events.addUserUnloaded(() => {
            this.onUserUpdated?.call(this, false);
        });
    }

    public async initiate(): Promise<void> {
        const oidcUser = await this.userManager.getUser();
        if (oidcUser?.expired) {
            try {
                const oidcUser = await this.userManager.signinSilent();
                const user = this.mapUser(oidcUser);
                this.onUserUpdated?.call(this, user);
            }
            catch {
                this.onUserUpdated?.call(this, false);
            }
        } else {
            const user = this.mapUser(oidcUser ?? undefined);
            this.onUserUpdated?.call(this, user);
        }
    }

    public async startSignIn(returnUrl: string): Promise<void> {
        await this.userManager.signinRedirect({data: { returnUrl }});
    }

    public async completeSignIn(): Promise<string> {
        try 
        {
            const oidcUser = await this.userManager.signinRedirectCallback();
            return oidcUser?.state?.returnUrl ?? this.signInCallbackFallbackRoute;
        }
        catch
        {
            return this.signInCallbackFallbackRoute;
        }
    }

    public async startSignOut(): Promise<void> {
        await this.userManager.signoutRedirect();
    }

    public async completeRefresh(): Promise<void> {
        await this.userManager.signinSilentCallback();
    }

    private mapUser(user?: OidcUser): User|false {
        if (user?.expired) {
            return false;
        } else if (user?.profile && user?.profile?.name && user?.profile?.email && user?.profile?.role) {
            const mappedUser = {
                id: user.profile.sub,
                token: user.access_token,
                name: user.profile.name,
                email: user.profile.email,
                role: user.profile.role,
            };
            return mappedUser;
        } else {
            return false;
        }
    }
}
