import React from "react";
import { Route, RouteProps, Redirect } from "react-router";

import { NotAuthorized } from "./NotAuthorized";
import { Authorized } from "./Authorized";
import { useAuth } from "./AuthProvider";
import { Authorizing } from "./Authorizing";

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
