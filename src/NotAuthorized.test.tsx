import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";

import { useUser } from "./AuthProvider";
import { NotAuthorized } from "./NotAuthorized";

jest.mock("./AuthProvider");

const useUserMock = useUser as jest.MockedFunction<typeof useUser>;

afterEach(cleanup);

describe("NotAuthorized", () => {
    test("should not render children when user is signed in with a valid role", async () => {
        // Arrange
        const role = "some role";
        useUserMock.mockImplementation(() => ({
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role,
        }));

        // Act
        render(
            <NotAuthorized role={role}><p data-testid="assert">hello, world</p></NotAuthorized>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should render children when user is signed in with an invalid role", async () => {
        // Arrange
        useUserMock.mockImplementation(() => ({
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        }));
        const content = "hello, world";

        // Act
        render(
            <NotAuthorized role="some other role"><p data-testid="assert">{content}</p></NotAuthorized>
        );

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should not render children when user is signed in and a role isn't specified", async () => {
        // Arrange
        useUserMock.mockImplementation(() => ({
            id: "id",
            token: "some token",
            name: "some name",
            email: "some@email.com",
            role: "some role",
        }));

        // Act
        render(
            <NotAuthorized><p data-testid="assert">hello, world</p></NotAuthorized>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should render children when user is signed out", async () => {
        // Arrange
        useUserMock.mockImplementation(() => false);
        const content = "hello, world";

        // Act
        render(
            <NotAuthorized><p data-testid="assert">{content}</p></NotAuthorized>
        );

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });

    test("should not render children when user is signing in or out", () => {
        // Arrange
        useUserMock.mockImplementation(() => undefined);

        // Act
        render(
            <NotAuthorized><p data-testid="assert">hello, world</p></NotAuthorized>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });
});
