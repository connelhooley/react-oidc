import React, { PropsWithChildren } from "react";

import { useUser } from "./AuthProvider";

export interface NotAuthorizedProps {
    role?: string;
}

export function NotAuthorized({ children, role }: PropsWithChildren<NotAuthorizedProps>): JSX.Element {
    const user = useUser();
    if (user === false || (role && user && user.role !== role)) {
        return <>{children}</>;
    } else {
        return <></>;
    }
}
