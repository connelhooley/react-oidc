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
import { withRouter } from "react-router-dom";
import { useAuth } from "./AuthProvider";
export var SignInButton = withRouter(function (props) {
    var service = useAuth().service;
    var startSignIn = function () {
        service.startSignIn(props.location.pathname + props.location.search + props.location.hash);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var staticContext = props.staticContext, history = props.history, location = props.location, match = props.match, childProps = __rest(props, ["staticContext", "history", "location", "match"]);
    return (React.createElement("button", __assign({}, childProps, { onClick: startSignIn })));
});
