import React, { PropsWithChildren, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export const SignIn = withRouter((props: PropsWithChildren<RouteComponentProps>) =>
{
    const { service } = useAuth();
    useEffect(() => {
        const startSignIn = async () => {
            await service.startSignIn(props.location.pathname + props.location.search + props.location.hash);
        };
        startSignIn();
    }, [])
    return (
        <>{props.children}</>
    );
});
