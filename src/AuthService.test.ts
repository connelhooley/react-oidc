/* eslint-disable @typescript-eslint/no-explicit-any */
import { cleanup } from "@testing-library/react";
import { UserManager } from "oidc-client";

import { AuthService } from "./AuthService";

jest.mock("oidc-client");

const UserManagerMock = UserManager as jest.Mock<UserManager>;

afterEach(cleanup);

describe("AuthService()", () => {
    test("should create an instance of UserManager with correct settings", () => {
        // Arrange
        UserManagerMock.prototype.events = {
            addUserLoaded: jest.fn(),
            addUserUnloaded: jest.fn(),
        };
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

    test("should call onUserUpdated when a valid user is loaded", () => {
        // Arrange
        let capturedCallback: any;
        UserManagerMock.prototype.events = {
            addUserLoaded: jest.fn().mockImplementation((callback: any) => {
                capturedCallback = callback;
            }),
            addUserUnloaded: jest.fn(),
        };
        const oidcSettings: any = {
            hello: "world",
        };
        const id = "some id";
        const token = "some token";
        const name = "some name";
        const email = "some email";
        const role = "some role";
        const oidcUser: any = {
            access_token: token,
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
        expect(service.onUserUpdated).toBeCalledWith({
            id,
            token,
            name,
            email,
            role,
        });
    });

    test("should call onUserUpdated when an expired user is loaded", () => {
        // Arrange
        let capturedCallback: any;
        UserManagerMock.prototype.events = {
            addUserLoaded: jest.fn().mockImplementation((callback: any) => {
                capturedCallback = callback;
            }),
            addUserUnloaded: jest.fn(),
        };
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
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when a non-expired user without a name is loaded", () => {
        // Arrange
        let capturedCallback: any;
        UserManagerMock.prototype.events = {
            addUserLoaded: jest.fn().mockImplementation((callback: any) => {
                capturedCallback = callback;
            }),
            addUserUnloaded: jest.fn(),
        };
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
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when a non-expired user without an email is loaded", () => {
        // Arrange
        let capturedCallback: any;
        UserManagerMock.prototype.events = {
            addUserLoaded: jest.fn().mockImplementation((callback: any) => {
                capturedCallback = callback;
            }),
            addUserUnloaded: jest.fn(),
        };
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
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when a non-expired user without a role is loaded", () => {
        // Arrange
        let capturedCallback: any;
        UserManagerMock.prototype.events = {
            addUserLoaded: jest.fn().mockImplementation((callback: any) => {
                capturedCallback = callback;
            }),
            addUserUnloaded: jest.fn(),
        };
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
        expect(service.onUserUpdated).toBeCalledWith(false);
    });

    test("should call onUserUpdated when the user is unloaded", () => {
        // Arrange
        let capturedCallback: any;
        UserManagerMock.prototype.events = {
            addUserLoaded: jest.fn(),
            addUserUnloaded: jest.fn().mockImplementation((callback: any) => {
                capturedCallback = callback;
            }),
        };
        const oidcSettings: any = {
            hello: "world",
        };
        const service = new AuthService(oidcSettings, "/fallback");
        service.onUserUpdated = jest.fn();

        // Act
        capturedCallback();

        // Assert
        expect(service.onUserUpdated).toBeCalledWith(false);
    });
});

describe("AuthService.initiate", () => {
    test("should call onUserUpdated when user manager doesn't contain a user", () => {
        
    });

    test("should call onUserUpdated when user manager contains an expired user", () => {
        
    });

    test("should call onUserUpdated when user manager contains a valid user", () => {
        
    });

    test("should call onUserUpdated when user manager contains a non-expired user without a name", () => {
        
    });

    test("should call onUserUpdated when user manager contains a non-expired user without an email", () => {
        
    });

    test("should call onUserUpdated when user manager contains a non-expired user without a role", () => {
        
    });

    
    test("should not sign in silently when user manager doesn't contain a user", () => {
        
    });

    test("should not sign in silently when user manager contains a non-expired user", () => {
        
    });

    test("should sign in silently when user manager contains an expired user", () => {
        
    });

    test("should call onUserUpdated when silent sign in of an expured user fails", () => {
        
    });
});

describe("AuthService.startSignIn", () => {
    test("should call start sign in", () => {
        
    });
    test("should await sign in process", () => {
        
    });
});

describe("AuthService.completeSignIn", () => {
    // todo
});

describe("AuthService.startSignOut", () => {
    test("should call start sign out", () => {
        
    });
    test("should await sign out process", () => {
        
    });
});

describe("AuthService.completeRefresh", () => {
    test("should call complete silent sign in", () => {
        
    });
    test("should await silent sign in", () => {
        
    });
});