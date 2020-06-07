import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import React from "react";

import { Authorizing } from "./Authorizing";
import { useUser } from "./AuthProvider";

jest.mock("./AuthProvider");

const useUserMock = useUser as jest.MockedFunction<typeof useUser>;

describe("Authorizing", () => {
    test("should not render children when user is signed in", async () => {
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
            <Authorizing><p data-testid="assert">hello, world</p></Authorizing>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should not render children when user is signed out", () => {
        // Arrange
        useUserMock.mockImplementation(() => false);

        // Act
        render(
            <Authorizing><p data-testid="assert">hello, world</p></Authorizing>
        );

        // Assert
        expect(screen.queryByTestId("assert")).toBeNull();
    });

    test("should render children when user is signing in or out", async () => {
        // Arrange
        useUserMock.mockImplementation(() => undefined);
        const content = "hello, world";

        // Act
        render(
            <Authorizing><p data-testid="assert">{content}</p></Authorizing>
        );

        // Assert
        expect(await screen.findByTestId("assert")).toHaveTextContent(content);
    });
});
