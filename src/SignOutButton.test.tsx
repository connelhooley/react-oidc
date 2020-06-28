import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import React from "react";

import { useAuth } from "./AuthProvider";
import { AuthService } from "./AuthService";
import { SignOutButton } from "./SignOutButton";

jest.mock("./AuthService");
jest.mock("./AuthProvider");

const AuthServiceMock = AuthService as jest.Mock<AuthService>;
const useAuthMock = useAuth as jest.MockedFunction<typeof useAuth>;

afterEach(cleanup);

describe("SignOutButton", () => {
    test("should start sign out on button click", async () => {
        // Arrange
        const service = new AuthServiceMock()
        useAuthMock.mockImplementation(() => ({
            defaultAuthorizedRouteRedirect: "/",
            defaultNotAuthorizedRouteRedirect: "/",
            service,
        }));

        render(
            <SignOutButton data-testid="assert">Hello</SignOutButton>
        );

        // Act
        fireEvent.click(await screen.findByTestId("assert"));

        // Assert
        expect(service.startSignOut).toHaveBeenCalledTimes(1);
    });

    test("should pass all props to underlying button", async () => {
        // Arrange
        const user = {
            id: "id",
            accessToken: "some token",
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

        // Act
        render(
            <SignOutButton id={id} className={className}>{content}</SignOutButton>
        );

        // Assert
        const element = await screen.findByRole("button");
        expect(element).toHaveTextContent(content);
        expect(element).toHaveAttribute("id", id);
        expect(element).toHaveAttribute("class", className);
    });
});