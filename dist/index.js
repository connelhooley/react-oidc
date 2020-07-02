'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactRouterDom = require('react-router-dom');
var oidcClient = require('oidc-client');

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
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
var AuthService = /** @class */ (function () {
    function AuthService(oidcSettings, signInCallbackFallbackRoute) {
        var _this = this;
        this.userManager = new oidcClient.UserManager(oidcSettings);
        this.signInCallbackFallbackRoute = signInCallbackFallbackRoute;
        this.userManager.events.addUserLoaded(function (oidcUser) {
            var _a;
            var user = _this.mapUser(oidcUser);
            (_a = _this.onUserUpdated) === null || _a === void 0 ? void 0 : _a.call(_this, user);
        });
        this.userManager.events.addUserUnloaded(function () {
            var _a;
            (_a = _this.onUserUpdated) === null || _a === void 0 ? void 0 : _a.call(_this, false);
        });
    }
    AuthService.prototype.initiate = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var oidcUser, oidcUser_1, user, _d, user;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.userManager.getUser()];
                    case 1:
                        oidcUser = _e.sent();
                        if (!(oidcUser === null || oidcUser === void 0 ? void 0 : oidcUser.expired)) return [3 /*break*/, 6];
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.userManager.signinSilent()];
                    case 3:
                        oidcUser_1 = _e.sent();
                        user = this.mapUser(oidcUser_1);
                        (_a = this.onUserUpdated) === null || _a === void 0 ? void 0 : _a.call(this, user);
                        return [3 /*break*/, 5];
                    case 4:
                        _d = _e.sent();
                        (_b = this.onUserUpdated) === null || _b === void 0 ? void 0 : _b.call(this, false);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        user = this.mapUser(oidcUser !== null && oidcUser !== void 0 ? oidcUser : undefined);
                        (_c = this.onUserUpdated) === null || _c === void 0 ? void 0 : _c.call(this, user);
                        _e.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.startSignIn = function (returnUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userManager.signinRedirect({ data: { returnUrl: returnUrl } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.completeSignIn = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var oidcUser, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userManager.signinRedirectCallback()];
                    case 1:
                        oidcUser = _d.sent();
                        return [2 /*return*/, (_b = (_a = oidcUser === null || oidcUser === void 0 ? void 0 : oidcUser.state) === null || _a === void 0 ? void 0 : _a.returnUrl) !== null && _b !== void 0 ? _b : this.signInCallbackFallbackRoute];
                    case 2:
                        _c = _d.sent();
                        return [2 /*return*/, this.signInCallbackFallbackRoute];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.startSignOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userManager.signoutRedirect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.completeRefresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userManager.signinSilentCallback()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.mapUser = function (user) {
        var _a, _b, _c;
        if (user === null || user === void 0 ? void 0 : user.expired) {
            return false;
        }
        else if (((_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.name) && ((_b = user === null || user === void 0 ? void 0 : user.profile) === null || _b === void 0 ? void 0 : _b.email) && ((_c = user === null || user === void 0 ? void 0 : user.profile) === null || _c === void 0 ? void 0 : _c.role)) {
            var mappedUser = {
                id: user.profile.sub,
                accessToken: user.access_token,
                name: user.profile.name,
                email: user.profile.email,
                role: user.profile.role,
            };
            return mappedUser;
        }
        else {
            return false;
        }
    };
    return AuthService;
}());

var __assign = (undefined && undefined.__assign) || function () {
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
var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
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
var AuthContext = React.createContext(undefined);
function AuthProvider(props) {
    var oidcSettings = props.oidcSettings, signInCallbackFallbackRoute = props.signInCallbackFallbackRoute, defaultAuthorizedRouteRedirect = props.defaultAuthorizedRouteRedirect, defaultNotAuthorizedRouteRedirect = props.defaultNotAuthorizedRouteRedirect, signInCallbackRoute = props.signInCallbackRoute, silentSignInCallbackRoute = props.silentSignInCallbackRoute, loadingComponentFactory = props.loadingComponentFactory, children = props.children;
    var _a = React.useState(function () { return ({
        service: new AuthService(oidcSettings, signInCallbackFallbackRoute !== null && signInCallbackFallbackRoute !== void 0 ? signInCallbackFallbackRoute : "/"),
        defaultAuthorizedRouteRedirect: defaultAuthorizedRouteRedirect !== null && defaultAuthorizedRouteRedirect !== void 0 ? defaultAuthorizedRouteRedirect : "/",
        defaultNotAuthorizedRouteRedirect: defaultNotAuthorizedRouteRedirect !== null && defaultNotAuthorizedRouteRedirect !== void 0 ? defaultNotAuthorizedRouteRedirect : "/",
    }); }), state = _a[0], setState = _a[1];
    React.useEffect(function () {
        state.service.onUserUpdated = function (user) {
            setState(function (current) { return (__assign(__assign({}, current), { user: user })); });
        };
        state.service.initiate();
        return function () { return state.service.onUserUpdated = undefined; };
    }, []);
    return (React__default.createElement(reactRouterDom.Switch, null,
        React__default.createElement(reactRouterDom.Route, { path: signInCallbackRoute !== null && signInCallbackRoute !== void 0 ? signInCallbackRoute : "/callback" },
            React__default.createElement(CompleteSignIn, { loading: loadingComponentFactory, service: state.service })),
        React__default.createElement(reactRouterDom.Route, { path: silentSignInCallbackRoute !== null && silentSignInCallbackRoute !== void 0 ? silentSignInCallbackRoute : "/silent-callback" },
            React__default.createElement(CompleteSilentSignIn, { service: state.service })),
        React__default.createElement(reactRouterDom.Route, { path: "*" },
            React__default.createElement(AuthContext.Provider, { value: state }, children))));
}
function useAuth() {
    var auth = React.useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useAuth called outside of AuthProvider");
    }
    else {
        return auth;
    }
}
function useUser() {
    var auth = React.useContext(AuthContext);
    if (auth === undefined) {
        throw new Error("useUser called outside of AuthProvider");
    }
    else {
        return auth.user;
    }
}
function useAccessToken() {
    var auth = React.useContext(AuthContext);
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
    var _c = React.useState(null), returnUrl = _c[0], setReturnUrl = _c[1];
    React.useEffect(function () {
        var completeSignIn = function () { return __awaiter$1(_this, void 0, void 0, function () {
            var returnUrl;
            return __generator$1(this, function (_a) {
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
        return (React__default.createElement(reactRouterDom.Redirect, { to: returnUrl }));
    }
    else {
        return (_b = loading === null || loading === void 0 ? void 0 : loading.call(undefined)) !== null && _b !== void 0 ? _b : React__default.createElement(React__default.Fragment, null);
    }
}
function CompleteSilentSignIn(_a) {
    var _this = this;
    var service = _a.service;
    React.useEffect(function () {
        var completeRefresh = function () { return __awaiter$1(_this, void 0, void 0, function () {
            return __generator$1(this, function (_a) {
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
    return React__default.createElement(React__default.Fragment, null);
}

function Authorized(_a) {
    var role = _a.role, children = _a.children;
    var user = useUser();
    if (user && (!role || role === user.role)) {
        return React__default.createElement(React__default.Fragment, null, children);
    }
    else {
        return React__default.createElement(React__default.Fragment, null);
    }
}

function NotAuthorized(_a) {
    var children = _a.children, role = _a.role;
    var user = useUser();
    if (user === false || (role && user && user.role !== role)) {
        return React__default.createElement(React__default.Fragment, null, children);
    }
    else {
        return React__default.createElement(React__default.Fragment, null);
    }
}

function Authorizing(_a) {
    var children = _a.children;
    var user = useUser();
    if (user === undefined) {
        return React__default.createElement(React__default.Fragment, null, children);
    }
    else {
        return React__default.createElement(React__default.Fragment, null);
    }
}

var __assign$1 = (undefined && undefined.__assign) || function () {
    __assign$1 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
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
function AuthorizedRoute(props) {
    var _a = useAuth(), defaultAuthorizedRouteRedirect = _a.defaultAuthorizedRouteRedirect, user = _a.user;
    var redirect = props.redirect, role = props.role, routeProps = __rest(props, ["redirect", "role"]);
    if (user && (!role || role === user.role)) {
        return (React__default.createElement(reactRouterDom.Route, __assign$1({}, routeProps), props.children));
    }
    else {
        return (React__default.createElement(reactRouterDom.Redirect, { to: redirect !== null && redirect !== void 0 ? redirect : defaultAuthorizedRouteRedirect }));
    }
}

var __assign$2 = (undefined && undefined.__assign) || function () {
    __assign$2 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};
var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
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
function NotAuthorizedRoute(props) {
    var _a = useAuth(), defaultNotAuthorizedRouteRedirect = _a.defaultNotAuthorizedRouteRedirect, user = _a.user;
    var redirect = props.redirect, role = props.role, routeProps = __rest$1(props, ["redirect", "role"]);
    if (user === false || (role && user && user.role !== role)) {
        return (React__default.createElement(reactRouterDom.Route, __assign$2({}, routeProps), props.children));
    }
    else {
        return (React__default.createElement(reactRouterDom.Redirect, { to: redirect !== null && redirect !== void 0 ? redirect : defaultNotAuthorizedRouteRedirect }));
    }
}

var __assign$3 = (undefined && undefined.__assign) || function () {
    __assign$3 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$3.apply(this, arguments);
};
var __rest$2 = (undefined && undefined.__rest) || function (s, e) {
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
var SignInButton = reactRouterDom.withRouter(function (props) {
    var service = useAuth().service;
    var startSignIn = function () {
        service.startSignIn(props.location.pathname + props.location.search + props.location.hash);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var staticContext = props.staticContext, history = props.history, location = props.location, match = props.match, childProps = __rest$2(props, ["staticContext", "history", "location", "match"]);
    return (React__default.createElement("button", __assign$3({}, childProps, { onClick: startSignIn })));
});

var __assign$4 = (undefined && undefined.__assign) || function () {
    __assign$4 = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign$4.apply(this, arguments);
};
var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
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
function SignOutButton(props) {
    var _this = this;
    var service = useAuth().service;
    var startSignOut = function () { return __awaiter$2(_this, void 0, void 0, function () {
        return __generator$2(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.startSignOut()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (React__default.createElement("button", __assign$4({}, props, { onClick: startSignOut })));
}

function SignIn(_a) {
    var _b = _a.delay, delay = _b === void 0 ? 1000 : _b, children = _a.children;
    var location = reactRouterDom.useLocation();
    var service = useAuth().service;
    var _c = React.useState(false), startSignIn = _c[0], setStartSignIn = _c[1];
    React.useEffect(function () {
        setTimeout(function () { return setStartSignIn(true); }, delay);
    }, []);
    if (startSignIn) {
        service.startSignIn(location.pathname + location.search + location.hash);
    }
    return (React__default.createElement(React__default.Fragment, null, children));
}

exports.AuthProvider = AuthProvider;
exports.Authorized = Authorized;
exports.AuthorizedRoute = AuthorizedRoute;
exports.Authorizing = Authorizing;
exports.NotAuthorized = NotAuthorized;
exports.NotAuthorizedRoute = NotAuthorizedRoute;
exports.SignIn = SignIn;
exports.SignInButton = SignInButton;
exports.SignOutButton = SignOutButton;
exports.useAccessToken = useAccessToken;
exports.useAuth = useAuth;
exports.useUser = useUser;
