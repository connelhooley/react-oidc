import React from "react";
import { Route, RouteProps, Redirect } from "react-router";

import { Authorized } from "./Authorized";
import { Authorizing } from "./Authorizing";
import { useAuth } from "./AuthProvider";
import { NotAuthorized } from "./NotAuthorized";

export interface NotAuthorizedRouteProps {
    redirect?: string;
}

export function NotAuthorizedRoute(props: NotAuthorizedRouteProps & RouteProps): JSX.Element {
    const { defaultNotAuthorizedRouteRedirect } = useAuth();
    return (
        <Route {...props}>
            <NotAuthorized>
                {props.children}
            </NotAuthorized>
            <Authorized>
                <Redirect to={props.redirect ?? defaultNotAuthorizedRouteRedirect} />
            </Authorized>
            <Authorizing>
                <Redirect to={props.redirect ?? defaultNotAuthorizedRouteRedirect} />
            </Authorizing>
        </Route>
    );
}
