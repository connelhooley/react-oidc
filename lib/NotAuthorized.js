import React from "react";
import { useUser } from "./AuthProvider";
export function NotAuthorized(_a) {
    var children = _a.children, role = _a.role;
    var user = useUser();
    if (user === false || (role && user && user.role !== role)) {
        return React.createElement(React.Fragment, null, children);
    }
    else {
        return React.createElement(React.Fragment, null);
    }
}
