var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./AuthProvider";
export function NotAuthorizedRoute(props) {
    var _a = useAuth(), defaultNotAuthorizedRouteRedirect = _a.defaultNotAuthorizedRouteRedirect, user = _a.user;
    var redirect = props.redirect, role = props.role, routeProps = __rest(props, ["redirect", "role"]);
    if (user === false || (role && user && user.role !== role)) {
        return (React.createElement(Route, __assign({}, routeProps), props.children));
    }
    else {
        return (React.createElement(Redirect, { to: redirect !== null && redirect !== void 0 ? redirect : defaultNotAuthorizedRouteRedirect }));
    }
}
