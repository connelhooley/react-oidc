import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import { AuthService } from "./AuthService";
import { SignIn } from "./SignIn";

jest.mock("./AuthService");
jest.mock("./AuthProvider");

const AuthServiceMock = AuthService as jest.Mock<AuthService>;
const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

afterEach(cleanup);

describe("SignIn", () => {
    test("should start sign in on render", () => {
        // Arrange
        const service = new AuthServiceMock()
        const history = createMemoryHistory();
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));
        const tree = (
            <Router history={history}>
                <SignIn>Hello</SignIn>
            </Router>
        );

        // Act
        render(tree);

        // Assert
        expect(service.startSignIn).toHaveBeenCalledTimes(1);
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