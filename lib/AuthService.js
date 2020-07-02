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
import { UserManager } from "oidc-client";
var AuthService = /** @class */ (function () {
    function AuthService(oidcSettings, signInCallbackFallbackRoute) {
        var _this = this;
        this.userManager = new UserManager(oidcSettings);
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
export { AuthService };
