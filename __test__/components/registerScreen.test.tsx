import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../../src/components/registerScreen";
import { Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

jest.mock("../../FirebaseConfig", () => ({
  auth: {
    createUserWithEmailAndPassword: jest.fn(),
  },
}));

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

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Register")).toBeTruthy();
  });

  it("updates email and password inputs", () => {
    const { getByPlaceholderText } = render(<RegisterScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("handles successful registration", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { email: "test@example.com" },
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const registerButton = getByText("Register");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        "User account created successfully",
        expect.arrayContaining([
          expect.objectContaining({
            text: "OK",
            onPress: expect.any(Function),
          }),
        ])
      );
      expect(router.replace).toHaveBeenCalledWith("/auth");
    });
  });

  it("handles registration failure due to existing email", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const registerButton = getByText("Register");

    fireEvent.changeText(emailInput, "existing@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "This email is already in use"
      );
    });
  });

  it("handles registration failure due to invalid email", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/invalid-email",
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const registerButton = getByText("Register");

    fireEvent.changeText(emailInput, "invalidemail");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please enter a valid email address"
      );
    });
  });

  it("handles registration failure due to weak password", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/weak-password",
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const registerButton = getByText("Register");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "weak");
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Password should be at least 6 characters long"
      );
    });
  });

  it("handles unexpected errors during registration", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: "auth/unknown-error",
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const registerButton = getByText("Register");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "An unexpected error occurred"
      );
    });
  });
});
