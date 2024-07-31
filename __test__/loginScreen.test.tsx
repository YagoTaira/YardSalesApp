import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../src/components/loginScreen";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";
import { router } from "expo-router";

// Mock the Firebase auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock Expo Router
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn((title, message, buttons) => {
    if (buttons && buttons.length > 0 && buttons[0].onPress) {
      buttons[0].onPress();
    }
  }),
}));

describe("LoginScreen", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("updates email and password inputs", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("handles login attempt", async () => {
    const mockAuth = {};
    (getAuth as jest.Mock).mockReturnValue(mockAuth);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getAuth).toHaveBeenCalled();
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        "test@example.com",
        "password123"
      );
    });
  });

  it("handles successful login correctly", async () => {
    const mockAuth = {};
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { email: "example@email.com" },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "example@email.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        "example@email.com",
        "password123"
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        "Logged in successfully",
        expect.arrayContaining([
          expect.objectContaining({
            text: "OK",
            onPress: expect.any(Function),
          }),
        ])
      );
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error for invalid email", async () => {
    const mockAuth = {};
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/invalid-email",
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Incorrect login credentials."
      );
    });
  });
});
