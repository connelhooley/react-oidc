import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Switch, Router, Route } from "react-router-dom";

import { useAuth, useUser } from "./AuthProvider";
import { AuthService } from "./AuthService";
import { NotAuthorizedRoute } from "./NotAuthorizedRoute";

jest.mock("./AuthService");
jest.mock("./AuthProvider");

const AuthServiceMock = AuthService as jest.Mock<AuthService>;
const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;
const useUserMock = useUser as jest.MockedFunction<typeof useUser>;

afterEach(cleanup);

describe("NotAuthorizedRoute", () => {
    test("should not render route when user is signed in", () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should render route when user is not signed in", async () => {
        // Arrange
        const user = false;
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should render route when user is signed in with an invalid role", async () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} role="some other role">
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should not render route when user is signed in with a valid role", () => {
        // Arrange
        const role = "some role";
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role,
        };
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} role={role}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should not render route when user is signed in and a role isn't specified", () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should not render route when user is signing in or out", () => {
        // Arrange
        const user = undefined;
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should not redirect to specified fallback route when user is not signed in", () => {
        // Arrange
        const user = false;

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const fallbackRoute = "/fallback";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} redirect={fallbackRoute}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert-fallback")).toBeNull();
    });

    test("should redirect to specified fallback route when user is signing in or out", async () => {
        // Arrange
        const user = undefined;

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const fallbackRoute = "/fallback";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} redirect={fallbackRoute}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(await screen.findByTestId("assert-fallback")).toHaveTextContent(fallbackContent);
    });

    test("should redirect to specified fallback route when user is signed in with a valid role", async () => {
        // Arrange
        const role = "some role";
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role,
        };

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const fallbackRoute = "/fallback";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} redirect={fallbackRoute} role={role}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(await screen.findByTestId("assert-fallback")).toHaveTextContent(fallbackContent);
    });

    test("should not redirect to specified fallback route when user is signed in with an invalid role", async () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const fallbackRoute = "/fallback";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} redirect={fallbackRoute} role="some other role">
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert-fallback")).toBeNull();
    });

    test("should not redirect to specified fallback route when user is signed in and a role isn't specified", () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const fallbackRoute = "/fallback";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} redirect={fallbackRoute}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should not redirect to default fallback route when a route isn't specified and the user is not signed in", () => {
        // Arrange
        const user = false;
        const fallbackRoute = "/fallback";

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: fallbackRoute,
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert-fallback")).toBeNull();
    });

    test("should redirect to default fallback route when a route isn't specified and the user is signing in or out", async () => {
        // Arrange
        const user = undefined;
        const fallbackRoute = "/fallback";

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: fallbackRoute,
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(await screen.findByTestId("assert-fallback")).toHaveTextContent(fallbackContent);
    });

    test("should redirect to default fallback route when a route isn't specified the user is signed in with a valid role", async () => {
        // Arrange
        const role = "some role";
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role,
        };
        const fallbackRoute = "/fallback";

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: fallbackRoute,
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} role={role}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(await screen.findByTestId("assert-fallback")).toHaveTextContent(fallbackContent);
    });

    test("should not redirect to default fallback route when a route isn't specified the user is signed in with an invalid role", () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        const fallbackRoute = "/fallback";

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: fallbackRoute,
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route} role="some other role">
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(screen.queryByTestId("assert-fallback")).toBeNull();
    });

    test("should redirect to default fallback route when a route isn't specified the user is signed in and a role isn't specified", async () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        const fallbackRoute = "/fallback";

        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: fallbackRoute,
            service: new AuthServiceMock(),
            user,
        }));
        useUserMock.mockImplementation(() => user);
        const history = createMemoryHistory();
        const content = "hello, world";
        const route = "/hello-world";
        const fallbackContent = "goodbye, world";
        const tree = (
            <Router history={history}>
                <Switch>
                    <NotAuthorizedRoute path={route}>
                        <p data-testid="assert">{content}</p>
                    </NotAuthorizedRoute>
                    <Route path={fallbackRoute}>
                        <p data-testid="assert-fallback">{fallbackContent}</p>
                    </Route>
                </Switch>
            </Router>
        );

        render(tree);

        // Act
        history.push(route);

        // Assert
        expect(await screen.findByTestId("assert-fallback")).toHaveTextContent(fallbackContent);
    });
});