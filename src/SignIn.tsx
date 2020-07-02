import React, { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider";

interface SignInProps {
    delay?: number;
}

export function SignIn({delay = 1000, children}: PropsWithChildren<SignInProps>): JSX.Element {
    const location = useLocation();
    const { service } = useAuth();
    const [startSignIn, setStartSignIn] = useState(false);
    useEffect(() => {
        const timeoutId = setTimeout(() => setStartSignIn(true), delay);
        return () => clearTimeout(timeoutId);
    }, []);

    if (startSignIn) {
        service.startSignIn(location.pathname + location.search + location.hash);
    }

    return (
        <>{children}</>
    );
}
