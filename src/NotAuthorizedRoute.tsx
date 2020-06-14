import React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export interface NotAuthorizedRouteProps {
    redirect?: string;
    role?: string;
}

export function NotAuthorizedRoute(props: NotAuthorizedRouteProps & RouteProps): JSX.Element {
    const { defaultNotAuthorizedRouteRedirect, user } = useAuth();
    const {redirect, role, ...routeProps} = props;
    if (user === false || (role && user && user.role !== role)) {
        return (
            <Route {...routeProps}>{props.children}</Route>
        );
    } else {
        return (
            <Redirect to={redirect ?? defaultNotAuthorizedRouteRedirect} />
        );
    }
}
