import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import { AuthService } from "./AuthService";
import { SignInButton } from "./SignInButton";

jest.mock("./AuthService");
jest.mock("./AuthProvider");

const AuthServiceMock = AuthService as jest.Mock<AuthService>;
const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

afterEach(cleanup);

describe("SignInButton", () => {
    test("should start sign in on button click", async () => {
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
                <SignInButton data-testid="assert">Hello</SignInButton>
            </Router>
        );
        render(tree);

        // Act
        fireEvent.click(await screen.findByTestId("assert"));

        // Assert
        expect(service.startSignIn).toHaveBeenCalledTimes(1);
    });

    test("should pass all props to underlying button", async () => {
        // Arrange
        const service = new AuthServiceMock()
        const history = createMemoryHistory();
        const id = "some-id";
        const className = "some-class";
        const content = "Hello";
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));
        const tree = (
            <Router history={history}>
                <SignInButton id={id} className={className}>{content}</SignInButton>
            </Router>
        );

        // Act
        render(tree);

        // Assert
        const element = await screen.findByRole("button");
        expect(element).toHaveTextContent(content);
        expect(element).toHaveAttribute("id", id);
        expect(element).toHaveAttribute("class", className);
    });
});