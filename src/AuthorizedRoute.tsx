import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

import { Authorized } from "./Authorized";
import { Authorizing } from "./Authorizing";
import { useAuth } from "./AuthProvider";
import { NotAuthorized } from "./NotAuthorized";

export interface AuthorizedRouteProps {
    redirect?: string;
}

export function AuthorizedRoute(props: AuthorizedRouteProps & RouteProps): JSX.Element {
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
