import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useAuth } from "./AuthProvider";
import { AuthService } from "./AuthService";
import { SignOutButton } from "./SignOutButton";

jest.mock("./AuthService");
jest.mock("./AuthProvider");

const AuthServiceMock = AuthService as jest.Mock<AuthService>;
const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

describe("SignOutButton", () => {
    test("should start sign out on button click", async () => {
        // Arrange
        const service = new AuthServiceMock()
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));
        const tree = (
            <SignOutButton data-testid="assert">Hello</SignOutButton>
        );

        render(tree);

        // Act
        fireEvent.click(await screen.findByTestId("assert"));

        // Assert
        expect(service.startSignOut).toHaveBeenCalledTimes(1);
    });

    test("should pass all props to underlying button", async () => {
        // Arrange
        const user = {
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        };
        const service = new AuthServiceMock()
        const id = "some-id";
        const className = "some-class";
        const content = "Hello";
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
            user,
        }));
        const tree = (
            <SignOutButton id={id} className={className}>{content}</SignOutButton>
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