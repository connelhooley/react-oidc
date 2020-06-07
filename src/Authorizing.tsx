import React, { PropsWithChildren } from "react";

import { useUser } from "./AuthProvider";

export function Authorizing({ children }: PropsWithChildren<unknown>): JSX.Element {
    const user = useUser();
    if (user === undefined) {
        return <>{children}</>;
    } else {
        return <></>;
    }
}
