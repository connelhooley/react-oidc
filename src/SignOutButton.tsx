import React, { PropsWithChildren, DetailedHTMLProps } from "react";

import { useAuth } from "./AuthProvider";

type SignOutButtonProps =
    PropsWithChildren<{}> &
    DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function SignOutButton(props: SignOutButtonProps) {
    const { service } = useAuth();
    const startSignOut = async () => {
        await service.startSignOut();
    }
    return (
        <button {...props} onClick={startSignOut} />
    );
}
