/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup } from "@testing-library/react";
import { UserManager, Log } from "oidc-client";

import { AuthService } from "./AuthService";

jest.mock("oidc-client");

const UserManagerMock = UserManager as jest.Mock<UserManager>;

beforeEach(() => {
    UserManagerMock.prototype.events = {
        addUserLoaded: jest.fn(),
        addUserUnloaded: jest.fn(),
    };
    Log.logger = console;
});

afterEach(cleanup);

describe("AuthService()", () => {
    test("should create an instance of UserManager with correct settings", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };

        // Act
        new AuthService(oidcSettings, "/fallback");

        // Assert
        expect(UserManagerMock).toBeCalledTimes(1);
        expect(UserManagerMock).toBeCalledWith(oidcSettings);
        expect(UserManagerMock.mock.instances[0].events.addUserLoaded).toBeCalledTimes(1);
        expect(UserManagerMock.mock.instances[0].events.addUserUnloaded).toBeCalledTimes(1);
    });

    test("should not call onUserUpdated when the user is loaded but onUserUpdated is undefined", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserLoaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                email: "some email",
                role: "some role",
            },
        };
        new AuthService(oidcSettings, "/fallback");

        // Act
        const act = () => capturedCallback(oidcUser);

        // Assert
        expect(act).not.toThrow();
    });

    test("should call onUserUpdated when a valid user is loaded", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserLoaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const id = "some id";
        const accessToken = "some token";
        const name = "some name";
        const email = "some email";
        const role = "some role";
        const oidcUser: any = {
            access_token: accessToken,
            profile: {
                sub: id,
                name,
                email,
                role,
            },
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        capturedCallback(oidcUser);

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith({
            id,
            accessToken,
            name,
            email,
            role,
        });
    });

    test("should call onUserUpdated when an expired user is loaded", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserLoaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const oidcUser: any = {
            expired: true,
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        capturedCallback(oidcUser);

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when a non-expired user without a name is loaded", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserLoaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                email: "some email",
                role: "some role",
            },
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        capturedCallback(oidcUser);

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when a non-expired user without an email is loaded", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserLoaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                role: "some role",
            },
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        capturedCallback(oidcUser);

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when a non-expired user without a role is loaded", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserLoaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                email: "some email",
            },
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        capturedCallback(oidcUser);

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when the user is unloaded", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserUnloaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        capturedCallback();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should not call onUserUpdated when the user is unloaded but onUserUpdated is undefined", () => {
        // Arrange
        let capturedCallback: any;
        jest.spyOn(UserManagerMock.prototype.events, "addUserLoaded").mockImplementation((callback: any) => {
            capturedCallback = callback;
        });
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        const act = () => capturedCallback();

        // Assert
        expect(act).not.toThrow();
    });
});

describe("AuthService.initiate", () => {
    test("should not call onUserUpdated when user manager doesn't contain a user and onUserUpdated is undefined", async () => {
        /// Arrange
        const oidcUser: any = undefined;
         jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        const act = () => service.initiate();

        // Assert
        expect(act).not.toThrow();
    });
    test("should call onUserUpdated when user manager doesn't contain a user", async () => {
        /// Arrange
        const oidcUser: any = undefined;
         jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should not call onUserUpdated with refreshed user when user manager contains an expired user and onUserUpdated is undefined", async () => {
        // Arrange
        const oidcUser: any = {
            expired: true,
        };
        const refreshedOidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                email: "some email",
                role: "some role",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        jest.spyOn(UserManagerMock.prototype, "signinSilent").mockImplementation(() => Promise.resolve(refreshedOidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        const act = async () => await service.initiate();

        // Assert
        expect(act).not.toThrow();
    });

    test("should call onUserUpdated with refreshed user when user manager contains an expired user", async () => {
        // Arrange
        const oidcUser: any = {
            expired: true,
        };
        const id = "some id";
        const accessToken = "some token";
        const name = "some name";
        const email = "some email";
        const role = "some role";
        const refreshedOidcUser: any = {
            access_token: accessToken,
            profile: {
                sub: id,
                name,
                email,
                role,
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        jest.spyOn(UserManagerMock.prototype, "signinSilent").mockImplementation(() => Promise.resolve(refreshedOidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith({
            id,
            accessToken,
            name,
            email,
            role,
        });
    });

    test("should call onUserUpdated when the refreshed user does not have a name", async () => {
        // Arrange
        const oidcUser: any = {
            expired: true,
        };
        const refreshedOidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                email: "some email",
                role: "some role",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        jest.spyOn(UserManagerMock.prototype, "signinSilent").mockImplementation(() => Promise.resolve(refreshedOidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when the refreshed user does not have a email", async () => {
        // Arrange
        const oidcUser: any = {
            expired: true,
        };
        const refreshedOidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                role: "some role",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        jest.spyOn(UserManagerMock.prototype, "signinSilent").mockImplementation(() => Promise.resolve(refreshedOidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when the refreshed user does not have a role", async () => {
        // Arrange
        const oidcUser: any = {
            expired: true,
        };
        const refreshedOidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                email: "some email",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        jest.spyOn(UserManagerMock.prototype, "signinSilent").mockImplementation(() => Promise.resolve(refreshedOidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should not call onUserUpdated when user manager contains a valid user and onUserUpdated is undefined", async () => {
        // Arrange
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                email: "some email",
                role: "some role",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        const act = async () => await service.initiate();

        // Assert
        expect(act).not.toThrow();
    });

    test("should call onUserUpdated when user manager contains a valid user", async () => {
        // Arrange
        const id = "some id";
        const accessToken = "some token";
        const name = "some name";
        const email = "some email";
        const role = "some role";
        const oidcUser: any = {
            access_token: accessToken,
            profile: {
                sub: id,
                name,
                email,
                role,
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith({
            id,
            accessToken,
            name,
            email,
            role,
        });
    });

    test("should call onUserUpdated when user manager contains a non-expired user without a name", async () => {
        // Arrange
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                email: "some email",
                role: "some role",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when user manager contains a non-expired user without an email", async () => {
        // Arrange
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                role: "some role",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when user manager contains a non-expired user without a role", async () => {
        // Arrange
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                email: "some email",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should not sign in silently when user manager doesn't contain a user", async () => {
        // Arrange
        const oidcUser: any = undefined;
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        await service.initiate();

        // Assert
        expect(UserManagerMock.mock.instances[0].signinSilent).toBeCalledTimes(0);
    });

    test("should not sign in silently when user manager contains a non-expired user", async () => {
        // Arrange
        const oidcUser: any = {
            access_token: "some token",
            profile: {
                sub: "some id",
                name: "some name",
                email: "some email",
                role: "some role",
            },
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        await service.initiate();

        // Assert
        expect(UserManagerMock.mock.instances[0].signinSilent).toBeCalledTimes(0);
    });

    test("should sign in silently when user manager contains an expired user", async () => {
        // Arrange
        const oidcUser: any = {
            expired: true,
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(UserManagerMock.mock.instances[0].signinSilent).toBeCalledTimes(1);
    });

    test("should call onUserUpdated when silent sign in of an expired user fails", async () => {
        // Arrange
        const oidcUser: any = {
            expired: true,
        };
        jest.spyOn(UserManagerMock.prototype, "getUser").mockImplementation(() => Promise.resolve(oidcUser));
        jest.spyOn(UserManagerMock.prototype, "signinSilent").mockImplementation(() => Promise.reject("some error"));

        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        await service.initiate();

        // Assert
        expect(service.onUserUpdated).toBeCalledTimes(1);
        expect(service.onUserUpdated).toBeCalledWith(false);
    });
});

describe("AuthService.startSignIn", () => {
    test("should call start sign in", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        const returnUrl = "/some-path";

        // Act
        await service.startSignIn(returnUrl);

        // Assert
        expect(UserManagerMock.mock.instances[0].signinRedirect).toBeCalledTimes(1);
        expect(UserManagerMock.mock.instances[0].signinRedirect).toBeCalledWith({ data: { returnUrl } });
    });

    test("should await sign in process", async () => {
        // Arrange
        const callOrder = [];
        jest.spyOn(UserManagerMock.prototype, "signinRedirect").mockImplementation(() => new Promise(resolve => {
            setTimeout(() => {
                callOrder.push("signinRedirect");
                resolve();
            }, 0);
        }));
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        const returnUrl = "/some-path";
        callOrder.push("startSignIn - before");

        // Act
        await service.startSignIn(returnUrl);

        // Assert
        callOrder.push("startSignIn - after");
        expect(callOrder).toEqual([
            "startSignIn - before",
            "signinRedirect",
            "startSignIn - after",
        ]);
    });
});

describe("AuthService.completeSignIn", () => {
    test("should complete sign in process and return returnUrl if one is available", async () => {
        // Arrange
        const expected = "some return url";
        jest.spyOn(UserManagerMock.prototype, "signinRedirectCallback").mockImplementation(() => ({
            state: { returnUrl: expected }
        }));
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        const result = await service.completeSignIn();

        // Assert
        expect(result).toBe(expected);
    });

    test("should complete sign in process and return signInCallbackFallbackRoute if signinRedirectCallback throws", async () => {
        // Arrange
        jest.spyOn(UserManagerMock.prototype, "signinRedirectCallback").mockImplementation(() => Promise.reject("some error"));
        const oidcSettings: any = {
            hello: "world",
        };
        const expected = "some return url";
        const service = new AuthService(oidcSettings, expected);

        // Act
        const result = await service.completeSignIn();

        // Assert
        expect(result).toBe(expected);
    });

    test("should complete sign in process and return signInCallbackFallbackRoute if signinRedirectCallback returns a falsey value", async () => {
        // Arrange
        jest.spyOn(UserManagerMock.prototype, "signinRedirectCallback").mockImplementation(() => Promise.resolve(undefined));
        const oidcSettings: any = {
            hello: "world",
        };
        const expected = "some return url";
        const service = new AuthService(oidcSettings, expected);

        // Act
        const result = await service.completeSignIn();

        // Assert
        expect(result).toBe(expected);
    });

    test("should complete sign in process and return signInCallbackFallbackRoute if signinRedirectCallback returns a falsey state value", async () => {
        // Arrange
        jest.spyOn(UserManagerMock.prototype, "signinRedirectCallback").mockImplementation(() => ({
            state: undefined,
        }));
        const oidcSettings: any = {
            hello: "world",
        };
        const expected = "some return url";
        const service = new AuthService(oidcSettings, expected);

        // Act
        const result = await service.completeSignIn();

        // Assert
        expect(result).toBe(expected);
    });

    test("should complete sign in process and return signInCallbackFallbackRoute if signinRedirectCallback returns a falsey state returnUrl value", async () => {
        // Arrange
        jest.spyOn(UserManagerMock.prototype, "signinRedirectCallback").mockImplementation(() => ({
            state: { returnUrl: undefined },
        }));
        const oidcSettings: any = {
            hello: "world",
        };
        const expected = "some return url";
        const service = new AuthService(oidcSettings, expected);

        // Act
        const result = await service.completeSignIn();

        // Assert
        expect(result).toBe(expected);
    });
});

describe("AuthService.startSignOut", () => {
    test("should call start sign out", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        await service.startSignOut();

        // Assert
        expect(UserManagerMock.mock.instances[0].signoutRedirect).toBeCalledTimes(1);
    });

    test("should await sign out process", async () => {
        // Arrange
        const callOrder = [];
        jest.spyOn(UserManagerMock.prototype, "signoutRedirect").mockImplementation(() => new Promise(resolve => {
            setTimeout(() => {
                callOrder.push("signoutRedirect");
                resolve();
            }, 0);
        }));
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        callOrder.push("startSignOut - before");

        // Act
        await service.startSignOut();

        // Assert
        callOrder.push("startSignOut - after");
        expect(callOrder).toEqual([
            "startSignOut - before",
            "signoutRedirect",
            "startSignOut - after",
        ]);
    });
});

describe("AuthService.completeRefresh", () => {
    test("should call complete silent sign in", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");

        // Act
        await service.completeRefresh();

        // Assert
        expect(UserManagerMock.mock.instances[0].signinSilentCallback).toBeCalledTimes(1);
    });

    test("should await silent sign in", async () => {
        // Arrange
        const callOrder = [];
        jest.spyOn(UserManagerMock.prototype, "signinSilentCallback").mockImplementation(() => new Promise(resolve => {
            setTimeout(() => {
                callOrder.push("signinSilentCallback");
                resolve();
            }, 0);
        }));
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        callOrder.push("completeRefresh - before");

        // Act
        await service.completeRefresh();

        // Assert
        callOrder.push("completeRefresh - after");
        expect(callOrder).toEqual([
            "completeRefresh - before",
            "signinSilentCallback",
            "completeRefresh - after",
        ]);
    });
});