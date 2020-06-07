/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/extend-expect";
import { render, screen, act } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router, Route } from "react-router";

import { AuthProvider, useUser, useAuth } from "./AuthProvider";
import { AuthService } from "./AuthService";

jest.mock("./AuthService");

const AuthServiceMock = AuthService as jest.Mock<AuthService>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

describe("AuthProvider", () => {
    test("should create and initialise AuthService on first render", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const signInCallbackFallbackRoute = "/example";
        const history = createMemoryHistory();

        // Act
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackFallbackRoute={signInCallbackFallbackRoute}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );

        // Assert
        expect(AuthServiceMock).toHaveBeenCalledTimes(1);
        expect(AuthServiceMock).toHaveBeenCalledWith(oidcSettings, signInCallbackFallbackRoute);
        expect(AuthServiceMock.mock.instances[0].initiate).toBeCalledTimes(1);
    });

    test("should create and initialise AuthService with default signInCallbackFallbackRoute when a value is not provided in props on first render", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const history = createMemoryHistory();

        // Act
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );

        // Assert
        expect(AuthServiceMock).toHaveBeenCalledTimes(1);
        expect(AuthServiceMock).toHaveBeenCalledWith(oidcSettings, "/");
        expect(AuthServiceMock.mock.instances[0].initiate).toBeCalledTimes(1);
    });

    test("should not create or initialise another AuthService when either oidcSettings or signInCallbackFallbackRoute change value", () => {
        // Arrange
        let oidcSettings: any = {
            hello: "world",
        };
        let signInCallbackFallbackRoute = "/example";
        const history = createMemoryHistory();
        const { rerender } = render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackFallbackRoute={signInCallbackFallbackRoute}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );
        oidcSettings = {
            goodbye: "world",
        };
        signInCallbackFallbackRoute = "/updated";

        // Act
        rerender(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackFallbackRoute={signInCallbackFallbackRoute}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );

        // Assert
        expect(AuthServiceMock).toHaveBeenCalledTimes(1);
        expect(AuthServiceMock.mock.instances[0].initiate).toHaveBeenCalledTimes(1);
    });

    test("should not create or initialise another AuthService when neither oidcSettings or signInCallbackFallbackRoute change value", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const signInCallbackFallbackRoute = "/example";
        const history = createMemoryHistory();
        const { rerender } = render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackFallbackRoute={signInCallbackFallbackRoute}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );

        // Act
        rerender(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackFallbackRoute={signInCallbackFallbackRoute}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );

        // Assert
        expect(AuthServiceMock).toHaveBeenCalledTimes(1);
        expect(AuthServiceMock.mock.instances[0].initiate).toHaveBeenCalledTimes(1);
    });

    test("should not create or initialise another AuthService when user update event fires", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const signInCallbackFallbackRoute = "/example";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackFallbackRoute={signInCallbackFallbackRoute}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, false));

        // Assert
        expect(AuthServiceMock).toHaveBeenCalledTimes(1);
        expect(AuthServiceMock.mock.instances[0].initiate).toHaveBeenCalledTimes(1);
    });

    test("should render children in non-sign-in routes", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackFallbackRoute="/example">
                    <p data-testid="assert">{content}</p>
                </AuthProvider>
            </Router>
        );

        // Act
        history.push("/non-sign-in-route");

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should initiate auth service on initial render in non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <p>Hello world</p>
                </AuthProvider>
            </Router>
        );

        // Act
        history.push("/non-sign-in-route");

        // Assert
        expect(AuthServiceMock.mock.instances[0].initiate).toHaveBeenCalledTimes(1);
        expect(AuthServiceMock.mock.instances[0].onUserUpdated).toBeDefined();
    });

    test("should complete sign in process in sign-in route when a signInCallbackRoute prop is not given", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };

        const redirectRoute = "/some-other-route";
        jest.spyOn(AuthServiceMock.prototype, "completeSignIn").mockImplementation(() => redirectRoute);

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <Route path={redirectRoute}>
                        <p data-testid="assert">{content}</p>
                    </Route>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push("/callback"));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeSignIn).toHaveBeenCalledTimes(1);
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should complete sign in process in sign-in route when a signInCallbackRoute prop is given", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const signInCallbackRoute = "/configured-callback";

        const redirectRoute = "/some-other-route";
        jest.spyOn(AuthServiceMock.prototype, "completeSignIn").mockImplementation(() => redirectRoute);

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackRoute={signInCallbackRoute}>
                    <Route path={redirectRoute}>
                        <p data-testid="assert">{content}</p>
                    </Route>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push(signInCallbackRoute));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeSignIn).toHaveBeenCalledTimes(1);
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should not display children while complete sign in process is in-progress", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const signInCallbackRoute = "/configured-callback";

        jest.spyOn(AuthServiceMock.prototype, "completeSignIn").mockImplementation(() => new Promise(noop));

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackRoute={signInCallbackRoute}>
                    <p data-testid="assert">{content}</p>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push(signInCallbackRoute));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeSignIn).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should display loading component while complete sign in process is in-progress if one is given", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const signInCallbackRoute = "/configured-callback";
        const loadingContent = "hello, world";
        const Loading = () => {
            return (
                <p data-testid="loading-assert">{loadingContent}</p>
            );
        };

        jest.spyOn(AuthServiceMock.prototype, "completeSignIn").mockImplementation(() => new Promise(noop));

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackRoute={signInCallbackRoute} loadingComponentFactory={() => <Loading />}>
                    <p data-testid="assert">{content}</p>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push(signInCallbackRoute));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeSignIn).toHaveBeenCalledTimes(1);
        expect(await screen.findByTestId("loading-assert")).toHaveTextContent(loadingContent);
    });

    test("should not display loading component after complete sign in process is complete if one is given", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const signInCallbackRoute = "/configured-callback";
        const loadingContent = "hello, world";
        const Loading = () => {
            return (
                <p data-testid="loading-assert">{loadingContent}</p>
            );
        };

        const redirectRoute = "/some-other-route";
        jest.spyOn(AuthServiceMock.prototype, "completeSignIn").mockImplementation(() => redirectRoute);

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} signInCallbackRoute={signInCallbackRoute} loadingComponentFactory={() => <Loading />}>
                    <p data-testid="assert">{content}</p>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push(signInCallbackRoute));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeSignIn).toHaveBeenCalledTimes(1);
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
        expect(screen.queryByTestId("loading-assert")).toBeNull();
    });

    test("should complete silent sign in process in silent-sign-in route when a silentSignInCallbackRoute prop is not given", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const loadingContent = "hello, world";
        const Loading = () => {
            return (
                <p data-testid="loading-assert">{loadingContent}</p>
            );
        };

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} loadingComponentFactory={() => <Loading />}>
                    <p data-testid="assert">{content}</p>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push("/silent-callback"));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeRefresh).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId("assert")).toBeNull();
        expect(screen.queryByTestId("loading-assert")).toBeNull();
    });

    test("should complete silent sign in process in silent-sign-in route when a silentSignInCallbackRoute prop is given", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const silentSignInCallbackRoute = "/configured-callback";
        const loadingContent = "hello, world";
        const Loading = () => {
            return (
                <p data-testid="loading-assert">{loadingContent}</p>
            );
        };

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} silentSignInCallbackRoute={silentSignInCallbackRoute} loadingComponentFactory={() => <Loading />}>
                    <p data-testid="assert">{content}</p>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push(silentSignInCallbackRoute));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeRefresh).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId("assert")).toBeNull();
        expect(screen.queryByTestId("loading-assert")).toBeNull();
    });

    test("should not display anything while silent sign in process is in-progress", async () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const silentSignInCallbackRoute = "/configured-callback";
        const loadingContent = "hello, world";
        const Loading = () => {
            return (
                <p data-testid="loading-assert">{loadingContent}</p>
            );
        };

        jest.spyOn(AuthServiceMock.prototype, "completeRefresh").mockImplementation(() => new Promise(noop));

        const content = "hello, world";
        const history = createMemoryHistory();
        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} silentSignInCallbackRoute={silentSignInCallbackRoute} loadingComponentFactory={() => <Loading />}>
                    <p data-testid="assert">{content}</p>
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => history.push(silentSignInCallbackRoute));

        // Assert
        expect(AuthServiceMock.mock.instances[0].completeRefresh).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId("assert")).toBeNull();
        expect(screen.queryByTestId("loading-assert")).toBeNull();
    });
});

describe("useUser", () => {
    test("should provide user context containing a user who is signed in to children in all non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const expectedUser = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        const history = createMemoryHistory();
        let user: any;
        const AssertComponent = () => {
            user = useUser();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, expectedUser));

        // Assert
        expect(user).toEqual(expectedUser);
    });

    test("should provide user context containing a user who is signed out to children in all non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const expectedUser = false;
        const history = createMemoryHistory();
        let user: any;
        const AssertComponent = () => {
            user = useUser();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, expectedUser));

        // Assert
        expect(user).toEqual(expectedUser);
    });

    test("should provide user context containing a user who is signing in our out to children in all non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const expectedUser = undefined;
        const history = createMemoryHistory();
        let user: any;
        const AssertComponent = () => {
            user = useUser();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, expectedUser));

        // Assert
        expect(user).toEqual(expectedUser);
    });

    test("should throw when called outside of an AuthProvider", async () => {
        // Arrange
        const AssertComponent = () => {
            useUser();
            return <></>;
        };

        // Act
        const act = () => render(<AssertComponent />);

        // Assert
        expect(act).toThrowError("useUser called outside of AuthProvider");
    });
});

describe("useAuth", () => {
    test("should provide auth context containing a user who is signed in to children in all non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const expectedUser = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        const history = createMemoryHistory();
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, expectedUser));

        // Assert
        expect(auth.user).toEqual(expectedUser);
    });

    test("should provide auth context containing a user who is signed out to children in all non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const expectedUser = false;
        const history = createMemoryHistory();
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, expectedUser));

        // Assert
        expect(auth.user).toEqual(expectedUser);
    });

    test("should provide auth context containing a user who is signing in our out to children in all non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const expectedUser = undefined;
        const history = createMemoryHistory();
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );

        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, expectedUser));

        // Assert
        expect(auth.user).toEqual(expectedUser);
    });

    test("should provide auth context containing service to children in all non-sign-in routes", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const history = createMemoryHistory();
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );
        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, false));

        // Assert
        expect(auth.service).toEqual(AuthServiceMock.mock.instances[0]);
    });

    test("should provide auth context containing defaultAuthorizedRouteRedirect to children in all non-sign-in routes when no prop is given", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const history = createMemoryHistory();
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );
        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, false));

        // Assert
        expect(auth.defaultAuthorizedRouteRedirect).toBe("/");
    });

    test("should provide auth context containing defaultAuthorizedRouteRedirect to children in all non-sign-in routes when a prop is given", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const history = createMemoryHistory();
        const defaultAuthorizedRouteRedirect = "/example";
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} defaultAuthorizedRouteRedirect={defaultAuthorizedRouteRedirect}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );
        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, false));

        // Assert
        expect(auth.defaultAuthorizedRouteRedirect).toBe(defaultAuthorizedRouteRedirect);
    });

    test("should provide auth context containing defaultNotAuthorizedRouteRedirect to children in all non-sign-in routes when no prop is given", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const history = createMemoryHistory();
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );
        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, false));

        // Assert
        expect(auth.defaultNotAuthorizedRouteRedirect).toBe("/");
    });

    test("should provide auth context containing defaultNotAuthorizedRouteRedirect to children in all non-sign-in routes when a prop is given", () => {
        // Arrange
        const oidcSettings: any = {
            hello: "world",
        };
        const history = createMemoryHistory();
        const defaultNotAuthorizedRouteRedirect = "/example";
        let auth: any;
        const AssertComponent = () => {
            auth = useAuth();
            return <></>;
        };
        history.push("/non-sign-in-route");

        render(
            <Router history={history}>
                <AuthProvider oidcSettings={oidcSettings} defaultNotAuthorizedRouteRedirect={defaultNotAuthorizedRouteRedirect}>
                    <AssertComponent />
                </AuthProvider>
            </Router>
        );
        // Act
        act(() => AuthServiceMock.mock.instances[0].onUserUpdated?.call(undefined, false));

        // Assert
        expect(auth.defaultNotAuthorizedRouteRedirect).toBe(defaultNotAuthorizedRouteRedirect);
    });

    test("should throw when called outside of an AuthProvider", async () => {
        // Arrange
        const AssertComponent = () => {
            useAuth();
            return <></>;
        };

        // Act
        const act = () => render(<AssertComponent />);

        // Assert
        expect(act).toThrowError("useAuth called outside of AuthProvider");
    });
});
