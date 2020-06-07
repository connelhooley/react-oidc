import React, { PropsWithChildren, DetailedHTMLProps } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { useAuth } from "./AuthProvider";

type SignInButtonProps =
    PropsWithChildren<RouteComponentProps> &
    DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const SignInButton = withRouter((props: SignInButtonProps) =>
{
    const { service } = useAuth();
    const startSignIn = async () => {
        await service.startSignIn(props.location.pathname + props.location.search + props.location.hash);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { staticContext, history, location, match, ...childProps } = props;
    return (
        <button {...childProps} onClick={startSignIn} />
    );
});
