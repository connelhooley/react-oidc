import React from "react";
import { useUser } from "./AuthProvider";
export function Authorized(_a) {
    var role = _a.role, children = _a.children;
    var user = useUser();
    if (user && (!role || role === user.role)) {
        return React.createElement(React.Fragment, null, children);
    }
    else {
        return React.createElement(React.Fragment, null);
    }
}
