import React, { PropsWithChildren } from "react";

import { useUser } from "./AuthProvider";

export function NotAuthorized({ children }: PropsWithChildren<unknown>): JSX.Element {
    const user = useUser();
    if (user === false) {
        return <>{children}</>;
    } else {
        return <></>;
    }
}
