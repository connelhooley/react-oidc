import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

import { Authorized } from "./Authorized";
import { NotAuthorized } from "./NotAuthorized";
import { useAuth } from "./AuthProvider";
import { Authorizing } from "./Authorizing";

export interface AuthorizedRouteProps {
    redirect?: string;
}

export function AuthorizedRoute(props: AuthorizedRouteProps & RouteProps) {
    const { defaultAuthorizedRouteRedirect } = useAuth();
    return (
        <Route {...props}>
            <Authorized>
                {props.children}
            </Authorized>
            <NotAuthorized>
                <Redirect to={props.redirect ?? defaultAuthorizedRouteRedirect} />
            </NotAuthorized>
            <Authorizing>
                <Redirect to={props.redirect ?? defaultAuthorizedRouteRedirect} />
            </Authorizing>
        </Route>
    );
}
