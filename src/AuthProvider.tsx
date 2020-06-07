import React, { PropsWithChildren, useState, useEffect, createContext, useContext } from "react";
import { Switch, Route, Redirect } from "react-router";
import { UserManagerSettings } from "oidc-client";

import { AuthService, User } from "./AuthService";

interface AuthContextValue {
    service: AuthService;
    user?: User|false;
    defaultAuthorizedRouteRedirect: string;
    defaultNotAuthorizedRouteRedirect: string;
}

const AuthContext = createContext<AuthContextValue|undefined>(undefined);

export interface AuthProviderProps {
    oidcSettings: UserManagerSettings;
    signInCallbackFallbackRoute?: string;
    defaultAuthorizedRouteRedirect?: string;
    defaultNotAuthorizedRouteRedirect?: string;
    signInCallbackRoute?: string;
    silentSignInCallbackRoute?: string;
    loadingComponentFactory?: () => JSX.Element;
}

export function AuthProvider(props: PropsWithChildren<AuthProviderProps>): JSX.Element {
    const {
        oidcSettings,
        signInCallbackFallbackRoute,
        defaultAuthorizedRouteRedirect,
        defaultNotAuthorizedRouteRedirect,
        signInCallbackRoute,
        silentSignInCallbackRoute,
        loadingComponentFactory,
        children,
    } = props;

    const [state, setState] = useState<AuthContextValue>(() => ({
        service: new AuthService(oidcSettings, signInCallbackFallbackRoute ?? "/"),
        defaultAuthorizedRouteRedirect: defaultAuthorizedRouteRedirect ?? "/",
        defaultNotAuthorizedRouteRedirect: defaultNotAuthorizedRouteRedirect ?? "/",
    }));

    useEffect(() => {
        state.service.onUserUpdated = user => {
            setState(current => ({
                ...current,
                user,
            }));
        };
        state.service.initiate();
        return () => state.service.onUserUpdated = undefined;
    }, []);

    return (
        <Switch>
            <Route path={signInCallbackRoute ?? "/callback"}>
                <CompleteSignIn loading={loadingComponentFactory} service={state.service} />
            </Route>
            <Route path={silentSignInCallbackRoute ?? "/silent-callback"}>
                <CompleteSilentSignIn service={state.service} />
            </Route>
            <Route path="*">
                <AuthContext.Provider value={state}>
                    {children}
                </AuthContext.Provider>
            </Route>
        </Switch>
    );
}

export function useAuth(): AuthContextValue {
    const auth = useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useAuth called outside of AuthProvider");
    } else {
        return auth;
    }
}

export function useUser(): User|false|undefined {
    const auth = useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useUser called outside of AuthProvider");
    } else {
        return auth.user;
    }
}

interface CompleteSignInProps {
    service: AuthService;
    loading?: () => JSX.Element;
}

function CompleteSignIn({ service, loading }: CompleteSignInProps) {
    const [returnUrl, setReturnUrl] = useState<string|null>(null);
    useEffect(() => {
        const completeSignIn = async () => {
            const returnUrl = await service.completeSignIn();
            setReturnUrl(returnUrl);
        };
        completeSignIn();
    }, []);
    if (returnUrl) {
        return (
            <Redirect to={returnUrl} />
        );
    }  else {
        return loading?.call(undefined) ?? <></>;
    }
}

interface CompleteSilentSignInProps {
    service: AuthService;
}

function CompleteSilentSignIn({ service }: CompleteSilentSignInProps) {
    useEffect(() => {
        const completeRefresh = async () => {
            await service.completeRefresh();
        };
        completeRefresh();
    }, []);
    return <></>;
}