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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { createContext, useContext, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AuthService } from "./AuthService";
var AuthContext = createContext(undefined);
export function AuthProvider(props) {
    var oidcSettings = props.oidcSettings, signInCallbackFallbackRoute = props.signInCallbackFallbackRoute, defaultAuthorizedRouteRedirect = props.defaultAuthorizedRouteRedirect, defaultNotAuthorizedRouteRedirect = props.defaultNotAuthorizedRouteRedirect, signInCallbackRoute = props.signInCallbackRoute, silentSignInCallbackRoute = props.silentSignInCallbackRoute, loadingComponentFactory = props.loadingComponentFactory, children = props.children;
    var _a = useState(function () { return ({
        service: new AuthService(oidcSettings, signInCallbackFallbackRoute !== null && signInCallbackFallbackRoute !== void 0 ? signInCallbackFallbackRoute : "/"),
        defaultAuthorizedRouteRedirect: defaultAuthorizedRouteRedirect !== null && defaultAuthorizedRouteRedirect !== void 0 ? defaultAuthorizedRouteRedirect : "/",
        defaultNotAuthorizedRouteRedirect: defaultNotAuthorizedRouteRedirect !== null && defaultNotAuthorizedRouteRedirect !== void 0 ? defaultNotAuthorizedRouteRedirect : "/",
    }); }), state = _a[0], setState = _a[1];
    useEffect(function () {
        state.service.onUserUpdated = function (user) {
            setState(function (current) { return (__assign(__assign({}, current), { user: user })); });
        };
        state.service.initiate();
        return function () { return state.service.onUserUpdated = undefined; };
    }, []);
    return (React.createElement(Switch, null,
        React.createElement(Route, { path: signInCallbackRoute !== null && signInCallbackRoute !== void 0 ? signInCallbackRoute : "/callback" },
            React.createElement(CompleteSignIn, { loading: loadingComponentFactory, service: state.service })),
        React.createElement(Route, { path: silentSignInCallbackRoute !== null && silentSignInCallbackRoute !== void 0 ? silentSignInCallbackRoute : "/silent-callback" },
            React.createElement(CompleteSilentSignIn, { service: state.service })),
        React.createElement(Route, { path: "*" },
            React.createElement(AuthContext.Provider, { value: state }, children))));
}
export function useAuth() {
    var auth = useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useAuth called outside of AuthProvider");
    }
    else {
        return auth;
    }
}
export function useUser() {
    var auth = useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useUser called outside of AuthProvider");
    }
    else {
        return auth.user;
    }
}
export function useAccessToken() {
    var auth = useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useAccessToken called outside of AuthProvider");
    }
    else {
        return auth.user && auth.user.accessToken || undefined;
    }
}
function CompleteSignIn(_a) {
    var _this = this;
    var _b;
    var service = _a.service, loading = _a.loading;
    var _c = useState(null), returnUrl = _c[0], setReturnUrl = _c[1];
    useEffect(function () {
        var completeSignIn = function () { return __awaiter(_this, void 0, void 0, function () {
            var returnUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.completeSignIn()];
                    case 1:
                        returnUrl = _a.sent();
                        setReturnUrl(returnUrl);
                        return [2 /*return*/];
                }
            });
        }); };
        completeSignIn();
    }, []);
    if (returnUrl) {
        return (React.createElement(Redirect, { to: returnUrl }));
    }
    else {
        return (_b = loading === null || loading === void 0 ? void 0 : loading.call(undefined)) !== null && _b !== void 0 ? _b : React.createElement(React.Fragment, null);
    }
}
function CompleteSilentSignIn(_a) {
    var _this = this;
    var service = _a.service;
    useEffect(function () {
        var completeRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.completeRefresh()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        completeRefresh();
    }, []);
    return React.createElement(React.Fragment, null);
}
