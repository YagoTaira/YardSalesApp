import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CameraScreen from "@/app/(features)/camera/camera";

// Mock the necessary modules
jest.mock("expo-router", () => ({
  Stack: {
    Screen: () => null,
  },
  useFocusEffect: jest.fn(),
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock("react-native-vision-camera", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    useCameraPermission: () => ({
      hasPermission: true,
      requestPermission: jest.fn(),
    }),
    useMicrophonePermission: () => ({
      hasPermission: true,
      requestPermission: jest.fn(),
    }),
    useCameraDevice: () => ({ some: "device" }),
    Camera: React.forwardRef(
      (props: React.JSX.IntrinsicAttributes, ref: any) => (
        <View {...props} ref={ref} testID="camera" />
      )
    ),
  };
});

jest.mock("expo-av", () => ({
  Video: () => null,
}));

jest.mock("../../../../FirebaseConfig", () => ({
  auth: {
    currentUser: { uid: "test-uid" },
  },
  storage: {},
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
}));

describe("CameraScreen", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<CameraScreen />);
    expect(getByTestId("flash-button")).toBeTruthy();
    expect(getByTestId("back-button")).toBeTruthy();
    expect(getByTestId("camera-button")).toBeTruthy();
  });

  it("toggles flash when flash button is pressed", () => {
    const { getByTestId } = render(<CameraScreen />);
    const flashButton = getByTestId("flash-button");
    // Initial state
    expect(flashButton.props.name).toBe("flash-off");
    // Toggle flash
    fireEvent.press(flashButton);
    expect(flashButton.props.name).toBe("flash");
    // Toggle flash again
    fireEvent.press(flashButton);
    expect(flashButton.props.name).toBe("flash-off");
  });

  it("navigates back when back button is pressed", () => {
    const { getByTestId } = render(<CameraScreen />);
    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);
    expect(require("expo-router").router.back).toHaveBeenCalled();
  });
});
