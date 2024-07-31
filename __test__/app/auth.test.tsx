import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AuthScreen from "../../src/app/auth";

jest.mock("expo-router", () => ({
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("../../src/components/loginScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>Login Screen</Text>;
});

jest.mock("../../src/components/registerScreen", () => {
  const { Text } = require("react-native");
  return () => <Text>Register Screen</Text>;
});

describe("AuthScreen", () => {
  it("renders login screen by default", () => {
    const { getByText } = render(<AuthScreen />);
    expect(getByText("Login Screen")).toBeTruthy();
    expect(getByText("Need to register?")).toBeTruthy();
  });

  it("toggles to register screen", () => {
    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText("Need to register?"));
    expect(getByText("Register Screen")).toBeTruthy();
    expect(getByText("Already have an account?")).toBeTruthy();
  });

  it("toggles back to login screen", () => {
    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText("Need to register?"));
    fireEvent.press(getByText("Already have an account?"));
    expect(getByText("Login Screen")).toBeTruthy();
    expect(getByText("Need to register?")).toBeTruthy();
  });
});
