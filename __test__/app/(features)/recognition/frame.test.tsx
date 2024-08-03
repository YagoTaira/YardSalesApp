import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import FrameProcessorScreen from "@/app/(features)/recognition/frame";
import {
  useCameraPermission,
  useCameraDevice,
} from "react-native-vision-camera";
import { router } from "expo-router";

// Define a generic type for props
interface MockProps {
  [key: string]: any;
}

// Mock the external modules
jest.mock("react-native-vision-camera", () => {
  const React = require("react");
  return {
    useCameraPermission: jest.fn(),
    useCameraDevice: jest.fn(),
    Camera: React.forwardRef(
      (props: MockProps, ref: React.Ref<HTMLDivElement>) => (
        <div ref={ref as React.RefObject<HTMLDivElement>} {...props} />
      )
    ),
  };
});

jest.mock("expo-router", () => ({
  Stack: {
    Screen: () => null,
  },
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
  useFocusEffect: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  FontAwesome5: "FontAwesome5",
  Ionicons: "Ionicons",
}));

jest.mock("react-native-fs", () => ({}));
jest.mock("@bam.tech/react-native-image-resizer", () => ({}));
jest.mock("@aws-sdk/client-rekognition", () => ({}));

// Mock the Pressable component
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.Pressable = jest.fn(({ children, ...props }) => (
    <div {...props}>{children}</div>
  ));
  return RN;
});

describe("FrameProcessorScreen", () => {
  beforeEach(() => {
    (useCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: true,
      requestPermission: jest.fn(),
    });
    (useCameraDevice as jest.Mock).mockReturnValue({
      id: "back",
      position: "back",
    });
  });

  it("renders correctly with camera permission", async () => {
    const { getByTestId } = render(<FrameProcessorScreen />);

    // Verify essential elements are present
    const cameraButton = getByTestId("camera-button");
    expect(cameraButton).toBeTruthy();
    const backButton = getByTestId("back-button");
    expect(backButton).toBeTruthy();
    const flashIcon = getByTestId("flash-icon");
    expect(flashIcon).toBeTruthy();
  });

  it("renders no permission message when camera permission is not granted", () => {
    (useCameraPermission as jest.Mock).mockReturnValue({
      hasPermission: false,
      requestPermission: jest.fn(),
    });
    const { getByText } = render(<FrameProcessorScreen />);
    expect(getByText("No camera permission")).toBeTruthy();
  });

  it("toggles flash when flash icon is pressed", () => {
    const { getByTestId } = render(<FrameProcessorScreen />);
    const flashIcon = getByTestId("flash-icon");

    fireEvent.press(flashIcon);
    expect(flashIcon.props.name).toBe("flash");

    fireEvent.press(flashIcon);
    expect(flashIcon.props.name).toBe("flash-off");
  });

  it("navigates back when back button is pressed", () => {
    const { getByTestId } = render(<FrameProcessorScreen />);
    const backArrow = getByTestId("back-button");

    fireEvent.press(backArrow);
    expect(router.back).toHaveBeenCalled();
  });
});
