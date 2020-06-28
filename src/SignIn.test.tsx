import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router, Route } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import { AuthService } from "./AuthService";
import { SignIn } from "./SignIn";

jest.mock("./AuthService");
jest.mock("./AuthProvider");
jest.useFakeTimers();

const AuthServiceMock = AuthService as jest.Mock<AuthService>;
const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

afterEach(cleanup);

describe("SignIn", () => {
    test("should start sign in after default delay when no delay is given", () => {
        // Arrange
        const service = new AuthServiceMock();
        const history = createMemoryHistory();
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));
        const tree = (
            <Router history={history}>
                <Route path="/example">
                    <SignIn>Hello</SignIn>
                </Route>
            </Router>
        );
        render(tree);

        // Act
        history.push("/example?id=2#hello");

        // Assert
        jest.advanceTimersByTime(1000);
        expect(service.startSignIn).toHaveBeenCalledTimes(1);
        expect(service.startSignIn).toHaveBeenCalledWith("/example?id=2#hello");
    });

    test("should not start sign in before default delay when no delay is given", () => {
        // Arrange
        const service = new AuthServiceMock();
        const history = createMemoryHistory();
        useAuthMock.mockImplementation(() =>
        {
            return {
                defaultAuthorizedRouteRedirect: "/",
                defaultNotAuthorizedRouteRedirect: "/",
                service,
            };
        });
        const tree = (
            <Router history={history}>
                <Route path="/example">
                    <SignIn>Hello</SignIn>
                </Route>
            </Router>
        );
        render(tree);

        // Act
        history.push("/example?id=2#hello");

        // Assert
        jest.advanceTimersByTime(999);
        expect(service.startSignIn).toHaveBeenCalledTimes(0);
    });

    test("should start sign in after given delay when a delay is given", () => {
        // Arrange
        const service = new AuthServiceMock();
        const history = createMemoryHistory();
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));
        const delay = 2000;
        const tree = (
            <Router history={history}>
                <Route path="/example">
                    <SignIn delay={delay}>Hello</SignIn>
                </Route>
            </Router>
        );
        render(tree);

        // Act
        history.push("/example?id=2#hello");

        // Assert
        jest.advanceTimersByTime(delay);
        expect(service.startSignIn).toHaveBeenCalledTimes(1);
        expect(service.startSignIn).toHaveBeenCalledWith("/example?id=2#hello");
    });

    test("should not start sign in before given delay when a delay is given", () => {
        // Arrange
        const service = new AuthServiceMock();
        const history = createMemoryHistory();
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));
        const delay = 2000;
        const tree = (
            <Router history={history}>
                <Route path="/example">
                    <SignIn delay={delay}>Hello</SignIn>
                </Route>
            </Router>
        );
        render(tree);

        // Act
        history.push("/example?id=2#hello");

        // Assert
        jest.advanceTimersByTime(delay - 1);
        expect(service.startSignIn).toHaveBeenCalledTimes(0);
    });

    test("should render children", async () => {
        // Arrange
        const service = new AuthServiceMock()
        const history = createMemoryHistory();
        const content = "Hello";
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));
        const tree = (
            <Router history={history}>
                <SignIn><p data-testid="assert">{content}</p></SignIn>
            </Router>
        );

        // Act
        render(tree);

        // Assert
        const element = await screen.findByTestId("assert");
        expect(element).toHaveTextContent(content);
    });
});