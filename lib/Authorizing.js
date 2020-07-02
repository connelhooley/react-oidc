import React from "react";
import { useUser } from "./AuthProvider";
export function Authorizing(_a) {
    var children = _a.children;
    var user = useUser();
    if (user === undefined) {
        return React.createElement(React.Fragment, null, children);
    }
    else {
        return React.createElement(React.Fragment, null);
    }
}
