import React, { PropsWithChildren } from "react";

import { useUser } from "./AuthProvider";

export interface AuthorizedProps {
    role?: string;
}

export function Authorized({ role, children }: PropsWithChildren<AuthorizedProps>) {
    const user = useUser();
    if (user && (!role || role === user.role)) {
        return <>{children}</>;
    } else {
        return <></>;
    }
}
