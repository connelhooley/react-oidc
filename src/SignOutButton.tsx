import React, { PropsWithChildren, DetailedHTMLProps } from "react";

import { useAuth } from "./AuthProvider";

type SignOutButtonProps =
    PropsWithChildren<unknown> &
    DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function SignOutButton(props: SignOutButtonProps): JSX.Element {
    const { service } = useAuth();
    const startSignOut = async () => {
        await service.startSignOut();
    }
    return (
        <button {...props} onClick={startSignOut} />
    );
}
