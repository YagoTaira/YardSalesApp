import React from "react";
import { act } from "@testing-library/react-native";
import renderer, { ReactTestRenderer } from "react-test-renderer";
import BarcodeScreen from "../../../../src/app/(features)/barcode/scanner";
import { useFocusEffect } from "expo-router";

// Mock the necessary dependencies
jest.mock("expo-router", () => ({
  Stack: {
    Screen: jest.fn().mockReturnValue(null),
  },
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: jest.fn(),
}));

jest.mock("react-native-vision-camera", () => ({
  useCameraPermission: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(),
  })),
  useCameraDevice: jest.fn(() => ({ id: "mock-device" })),
  useCodeScanner: jest.fn(() => ({
    codeTypes: ["ean-13"],
    onCodeScanned: jest.fn(),
  })),
  Camera: jest.fn().mockReturnValue(null),
}));

(useFocusEffect as jest.Mock).mockImplementation((callback) => {
  React.useEffect(callback, []);
});

describe("BarcodeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("renders correctly", async () => {
    let tree: ReactTestRenderer | undefined;
    await act(async () => {
      tree = renderer.create(<BarcodeScreen />);
    });
    expect(tree).toBeDefined();
    if (tree) {
      expect(tree.root.findByProps({ testID: "camera" })).toBeTruthy();
      expect(tree.root.findByProps({ testID: "back-button" })).toBeTruthy();
    }
  });

  it("displays error message when API request fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("API request failed")
    );

    let tree: ReactTestRenderer;

    await act(async () => {
      tree = renderer.create(<BarcodeScreen />);
    });

    // Simulate a barcode scan
    await act(async () => {
      const useCodeScannerMock =
        require("react-native-vision-camera").useCodeScanner;
      const onCodeScanned = useCodeScannerMock.mock.calls[0][0].onCodeScanned;
      await onCodeScanned([{ value: "1234567890" }]);
    });

    // Wait for state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(global.fetch).toHaveBeenCalled();

    // Re-render the component to reflect state changes
    tree!.update(<BarcodeScreen />);

    const errorMessage = tree!.root.findAll(
      (node) => node.props.children === "Failed to fetch data from API."
    );

    if (errorMessage.length === 0) {
      console.log("Component tree:");
      console.log(JSON.stringify(tree!.toJSON(), null, 2));
    }

    expect(errorMessage.length).toBeGreaterThan(0);
  });

  it("navigates to items page on successful scan", async () => {
    const mockResponse = {
      itemSummaries: [
        {
          itemId: "1",
          title: "Test Item",
          price: { value: "10.00" },
          image: { imageUrl: "http://example.com/image.jpg" },
          seller: { username: "TestSeller" },
          itemWebUrl: "http://example.com/item",
        },
      ],
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
      ok: true,
    });

    let tree: ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<BarcodeScreen />);
    });

    // Simulate a barcode scan
    await act(async () => {
      const useCodeScannerMock =
        require("react-native-vision-camera").useCodeScanner;
      const onCodeScanned = useCodeScannerMock.mock.calls[0][0].onCodeScanned;
      await onCodeScanned([{ value: "1234567890" }]);
    });

    // Wait for state updates
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(require("expo-router").router.push).toHaveBeenCalledWith({
      pathname: "/barcode/items",
      params: {
        items: expect.any(String),
      },
    });
  });
});
