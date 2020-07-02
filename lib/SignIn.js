import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
export function SignIn(_a) {
    var _b = _a.delay, delay = _b === void 0 ? 1000 : _b, children = _a.children;
    var location = useLocation();
    var service = useAuth().service;
    var _c = useState(false), startSignIn = _c[0], setStartSignIn = _c[1];
    useEffect(function () {
        setTimeout(function () { return setStartSignIn(true); }, delay);
    }, []);
    if (startSignIn) {
        service.startSignIn(location.pathname + location.search + location.hash);
    }
    return (React.createElement(React.Fragment, null, children));
}
