import React from "react";
import { RouteProps, Redirect, Route } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export interface AuthorizedRouteProps {
    redirect?: string;
    role?: string;
}

export function AuthorizedRoute(props: AuthorizedRouteProps & RouteProps): JSX.Element {
    const { defaultAuthorizedRouteRedirect, user } = useAuth();
    const {redirect, role, ...routeProps} = props;
    if (user && (!role || role === user.role)) {
        return (
            <Route {...routeProps}>{props.children}</Route>
        );
    } else {
        return (
            <Redirect to={redirect ?? defaultAuthorizedRouteRedirect} />
        );
    }
}
