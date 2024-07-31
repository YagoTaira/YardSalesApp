import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import HomeScreen from "../../src/app/index";
import { router } from "expo-router";

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when user is not logged in", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
      return jest.fn();
    });

    const { queryByText } = render(<HomeScreen />);

    expect(queryByText("Welcome,")).toBeNull();
    expect(queryByText("Start")).toBeNull();
    expect(queryByText("Sign Out")).toBeNull();
  });

  it("renders correctly when user is logged in", async () => {
    const mockUser = { email: "test@example.com" };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText("Welcome,")).toBeTruthy();
      expect(getByText("test!")).toBeTruthy();
      expect(getByText("Start")).toBeTruthy();
      expect(getByText("Sign Out")).toBeTruthy();
    });
  });

  it("handles sign out correctly", async () => {
    const mockUser = { email: "test@example.com" };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });
    (signOut as jest.Mock).mockResolvedValue(undefined);

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      const signOutButton = getByText("Sign Out");
      fireEvent.press(signOutButton);
    });

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(router.replace).toHaveBeenCalledWith("/auth");
    });
  });

  it("handles sign out error", async () => {
    const mockUser = { email: "test@example.com" };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });
    const mockError = new Error("Sign out error");
    (signOut as jest.Mock).mockRejectedValue(mockError);
    console.error = jest.fn();

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      const signOutButton = getByText("Sign Out");
      fireEvent.press(signOutButton);
    });

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Error signing out: ",
        mockError
      );
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
